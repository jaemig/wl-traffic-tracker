<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\TrafficReport;
use Illuminate\Support\Facades\DB;

class DataService {
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

        // Get the current main stats (disturbances, delays, broken elevators, broken escalators)
        if ($timerange == 'w')
        {
            $timerange_start = Carbon::now()->startOfWeek();
            $timerange_end = Carbon::now();
        }
        else if ($timerange == 'm')
        {
            $timerange_start = new Carbon('first day of this month');
            $timerange_end = Carbon::now();
        }
        else if ($timerange == 'y')
        {
            $timerange_start = new Carbon('first day of this year');
            $timerange_end = Carbon::now();
        }
        else
        {
            $timerange_start = Carbon::now();
            $timerange_end = $timerange_start->clone();
        }

        $nof_disturbances = DB::select("SELECT COUNT(*) as 'NofDists' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND :tr_end) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND :tr_end2)) AND (title LIKE '%örung%' OR title LIKE '%insatz' OR description LIKE '%örung%')",
            ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_end' => $timerange_end->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d'), 'tr_end2' => $timerange_end->format('Y-m-d')]
        )[0]
            ->NofDists;
        $nof_delays = DB::select("SELECT COUNT(*) as 'NofDelays' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND :tr_end) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND :tr_end2)) AND (title LIKE '%erspätung%')",
            ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_end' => $timerange_end->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d'), 'tr_end2' => $timerange_end->format('Y-m-d')]
        )[0]
            ->NofDelays;
        $nof_elevators = DB::select("SELECT COUNT(*) as 'NofElev' FROM `traffic_reports` WHERE report_category_id  = 7 AND ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND :tr_end) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND :tr_end2))",
            ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_end' => $timerange_end->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d'), 'tr_end2' => $timerange_end->format('Y-m-d')]
        )[0]
            ->NofElev;
        $nof_reports = DB::select("SELECT COUNT(*) as 'NofReports' FROM `traffic_reports` WHERE (DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND :tr_end) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND :tr_end2)",
            ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_end' => $timerange_end->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d'), 'tr_end2' => $timerange_end->format('Y-m-d')]
        )[0]
            ->NofReports;

        // Get the main stats from the given timerange to allow a comparison between the current and the previous stats
        if ($timerange == 'w')
        {
            $compare_timerange_start = Carbon::now()->subWeek()->startOfWeek();
            $compare_timerange_end = $compare_timerange_start->clone()->endOfWeek();
        }
        else if ($timerange == 'm')
        {
            $compare_timerange_start = new Carbon('first day of last month');
            $compare_timerange_end = new Carbon('last day of last month');
        }
        else if ($timerange == 'y')
        {
            $compare_timerange_start = new Carbon('first day of last year');
            $compare_timerange_end = new Carbon('last day of last year');
        }
        else
        {
            $compare_timerange_start = Carbon::now()->subDay();
            $compare_timerange_end = $compare_timerange_start;
        }

        $compare_nof_disturbances = DB::select("SELECT COUNT(*) as 'NofDists' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND :tr_end) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND :tr_end2)) AND (title LIKE '%örung%' OR title LIKE '%insatz' OR description LIKE '%örung%')",
            ['tr_start' => $compare_timerange_start->format('Y-m-d'), 'tr_end' => $compare_timerange_end->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d'), 'tr_end2' => $timerange_end->format('Y-m-d')]
        )[0]
            ->NofDists;
        $compare_nof_delays = DB::select("SELECT COUNT(*) as 'NofDelays' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND :tr_end) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND :tr_end2)) AND (title LIKE '%erspätung%')",
            ['tr_start' => $compare_timerange_start->format('Y-m-d'), 'tr_end' => $compare_timerange_end->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d'), 'tr_end2' => $timerange_end->format('Y-m-d')]
        )[0]
            ->NofDelays;
        $compare_nof_elevators = DB::select("SELECT COUNT(*) as 'NofElev' FROM `traffic_reports` WHERE report_category_id  = 7 AND ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND :tr_end) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND :tr_end2))",
            ['tr_start' => $compare_timerange_start->format('Y-m-d'), 'tr_end' => $compare_timerange_end->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d'), 'tr_end2' => $timerange_end->format('Y-m-d')]
        )[0]
            ->NofElev;
        $compare_nof_reports = DB::select("SELECT COUNT(*) as 'NofReports' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND :tr_end) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND :tr_end2))",
            ['tr_start' => $compare_timerange_start->format('Y-m-d'), 'tr_end' => $compare_timerange_end->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d'), 'tr_end2' => $timerange_end->format('Y-m-d')]
        )[0]
            ->NofReports;

        $data->nof_disturbances = ['val' => $nof_disturbances, 'compare' => round(($nof_disturbances > 0 ? $nof_disturbances : 1) / ($compare_nof_disturbances > 0 ? $compare_nof_disturbances : 1)  * 100 - 100, 2)];
        $data->nof_delays = ['val' => $nof_delays, 'compare' => round(($nof_delays > 0 ? $nof_delays : 1) / ($compare_nof_delays > 0 ? $compare_nof_delays : 1) * 100 - 100, 2)];
        $data->nof_elevators = ['val' => $nof_elevators, 'compare' => round(($nof_elevators > 0 ? $nof_elevators : 1) / ($compare_nof_elevators > 0 ? $compare_nof_elevators : 1) * 100 - 100, 2)];
        $data->nof_reports = ['val' => $nof_reports, 'compare' => round(($nof_reports > 0 ? $nof_reports : 1) / ($compare_nof_reports > 0 ? $compare_nof_reports : 1) * 100 - 100, 2)];


        // Report history of the last 24 hours
        $disturbances = DB::select("SELECT DATE_FORMAT(timestamp, '%H') as 'hour', COUNT(*) as 'count' FROM `traffic_reports` WHERE DATE_FORMAT(timestamp, '%Y-%m-%d') >= :tr_start AND (title LIKE '%örung%' OR title LIKE '%insatz' OR description LIKE '%örung%') GROUP BY DATE_FORMAT(timestamp, '%H')", ['tr_start' => $timerange_start->format('Y-m-d')]);
        $delays = DB::select("SELECT DATE_FORMAT(timestamp, '%H') as 'hour', COUNT(*) as 'count' FROM `traffic_reports` WHERE DATE_FORMAT(timestamp, '%Y-%m-%d') >=  :tr_start AND (title LIKE '%erspätung%' OR description LIKE '%erspätung%') GROUP BY DATE_FORMAT(timestamp, '%H')", ['tr_start' => $timerange_start->format('Y-m-d')]);

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

        $report_ranking = array();
        $subways = ['U1', 'U2', 'U3', 'U4', 'U6'];
        $subway_nof_reports = 0;
        foreach ($subways as $subway)
        {
            $record = array('name' => $subway);
            $record['reports'] = DB::select("SELECT COUNT(*) as 'count' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND (title LIKE '%örung%' OR title LIKE '%insatz' OR description LIKE '%örung%') AND (title LIKE :subway OR description LIKE ':subway')", ['tr_start' => $timerange_start->format('Y-m-d'), 'subway' => '%'.$subway.'%', 'tr_start2' => $timerange_start->format('Y-m-d')])[0]->count;

            array_push($report_ranking, $record);
            $subway_nof_reports += $record['reports'];
        }

        $report_line_types = array(
            [
                'name' => 'U-Bahn',
                'reports' => $subway_nof_reports
            ],
            [
                'name' => 'Str.-Bahn',
                'reports' => DB::select("SELECT COUNT(*) as 'count' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND (title LIKE '%traßenbahn%' OR description LIKE '%traßenbahn%')", ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d')])[0]->count
            ],
            [
                'name' => 'Bus',
                'reports' => DB::select("SELECT COUNT(*) as 'count' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND (title LIKE '%bus%' OR description LIKE '%bus%')", ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d')])[0]->count
            ]
        );


        $report_types = array(
            [
                'name' => 'Einsätze',
                'reports' => DB::select("SELECT COUNT(*) as 'count' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND (title LIKE '%einsatz%' OR description LIKE '%einsatz%')", ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d')])[0]->count
            ],
            [
                'name' => 'Gleisarbeiten',
                'reports' => DB::select("SELECT COUNT(*) as 'count' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND (title LIKE '%gleis%' OR description LIKE '%gleis%')", ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d')])[0]->count
            ],
            [
                'name' => 'Schadhaftes Fahrzeug',
                'reports' => DB::select("SELECT COUNT(*) as 'count' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND (title LIKE '%gleis%' OR description LIKE '%schadhaft%')", ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d')])[0]->count
            ],
            [
                'name' => 'Verkehrsbehinderung',
                'reports' => DB::select("SELECT COUNT(*) as 'count' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND (title LIKE '%gleis%' OR description LIKE '%behind%')", ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d')])[0]->count
            ],
            [
                'name' => 'Sonstiges',
                'reports' => DB::select("SELECT COUNT(*) as 'count' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND NOT (title LIKE '%gleis%' OR description LIKE '%behind%') AND NOT (title LIKE '%gleis%' OR description LIKE '%schadhaft%') AND NOT (title LIKE '%gleis%' OR description LIKE '%gleis%') AND NOT (title LIKE '%einsatz%' OR description LIKE '%einsatz%')", ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d')])[0]->count
            ]
        );

        $disturbance_lengths = array();

        $disturbances_subway = DB::select("SELECT DATE_FORMAT(time_start, '%H') as 'hour', TIMESTAMPDIFF(MINUTE, time_start, time_end) as 'duration' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND (title LIKE '%örung%' OR title LIKE '%insatz' OR description LIKE '%verspätung%') AND (title LIKE '%u1' OR title LIKE '%u2%' OR title LIKE '%u3%' OR title LIKE '%u4%' OR title LIKE '%u6%' OR description LIKE '%u1%' OR description LIKE '%u2%' OR description LIKE '%u3%' OR description LIKE '%u4%' OR description LIKE '%u6%')",
            ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d')]
        );
        foreach ($disturbances_subway as $disturbance)
        {
            $record = array('name' => 'U-Bahn', 'x' => $disturbance->hour, 'y' => $disturbance->duration);
            array_push($disturbance_lengths, $record);
        }

        $disturbances_tram = DB::select("SELECT DATE_FORMAT(time_start, '%H') as 'hour', TIMESTAMPDIFF(MINUTE, time_start, time_end) as 'duration' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND (title LIKE '%straßenbahn%' OR description LIKE '%straßenbahn%')", ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d')]);
        foreach ($disturbances_tram as $disturbance)
        {
            $record = array('name' => 'Straßenbahn', 'x' => $disturbance->hour, 'y' => $disturbance->duration);
            array_push($disturbance_lengths, $record);
        }

        $disturbances_bus = DB::select("SELECT DATE_FORMAT(time_start, '%H') as 'hour', TIMESTAMPDIFF(MINUTE, time_start, time_end) as 'duration' FROM `traffic_reports` WHERE ((DATE_FORMAT(time_start, '%Y-%m-%d') BETWEEN :tr_start AND DATE_FORMAT(NOW(), '%Y-%m-%d')) OR (DATE_FORMAT(time_end, '%Y-%m-%d') BETWEEN :tr_start2 AND DATE_FORMAT(NOW(), '%Y-%m-%d'))) AND (title LIKE '%bus%' OR description LIKE '%bus%')", ['tr_start' => $timerange_start->format('Y-m-d'), 'tr_start2' => $timerange_start->format('Y-m-d')]);
        foreach ($disturbances_bus as $disturbance)
        {
            $record = array('name' => 'Bus', 'x' => $disturbance->hour, 'y' => $disturbance->duration);
            array_push($disturbance_lengths, $record);
        }

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


        $data->report_history = $report_history;
        $data->report_ranking = $report_ranking;
        $data->report_line_types = $report_line_types;
        $data->report_types = $report_types;
        $data->disturbance_length = $disturbance_lengths;
        $data->disturbance_months = $disturbances_month;

        return $data;
    }
}

?>
