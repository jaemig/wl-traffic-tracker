<?php

namespace App\Http\Controllers;

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
        $data = $this->data_service->getData($request->input('timerange') ?? 'd');

        return response(json_encode($data), 200);
    }
}
