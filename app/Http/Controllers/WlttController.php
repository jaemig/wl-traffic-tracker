<?php

namespace App\Http\Controllers;

use App\Models\Line;
use App\Services\DataService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class WlttController extends Controller
{

    private $data_service;

    public function __construct(DataService $dataService) {
        $this->data_service = $dataService;
    }


    /**
     * Gets the traffic report data for a certain tab
     * @param Illuminate\Http\Request
     */
    public function getReportData(Request $request) {
        // $timerange = $request->input('timerange') ?? 'd';
        $data = $this->data_service->getData($request->input('timerange') ?? 'd', $request->input('lang'));

        return response(json_encode($data), 200);
    }

    /**
     * Gets the probability of disruptions at a certain transport line for each hour
     * @param string $line
     */
    public function getLineDisruptionProbability($line) {
        try
        {
            [$result, $status_code] = $this->data_service->getLineReportProbability($line);

            if ($status_code == 200) return response($result);
            else return response(array(), $status_code);
        }
        catch (\Exception $e) { return response(array(), 500); }
    }

    /**
     * Gets the share of the reports for each weekday. Optionally, a line can be provided to filter the results.
     * By specifying a language, the result's language can be forced independently of the client's setting.
     * @param Illuminate\Http\Request $request
     * @param string $line (optional)
     */
    public function getReportWeekdaysShare(Request $request, $line = null)
    {
        try
        {
            [$result, $status_code] = $this->data_service->getReportSharePerWeekday($line, $request->input('lang'));
            return response($result);
        }
        catch (\Exception $e) { return response(array(), 500); }
    }
}
