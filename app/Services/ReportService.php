<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\LineType;
use App\Models\Line;
use App\Models\RelatedLine;
use App\Models\RelatedStop;
use Illuminate\Http\Request;
use App\Models\FailedRequest;
use App\Models\TrafficReport;
use App\Models\ReportCategory;
use Illuminate\Support\Facades\DB;

class ReportService {
    /**
     * Gets the current traffic report from WienerLinien and checks it for new reports or updates on existing reports
     */
    public function checkTrafficReport() {
        try {
            $wl_status = file_get_contents('https://www.wienerlinien.at/wl_realtime/trafficInfoList');
            // $wl_status = file_get_contents('https://je.webnickel.at//example_json_data.json');
        }
        catch (\Exception $e) {
            (new FailedRequest())->save();
            return true;
        }


        try {
            DB::beginTransaction();
            if (strlen($wl_status) > 0) {
                $json_data = json_decode($wl_status);
                if ($json_data->message->value != "OK" || $json_data->message->messageCode != 1) throw new \Exception;
                // $open_reports = TrafficReport::where('time_start', 'time_end')->get();

                $current_report_names = array();
                $added_traffic_cats = array();
                //Check if there are any traffic categories that are not yet in the database
                foreach ($json_data->data->trafficInfoCategories as $traffic_category) {
                    $existing_cat = ReportCategory::where('external_id', $traffic_category->id)->firstWhere('title', $traffic_category->title);

                    if (!$existing_cat) {
                        $new_cat = new ReportCategory;
                        $new_cat->external_id = $traffic_category->id;
                        $new_cat->title = $traffic_category->title;
                        $new_cat->save();
                    }
                }

                foreach ($json_data->data->trafficInfos as $traffic_info) {
                    // Check if there are any new line types that are not yet in the database
                    if (property_exists($traffic_info, 'attributes') && property_exists($traffic_info->attributes, 'relatedLineTypes')) {
                        foreach ($traffic_info->attributes->relatedLineTypes as $line_type) {
                            $existing_type = LineType::firstWhere('name', $line_type);

                            if (!$existing_type) {
                                $new_type = new LineType;
                                $new_type->name = $line_type;
                                $new_type->save();
                            }
                        }
                    }
                    [$added_traffic_cats, $cat_success] = $this->checkNewTrafficCategories($traffic_info, $json_data, $added_traffic_cats);
                    $store_success = $this->addUpdateTrafficReport($traffic_info);
                }
                $this->closeExpiredReports($current_report_names);
            }

            DB::commit();
            return true;
        }
        catch (\Exception $e) {
            DB::rollback();
            throw $e;
            return false;
        }
        $this->getElevatorInfo();
    }

    /**
     * Get all elevator disturbances and save them in the database.
     * Returns true/false depending on whether the operation was successful.
     * @return bool
     */
    public function getElevatorInfo()
    {
        try{
            DB::beginTransaction();
            $elevator_info = file_get_contents('https://www.wienerlinien.at/ogd_realtime/trafficInfoList?name=aufzugsinfo');
            // return dd($elevator_info);

            if (strlen($elevator_info) > 0)
            {
                $json_data = json_decode($elevator_info);
                if ($json_data->message->value != "OK" || $json_data->message->messageCode != 1 || !property_exists($json_data->data, 'trafficInfos')) throw new \Exception;

                $traffic_infos = $json_data->data->trafficInfos;
                $current_report_names = array();
                $added_traffic_cats = array();
                foreach ($traffic_infos as $traffic_report)
                {
                    [$added_traffic_cats, $cat_success] = $this->checkNewTrafficCategories($traffic_report, $json_data, $added_traffic_cats);
                    $store_success = $this->addUpdateTrafficReport($traffic_report);
                }

                $this->closeExpiredReports($current_report_names);
            }

            DB::commit();
            return dd('yayyyy!');
            return true;
        }
        catch (\Exception $e) {
            DB::rollback();
            throw $e;
            return false;
        }
    }

    /**
     * Checks for any new traffic categories and stores them in the database.
     * Returns an array of all added cats and true/false wether the operation was successful.
     *@param mixed current traffic report
     *@param mixed complete response json object
     *@param array already added traffic categories
     */
    private function checkNewTrafficCategories($current_report, $json_data, $added_traffic_cats)
    {
        try
        {
             // Check for any new traffic info categories, if:
            // 1. the report is categorized
            // 2. the report's category hasnt alrdy been added during the current update
            // 3. the report's category isnt already recorded
            if (property_exists($current_report, 'refTrafficInfoCategoryId') && !in_array($current_report->refTrafficInfoCategoryId, $added_traffic_cats) && property_exists($json_data, 'trafficInfoCategories') && !ReportCategory::firstWhere('external_id', $current_report->refTrafficInfoCategoryId))
            {
                foreach ($json_data->trafficInfoCategories as $traffic_category)
                {
                    array_push($added_traffic_cats, $traffic_category->id);
                    if ($traffic_category->id === $current_report->refTrafficInfoCategoryId)
                    {
                        $new_report_cat = new ReportCategory();
                        $new_report_cat->title = $traffic_category->name;
                        $new_report_cat->external_id = $traffic_category->id;
                        $new_report_cat->save();
                        break;
                    }
                }
            }
            return array($added_traffic_cats, true);
        }
        catch (\Exception $e) {
            return array($added_traffic_cats, false);
        }
    }

    /**
     * Adds a new traffic report to the database or update the existing record.
     * Returns true/false wether the operaiton was successful.
     * @param mixed $traffic_report
     */
    private function addUpdateTrafficReport($traffic_report)
    {
        try
        {
            $existing_report = TrafficReport::firstWhere('name', $traffic_report->name);
            // Format timestamps to suit the dbms' requirements
            $traffic_time_start = property_exists($traffic_report, 'time') && property_exists($traffic_report->time, 'start') ? str_replace('T', ' ', substr($traffic_report->time->start, 0, strpos($traffic_report->time->start, '.'))) : null;
            $traffic_time_end = property_exists($traffic_report, 'time') && property_exists($traffic_report->time, 'end') ? str_replace('T', ' ', substr($traffic_report->time->end, 0, strpos($traffic_report->time->end, '.'))) : null;
            $traffic_time_resume = (property_exists($traffic_report, 'time') && property_exists($traffic_report->time, 'resume')) ? str_replace('T', ' ', substr($traffic_report->time->resume, 0, strpos($traffic_report->time->resume, '.'))) : null;

            if (!$existing_report)
            {
                // Add new elevator report
                $new_report = new TrafficReport();
                $new_report->report_category_id = ReportCategory::firstWhere('external_id', $traffic_report->refTrafficInfoCategoryId)->id ?? null;
                $new_report->title = $traffic_report->title;
                $new_report->name = $traffic_report->name;
                $new_report->description = $traffic_report->description;
                $new_report->time_start = $traffic_time_start;
                $new_report->time_end = $traffic_time_end;
                $new_report->time_resume = $traffic_time_resume;
                $new_report->priority = $traffic_report->priority ?? null;
                $new_report->save();

                // Create for every report's related stop a seperate record linked to the report
                if (property_exists($traffic_report, 'relatedStops')) {
                    foreach ($traffic_report->relatedStops as $related_stop) {
                        $new_related_stop = new RelatedStop;
                        $new_related_stop->stop_id = $related_stop;
                        $new_related_stop->report_id = $new_report->id;
                        $new_related_stop->save();
                    }
                }

                // Store all related lines of the report
                // This targets only lines that are stored in the database
                if (property_exists($traffic_report, 'relatedLines')) {
                    foreach ($traffic_report->relatedLines as $related_line) {
                        $line = Line::firstWhere('name', $related_line);
                        if ($line)
                        {
                            $new_related_line = new RelatedLine;
                            $new_related_line->line_id = $related_line;
                            $new_related_line->report_id = $new_report->id;
                            $new_related_line->save();
                        }
                    }
                }
            }
            else if (!$existing_report->has_ended)
            {
                // Update existing report if any changes were made
                $changes_made = false;
                if (property_exists($traffic_report, 'priority') && $existing_report['priority'] != $traffic_report->priority) {
                    $existing_report->priority = $traffic_report->priority;
                    $changes_made = true;
                }
                if ($existing_report['time_end'] != $traffic_time_end) {
                    $existing_report->time_end = $traffic_time_end;
                    if (!$changes_made) $changes_made = true;
                }
                if ($existing_report['time_resume'] != $traffic_time_resume) {
                    $existing_report->time_resume = $traffic_time_resume;
                    if (!$changes_made) $changes_made = true;
                }
                if ($changes_made) $existing_report->save();
            }
            return true;
        }
        catch (\Exception $e) { return false; }
    }

    /**
     * Flags known reports as ended and update their end time for the last time.
     * This only targets reports that aren't in the current report for the first time since discovery.
     * Returns true/false wether the process was successful
     * @param array added report's name
     * @return bool
     */
    private function closeExpiredReports($current_report_names)
    {
        try
        {
            $open_reports = TrafficReport::where('timestamp', '!=', 'current_timestamp()')
            ->where('has_ended', 0)
            ->get();
            foreach ($open_reports as $open_report) {
                if (!in_array($open_report->name, $current_report_names)) {
                    $open_report->time_end = Carbon::now('Europe/Vienna')->toDateTimeLocalString();
                    $open_report->has_ended = 1;
                    $open_report->save();
                }
            }
            return true;
        }
        catch (\Exception $e) { return false; }
    }
}

?>
