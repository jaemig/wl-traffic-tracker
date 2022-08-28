<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\LineType;
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


                    $existing_report = TrafficReport::firstWhere('name', $traffic_info->name);

                    $traffic_time_start = property_exists($traffic_info, 'time') && property_exists($traffic_info->time, 'start') ? str_replace('T', ' ', substr($traffic_info->time->start, 0, strpos($traffic_info->time->start, '.'))) : null;
                    $traffic_time_end = property_exists($traffic_info, 'time') && property_exists($traffic_info->time, 'end') ? str_replace('T', ' ', substr($traffic_info->time->end, 0, strpos($traffic_info->time->end, '.'))) : null;
                    $traffic_time_resume = (property_exists($traffic_info, 'time') && property_exists($traffic_info->time, 'resume')) ? str_replace('T', ' ', substr($traffic_info->time->resume, 0, strpos($traffic_info->time->resume, '.'))) : null;
                    // Create a new traffic report
                    if (!$existing_report) {
                        try {
                            $new_report = new TrafficReport();
                            $new_report->report_category_id = ReportCategory::firstWhere('external_id', $traffic_info->refTrafficInfoCategoryId)->id ?? null;
                            $new_report->title = $traffic_info->title;
                            $new_report->name = $traffic_info->name;
                            $new_report->description = $traffic_info->description;
                            $new_report->time_start = $traffic_time_start;
                            $new_report->time_end = $traffic_time_end;
                            $new_report->time_resume = $traffic_time_resume;
                            $new_report->priority = $traffic_info->priority ?? null;
                            $new_report->save();

                            //Create for every report's related line a seperate record linked to the report
                            if (property_exists($traffic_info, 'relatedLines') && property_exists($traffic_info, 'attributes') && property_exists($traffic_info->attributes, 'relatedLineTyoes')) {
                                foreach ($traffic_info->relatedLines as $related_line) {
                                    $related_line_type = "";
                                    // Check if any of the related lines are of a line type that is not yet in the database
                                    foreach ($traffic_info->attributes->relatedLineTypes as $key => $related_line_type) {
                                        if (trim($key) === $related_line) {
                                            $related_line_type = $traffic_info->attributes->relatedLineTypes->{$key};
                                            break;
                                        }
                                    }
                                    $new_related_line = new RelatedLine;
                                    $new_related_line->name = $related_line;
                                    $new_related_line->report_id = $new_report->id;
                                    $new_related_line->line_type_id = $related_line_type ?? null;
                                    $new_related_line->save();
                                }
                            }

                            // Create for every report's related stop a seperate record linked to the report
                            if (property_exists($traffic_info, 'relatedStops')) {
                                foreach ($traffic_info->relatedStops as $related_stop) {
                                    $new_related_stop = new RelatedStop;
                                    $new_related_stop->stop_id = $related_stop;
                                    $new_related_stop->report_id = $new_report->id;
                                    $new_related_stop->save();
                                }
                            }
                        }
                        catch (\Exception $e) { throw $e;}
                    } else if(!$existing_report->has_ended) {
                        // Check if existing reports have recieved any updates in the meantime
                        $changes_made = false;
                        if (property_exists($traffic_info, 'priority') && $existing_report['priority'] != $traffic_info->priority) {
                            $existing_report->priority = $traffic_info->priority;
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
                    array_push($current_report_names, $traffic_info->name);
                }

                // Determine reports that have ended as they are missing in the current report list
                // and set their official time end to the current timestamp
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
            }

            DB::commit();
            return true;
        }
        catch (\Exception $e) {
            DB::rollback();
            // throw $e;
            return false;
        }
    }
}

?>
