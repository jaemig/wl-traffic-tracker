<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Carbon\Carbon;
use App\Models\LineType;
use App\Models\RelatedLine;
use App\Models\RelatedStop;
use Illuminate\Http\Request;
use App\Models\TrafficReport;
use App\Models\ReportCategory;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function __construct(ReportService $reportService) {
        $this->report_service = $reportService;
    }
    /**
     * Gets the current traffic report from WienerLinien and checks it for new reports or updates on existing reports
     * @param Illuminate\Http\Request
     */
    public function checkTrafficReport(Request $request) {
        $was_success = $this->report_service->checkTrafficReport();
        return response('', $was_success ? 200 : 500);
    }
}
