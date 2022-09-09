<?php

namespace App\Services;

use App\Models\Line;
use Carbon\Carbon;
use App\Models\TrafficReport;
use Illuminate\Support\Facades\DB;

class DataService {

    /**
     * Determines the start and end of the given timerange token
     * @param string $start
     * @param bool $is_comparison
     * @return Carbon $timerange_start, $timerange_end
     */
    private function getTimerange($timerange_token, $is_comparison = false)
    {
        if (!$is_comparison)
        {
            // Retrieves the start and end of the given time range token (week, month, year or day (default))
            // f.e. week would return the first day of the week (starting with monday) and the current day as the time range's end.
            if ($timerange_token == 'w')
            {
                $timerange_start = Carbon::now()->startOfWeek();
                $timerange_end = Carbon::now();
            }
            else if ($timerange_token == 'm')
            {
                $timerange_start = new Carbon('first day of this month');
                $timerange_end = Carbon::now();
            }
            else if ($timerange_token == 'y')
            {
                $timerange_end = Carbon::now();
                $timerange_start = $timerange_end->copy()->startOfYear();
            }
            else
            {
                $timerange_start = Carbon::now();
                $timerange_end = $timerange_start->clone();
            }
        }
        else
        {
            // Gets the previous time range in relation to the current one
            // f.e. the comparison timerange of month would be the month before the current one (from first to the last day of the month)
            if ($timerange_token == 'w')
            {
                $timerange_start = Carbon::now()->subWeek()->startOfWeek();
                $timerange_end = $timerange_start->clone()->endOfWeek();
            }
            else if ($timerange_token == 'm')
            {
                $timerange_start = new Carbon('first day of last month');
                $timerange_end = new Carbon('last day of last month');
            }
            else if ($timerange_token == 'y')
            {
                $timerange_start = Carbon::now()->subYear()->startOfYear();
                $timerange_end = $timerange_start->clone()->endOfYear();
            }
            else
            {
                $timerange_start = Carbon::now()->subDay();
                $timerange_end = $timerange_start;
            }
        }
        return array($timerange_start, $timerange_end);
    }

    /**
     * Gets all data based on the database's records
     * @param string $timerange
     */
    public function getData($timerange)
    {
        // Calculate the last request's time
        $now = Carbon::now()->timezone('Europe/Vienna');
        $minutes = $now->format('i');
        $minutes = $minutes - ($minutes % 15);
        $last_request = $now->setMinutes($minutes);

        $data = new \StdClass;
        $data->last_request = $last_request->format('d.m.Y H:i');
        $data->stats = array();

        [$timerange_start, $timerange_end] = $this->getTimerange($timerange);
        [$comparison_timerange_start, $comparison_timerange_end] = $this->getTimerange($timerange, true);

        // Get the current main stats and their trends (disturbances, delays, broken elevators, broken escalators)
        $current_stats = $this->getStatistics($timerange_start, $timerange_end);
        $comparison_stats = $this->getStatistics($comparison_timerange_start, $comparison_timerange_end);

        $stat_categories = ['nof_disturbances', 'nof_delays', 'nof_elevators', 'nof_reports'];

        foreach ($stat_categories as $stat_category)
        {
            if (property_exists($current_stats, $stat_category) && property_exists($comparison_stats, $stat_category))
            {

                $current_val = $current_stats->{$stat_category};
                $comparison_val = $comparison_stats->{$stat_category};
                $trend_val = 0;

                if ($current_val == 0 && $comparison_val == 0) $trend_val = 0;
                else if ($comparison_val == 0 && $current_val > 0) $trend_val = $current_val * 100 - 100;
                else if ($current_val == 0 && $comparison_val > 0) $trend_val = -100;
                else $trend_val = $current_val / $comparison_val * 100 - 100;

                $data->stats[$stat_category] = array(
                    'val' => $current_val,
                    'compare' => round($trend_val, 2),
                    'comapre_val' => $comparison_val
                );
            }
        }

        $data->report_history = $this->getReport($timerange_start);
        $data->report_ranking = $this->getSubwayRanking($timerange_start);
        $subway_reports = 0;

        foreach ($data->report_ranking as $subway_line)
        {
            $subway_reports += $subway_line['reports'];
        }

        $report_line_types = array(
            [
                'name' => 'U-Bahn',
                'reports' => $subway_reports
            ],
            [
                'name' => 'Str.-Bahn',
                'reports' => $this->getNofRecords($timerange_start, 'traßenbahn')
            ],
            [
                'name' => 'Bus',
                'reports' => $this->getNofRecords($timerange_start, 'bus')
            ]
        );

        $data->disturbance_length = $this->getReportDurationComparison($timerange_start);
        $data->disturbance_months = $this->getMonthComparison();
        $data->report_line_types = $report_line_types;
        $data->report_types = $this->getLineTypeReportComparison($timerange_start);
        $data->lines = $this->getListOfLines();
        return $data;
    }


    /**
     * Gets the key statistics and the corresponding trends for the given timerange
     * @param Carbon $date_start
     * @param Carbon $date_end
     * @return \StdClass
     */
    public function getStatistics($date_start, $date_end) {
        $data = new \StdClass();
        // [$timerange_start, $timerange_end] = $this->getTimerange($timerange_token);

        $data->nof_disturbances = DB::select("SELECT COUNT(*) as 'NofDists' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND :tr_end) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND :tr_end2) OR (DATE_FORMAT(time_start, '%Y-%m-%d') < :tr_start3 AND ((DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start4 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) OR DATE_FORMAT(time_end, '%Y-%m-%d') > DATE_FORMAT(NOW(), '%Y-%m-%d')))AND (title LIKE '%örung%' OR title LIKE '%insatz' OR description LIKE '%örung%')",['tr_start' => $date_start->format('Y-m-d'), 'tr_end' => $date_end->format('Y-m-d'), 'tr_start2' => $date_start->format('Y-m-d'), 'tr_end2' => $date_end->format('Y-m-d'), ':tr_start3' => $date_start->format('Y-m-d'), ':tr_start4' => $date_start->format('Y-m-d')]
        )[0]->NofDists;
        $data->nof_delays = DB::select("SELECT COUNT(*) as 'NofDelays' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND :tr_end) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND :tr_end2) OR (DATE_FORMAT(time_start, '%Y-%m-%d') < :tr_start3 AND ((DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start4 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) OR DATE_FORMAT(time_end, '%Y-%m-%d') > DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND (title LIKE '%erspätung%')", ['tr_start' => $date_start->format('Y-m-d'), 'tr_end' => $date_end->format('Y-m-d'), 'tr_start2' => $date_start->format('Y-m-d'), 'tr_end2' => $date_end->format('Y-m-d'), ':tr_start3' => $date_start->format('Y-m-d'), ':tr_start4' => $date_start->format('Y-m-d')]
        )[0]->NofDelays;
        $data->nof_elevators = DB::select("SELECT COUNT(*) as 'NofElev' FROM `traffic_reports` WHERE report_category_id  = 7 AND ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND :tr_end) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND :tr_end2) OR (DATE_FORMAT(time_start, '%Y-%m-%d') < :tr_start3 AND ((DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start4 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) OR DATE_FORMAT(time_end, '%Y-%m-%d') > DATE_FORMAT(NOW(), '%Y-%m-%d')))", ['tr_start' => $date_start->format('Y-m-d'), 'tr_end' => $date_end->format('Y-m-d'), 'tr_start2' => $date_start->format('Y-m-d'), 'tr_end2' => $date_end->format('Y-m-d'), ':tr_start3' => $date_start->format('Y-m-d'), ':tr_start4' => $date_start->format('Y-m-d')]
        )[0]->NofElev;
        $data->nof_reports = DB::select("SELECT COUNT(*) as 'NofReports' FROM `traffic_reports` WHERE (DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND :tr_end) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND :tr_end2) OR (DATE_FORMAT(time_start, '%Y-%m-%d') < :tr_start3 AND ((DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start4 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) OR DATE_FORMAT(time_end, '%Y-%m-%d') > DATE_FORMAT(NOW(), '%Y-%m-%d'))", ['tr_start' => $date_start->format('Y-m-d'), 'tr_end' => $date_end->format('Y-m-d'), 'tr_start2' => $date_start->format('Y-m-d'), 'tr_end2' => $date_end->format('Y-m-d'), ':tr_start3' => $date_start->format('Y-m-d'), ':tr_start4' => $date_start->format('Y-m-d')])[0]->NofReports;

        return $data;

    }

    /**
     * Gets the number of disturbances and delays for the given time range grouped by daytime
     * @param Carbon $date_start
     * @return array
     */
    public function getReport($date_start)
    {
        try
        {
            $disturbances = DB::select("SELECT DATE_FORMAT(timestamp, '%H') as 'hour', COUNT(*) as 'count' FROM `traffic_reports` WHERE DATE_FORMAT(timestamp, '%Y-%m-%d') >= :tr_start AND (title LIKE '%örung%' OR title LIKE '%insatz' OR description LIKE '%örung%') GROUP BY DATE_FORMAT(timestamp, '%H')", ['tr_start' => $date_start->format('Y-m-d')]);
            $delays = DB::select("SELECT DATE_FORMAT(timestamp, '%H') as 'hour', COUNT(*) as 'count' FROM `traffic_reports` WHERE DATE_FORMAT(timestamp, '%Y-%m-%d') >=  :tr_start AND (title LIKE '%erspätung%' OR description LIKE '%erspätung%') GROUP BY DATE_FORMAT(timestamp, '%H')", ['tr_start' => $date_start->format('Y-m-d')]);

            $report_history = array();
            for ($i = 0; $i < 24; $i++)
            {
                $record = array('name' => $i, 'disturbances' => 0, 'delays' => 0);

                foreach ($disturbances as $disturbance)
                {
                    if ($disturbance->hour == $i)
                    {
                        $record['disturbances'] = $disturbance->count;
                        break;
                    }
                }

                foreach ($delays as $delay)
                {
                    if ($delay->hour == $i)
                    {
                        $record['delays'] = $delay->count;
                    }
                }

                array_push($report_history, $record);
            }
            return $report_history;
        }
        catch (\Exception $e) { return array(); }
    }

    /**
     * Gets a ranking of the most reports within the given time range by subway lines
     * @param Carbon $date_start
     * @return array
     */
    public function getSubwayRanking($date_start)
    {
        try
        {
            $report_ranking = array();
            $subways = ['U1', 'U2', 'U3', 'U4', 'U6'];
            foreach ($subways as $subway)
            {
                $record = array('name' => $subway);
                $record['reports'] = DB::select("SELECT COUNT(*) as 'count' FROM `traffic_reports` WHERE ( (DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_start, '%Y-%m-%d') < :tr_start3 AND ((DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start4 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) OR DATE_FORMAT(time_end, '%Y-%m-%d') > DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND (title LIKE '%örung%' OR title LIKE '%insatz' OR description LIKE '%örung%') AND (title LIKE :subway OR description LIKE ':subway')", ['tr_start' => $date_start->format('Y-m-d'), 'subway' => '%'.$subway.'%', 'tr_start2' => $date_start->format('Y-m-d'), ':tr_start3' => $date_start->format('Y-m-d'), ':tr_start4' => $date_start->format('Y-m-d')])[0]->count;

                array_push($report_ranking, $record);
            }
            return $report_ranking;
        }
        catch (\Exception $e) { return array(); }
    }

    /**
     * Gets all records whose name or description corresponds to the given expression.
     * Description will be the same as title if not provided.
     * Returns -1 if the query fails.
     * @param Carbon $date_start
     * @param string $title
     * @param string $description
     * @return int
     */
    public function getNofRecords($date_start, $title = null, $description = null)
    {
        try
        {
            if ($title && !$description) $description = $title;
            $query = "SELECT COUNT(*) as 'count' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_start, '%Y-%m-%d') < :tr_start3 AND ((DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start4 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) OR DATE_FORMAT(time_end, '%Y-%m-%d') > DATE_FORMAT(NOW(), '%Y-%m-%d')))";

            if ($title || $description) $query .= ' AND (';
            if ($title) $query .= "title LIKE '%".(trim($title))."%'";
            if ($description) $query .= ($title ? ' OR ' : '')."description LIKE '%".(trim($description))."%'";
            if ($title || $description) $query .= ')';

            return DB::select($query, ['tr_start' => $date_start->format('Y-m-d'), 'tr_start2' => $date_start->format('Y-m-d'), ':tr_start3' => $date_start->format('Y-m-d'), ':tr_start4' => $date_start->format('Y-m-d')])[0]->count;
        }
        catch (\Exception $e) { return -1; }
    }

    /**
     * Gets all report records including day time (hour) and duration of.
     * Description will be the same as title if not specified.
     * Returns null if the query fails.
     * @param Carbon $date_start
     * @param string $title optional
     * @param string $description optional
     * @return
     */
    public function getReportDurations($date_start, $title = null, $description = null)
    {
        try
        {
            if ($title && !$description) $description = $title;
            $query = "SELECT DATE_FORMAT(time_start, '%H') as 'hour', TIMESTAMPDIFF(MINUTE, time_start, time_end) as 'duration' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_start, '%Y-%m-%d') < :tr_start3 AND ((DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start4 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) OR DATE_FORMAT(time_end, '%Y-%m-%d') > DATE_FORMAT(NOW(), '%Y-%m-%d')))";

            if ($title || $description) $query .= ' AND (';
            if ($title) $query .= "title LIKE '%".(trim($title))."%'";
            if ($description) $query .= ($title ? ' OR ' : '')."description LIKE '%".(trim($description))."%'";
            if ($title || $description) $query .= ')';

            return DB::select($query, ['tr_start' => $date_start->format('Y-m-d'), 'tr_start2' => $date_start->format('Y-m-d'), ':tr_start3' => $date_start->format('Y-m-d'), ':tr_start4' => $date_start->format('Y-m-d')]);
        }
        catch (\Exception $e) { throw $e; return null; }
    }

    /**
     * Gets a comparison of all delays/disturbances' duration within the given time range.
     * @param Carbon $date_start
     * @return array
     */
    public function getReportDurationComparison($date_start)
    {
        try
        {
            $disturbance_lengths = array();
            $disturbances_subway = DB::select("SELECT DATE_FORMAT(time_start, '%H') as 'hour', TIMESTAMPDIFF(MINUTE, time_start, time_end) as 'duration' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_start, '%Y-%m-%d') < :tr_start3 AND ((DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start4 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) OR DATE_FORMAT(time_end, '%Y-%m-%d') > DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND (title LIKE '%örung%' OR title LIKE '%insatz' OR description LIKE '%verspätung%') AND (title LIKE '%u1' OR title LIKE '%u2%' OR title LIKE '%u3%' OR title LIKE '%u4%' OR title LIKE '%u6%' OR description LIKE '%u1%' OR description LIKE '%u2%' OR description LIKE '%u3%' OR description LIKE '%u4%' OR description LIKE '%u6%') ", ['tr_start' => $date_start->format('Y-m-d'), 'tr_start2' => $date_start->format('Y-m-d'), ':tr_start3' => $date_start->format('Y-m-d'), ':tr_start4' => $date_start->format('Y-m-d')]);
            foreach ($disturbances_subway as $disturbance)
            {
                $record = array('name' => 'U-Bahn', 'x' => $disturbance->hour, 'y' => $disturbance->duration);
                array_push($disturbance_lengths, $record);
            }

            $disturbances_tram = $this->getReportDurations($date_start, 'straßenbahn');
            foreach ($disturbances_tram as $disturbance)
            {
                $record = array('name' => 'Straßenbahn', 'x' => $disturbance->hour, 'y' => $disturbance->duration);
                array_push($disturbance_lengths, $record);
            }

            $disturbances_bus = $this->getReportDurations($date_start, 'bus');
            foreach ($disturbances_bus as $disturbance)
            {
                $record = array('name' => 'Bus', 'x' => $disturbance->hour, 'y' => $disturbance->duration);
                array_push($disturbance_lengths, $record);
            }
            return $disturbance_lengths;
        }
        catch (\Exception $e) { return array(); }
    }

    /**
     * Generates a comparison between all months that have recorded at least one report
     * @return array
     */
    public function getMonthComparison()
    {
        try
        {
            $disturbances_month = array();
            for ($i = 1; $i <= 12; $i++)
            {
                $month = array(
                    'name' => $i,
                    'disturbances' => DB::select("SELECT COUNT(*) as 'count' FROM `traffic_reports` WHERE DATE_FORMAT(timestamp, '%m') = :month AND (title LIKE '%örung%' OR title LIKE '%insatz' OR description LIKE '%örung%')", ['month' => str_pad($i, 2, '0', STR_PAD_LEFT)])[0]->count,
                    'delays' => DB::select("SELECT COUNT(*) as 'count' FROM `traffic_reports` WHERE DATE_FORMAT(time_start, '%m') = :month AND (title LIKE '%verspätung%' OR description LIKE '%verspätung%')", ['month' => str_pad($i, 2, '0', STR_PAD_LEFT)])[0]->count
                );
                array_push($disturbances_month, $month);
            }
            return $disturbances_month;
        }
        catch (\Exception $e) { return array(); }
    }

    /**
     * Generates a comparison of the amount of reports within the given time range grouped by the line type (subway, trim, bus)
     * @param Carbon $date_start
     * @return array
     */
    public function getLineTypeReportComparison($date_start)
    {
        try
        {
            $report_types = array(
                [
                    'name' => 'Einsätze',
                    'reports' => $this->getNofRecords($date_start, 'einsatz')
                ],
                [
                    'name' => 'Gleisarbeiten',
                    'reports' => $this->getNofRecords($date_start, 'gleis')
                ],
                [
                    'name' => 'Schadhaftes Fahrzeug',
                    'reports' => $this->getNofRecords($date_start, 'gleis', 'schadhaft')
                ],
                [
                    'name' => 'Verkehrsbehinderung',
                    'reports' => $this->getNofRecords($date_start, 'gleis', 'behind')
                ],
                [
                    'name' => 'Sonstiges',
                    'reports' => DB::select("SELECT COUNT(*) as 'count' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_start, '%Y-%m-%d') < :tr_start3 AND ((DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start4 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) OR DATE_FORMAT(time_end, '%Y-%m-%d') > DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND NOT (title LIKE '%gleis%' OR description LIKE '%behind%') AND NOT (title LIKE '%gleis%' OR description LIKE '%schadhaft%') AND NOT (title LIKE '%gleis%' OR description LIKE '%gleis%') AND NOT (title LIKE '%einsatz%' OR description LIKE '%einsatz%')", ['tr_start' => $date_start->format('Y-m-d'), 'tr_start2' => $date_start->format('Y-m-d'), ':tr_start3' => $date_start->format('Y-m-d'), ':tr_start4' => $date_start->format('Y-m-d')])[0]->count
                ]
            );
            return $report_types;
        }
        catch (\Exception $e) { return array(); }
    }

    /**
     * Generates a sorted name list of registered lines.
     * Currently only supports subway lines.
     * @return array
     */
    public function getListOfLines()
    {
        try
        {
            $lines_list = array();
            $lines = Line::select('name')
                ->where('name', 'LIKE', 'U_')
                ->orderBy('name')
                ->get();

            foreach ($lines as $line) array_push($lines_list, $line->name);
            return $lines_list;
        }
        catch (\Exception $e) { throw $e; return array(); }
    }

    /**
     * Gets a 24h report about the chances for an disruption or delay of the specified line.
     * Returns an array containing the result as the first and the response code as the second item.
     * @param string $line
     * @return array
     */
    public function getLineReportProbability($line)
    {
        try
        {
            $line = trim($line);
            if ($line)
            {
                if (Line::firstWhere('name', $line))
                {
                     $stmt_result = DB::select("SELECT COUNT(*) AS 'reports', DATE_FORMAT(timestamp, '%H') as 'hour' FROM `traffic_reports` tr JOIN related_lines rl ON rl.report_id = tr.id WHERE (report_category_id = 8 OR report_category_id = 9) AND rl.line_id = (SELECT id FROM `lines` l WHERE l.name =:line LIMIT 1) GROUP BY DATE_FORMAT(tr.timestamp, '%H') ORDER BY hour", ['line' => $line]);

                     $first_report = TrafficReport::orderBy('timestamp')
                        ->select('timestamp')
                        ->first();

                    if (!$first_report) throw new \Exception("Could not retrieve first report record");

                    $days_diff = Carbon::createFromFormat('Y-m-d H:i:s', $first_report->timestamp)->diffInDays(Carbon::now());

                    $result = array();
                    for ($i = 0; $i < 24; $i++)
                    {
                        $found_report = null;
                        $probability_report = null;
                        foreach ($stmt_result as $report)
                        {
                            if ($report->hour == $i)
                            {
                                $found_report = $report;
                                $found_report->hour = (int)$found_report->hour;
                                break;
                            }
                        }

                        if (!$found_report) $probability_report = array('hour' => $i, 'probability' => 0);
                        else
                        {
                            $probability_report = array('hour' => $found_report->hour, 'probability' => min([$found_report->reports / $days_diff * 100, 100]));
                        }

                        array_push($result, $probability_report);
                    }

                    return [$result, 200];
                }
                return [null, 404];
            }
            return [null, 400];
        }
        catch (\Exception $e) { throw $e; return array(); }
    }

}

?>
