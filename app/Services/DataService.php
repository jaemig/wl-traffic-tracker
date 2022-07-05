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
        $now = Carbon::now();
        $minutes = $now->format('i');
        $minutes = $minutes - ($minutes % 15);
        $last_request = $now->setMinutes($minutes);

        $data = new \StdClass;
        $data->last_request = $last_request->format('d.m.Y H:i');

        // Get the current main stats (disturbances, delays, broken elevators, broken escalators)
        $nof_disturbances = DB::select(DB::raw("SELECT COUNT(*) as 'NofDists' FROM `traffic_reports` WHERE (DATE_FORMAT(time_start, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d') || DATE_FORMAT(time_end, '%Y-%m-%d') >= DATE_FORMAT(NOW(), '%Y-%m-%d')) AND (title LIKE '%örung%')"))[0]->NofDists;
        $nof_delays = DB::select(DB::raw("SELECT COUNT(*) as 'NofDelays' FROM `traffic_reports` WHERE (DATE_FORMAT(time_start, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d') || DATE_FORMAT(time_end, '%Y-%m-%d') >= DATE_FORMAT(NOW(), '%Y-%m-%d')) AND (title LIKE '%erspätung%')"))[0]->NofDelays;
        $nof_elevators = DB::select(DB::raw("SELECT COUNT(*) as 'NofElev' FROM `traffic_reports` WHERE report_category_id  = 7 AND (DATE_FORMAT(time_start, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d') || DATE_FORMAT(time_end, '%Y-%m-%d') >= DATE_FORMAT(NOW(), '%Y-%m-%d'));"))[0]->NofElev;
        $nof_reports = DB::select(DB::raw("SELECT COUNT(*) as 'NofReports' FROM `traffic_reports` WHERE DATE_FORMAT(time_start, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d') || DATE_FORMAT(time_end, '%Y-%m-%d') >= DATE_FORMAT(NOW(), '%Y-%m-%d')"))[0]->NofReports;

        // Get the main stats from the given timerange to allow a comparison between the current and the previous stats
        $compare_timerange = '1 DAY';
        if ($timerange == 'w') $compare_timerange = '1 WEEK';
        else if ($timerange == 'm') $compare_timerange = '1 MONTH';
        else if ($timerange == 'y') $compare_timerange = '1 YEAR';

        $compare_nof_disturbances = DB::select(DB::raw("SELECT COUNT(*) as 'NofDists' FROM `traffic_reports` WHERE (DATE_FORMAT(DATE_SUB(time_start, INTERVAL ".$compare_timerange."), '%Y-%m-%d') = DATE_FORMAT(DATE_SUB(NOW(), INTERVAL ".$compare_timerange."), '%Y-%m-%d') || DATE_FORMAT(DATE_SUB(time_end, INTERVAL ".$compare_timerange."), '%Y-%m-%d') >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL ".$compare_timerange."), '%Y-%m-%d')) AND (title LIKE '%örung%')"))[0]->NofDists;
        $compare_nof_delays = DB::select(DB::raw("SELECT COUNT(*) as 'NofDelays' FROM `traffic_reports` WHERE (DATE_FORMAT(DATE_SUB(time_start, INTERVAL ".$compare_timerange."), '%Y-%m-%d') = DATE_FORMAT(DATE_SUB(NOW(), INTERVAL ".$compare_timerange."), '%Y-%m-%d') || DATE_FORMAT(DATE_SUB(time_end, INTERVAL ".$compare_timerange."), '%Y-%m-%d') >= DATE_FORMAT(DATE_SUB(time_end, INTERVAL ".$compare_timerange."), '%Y-%m-%d')) AND (title LIKE '%erspätung%')"))[0]->NofDelays;
        $compare_nof_elevators = DB::select(DB::raw("SELECT COUNT(*) as 'NofElev' FROM `traffic_reports` WHERE report_category_id  = 7 AND (DATE_FORMAT(time_start, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d') || DATE_FORMAT(time_start, '%Y-%m-%d') >= DATE_FORMAT(NOW(), '%Y-%m-%d'));"))[0]->NofElev;
        $compare_nof_reports = DB::select(DB::raw("SELECT COUNT(*) as 'NofReports' FROM `traffic_reports` WHERE DATE_FORMAT(time_start, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d') || DATE_FORMAT(time_start, '%Y-%m-%d') >= DATE_FORMAT(NOW(), '%Y-%m-%d')"))[0]->NofReports;

        $data->nof_disturbances = ['val' => $nof_disturbances, 'compare' => round($nof_disturbances / $compare_nof_disturbances * 100, 2)];
        $data->nof_delays = ['val' => $nof_delays, 'compare' => round($nof_delays / $compare_nof_delays * 100, 2)];
        $data->nof_elevators = ['val' => $nof_elevators, 'compare' => round($nof_elevators / $compare_nof_elevators * 100, 2)];
        $data->nof_reports = ['val' => $nof_reports, 'compare' => round($nof_reports / $compare_nof_reports * 100, 2)];
        return $data;
    }
}

?>
