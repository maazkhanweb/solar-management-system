<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Services\Analysis\BillAnalysisService;
use Illuminate\Http\JsonResponse;

class BillAnalysisController extends Controller
{
    /**
     * Bill Analysis Service
     */
    protected BillAnalysisService $analysisService;

    /**
     * Constructor
     */
    public function __construct(
        BillAnalysisService $analysisService
    ) {

        $this->analysisService = $analysisService;

    }

    /**
     * Analyze Bill
     */
    public function analyze(
        Bill $bill
    ): JsonResponse {

        /*
        |--------------------------------------------------------------------------
        | Calculate Analysis
        |--------------------------------------------------------------------------
        */

        $analysis = $this->analysisService->analyze(

    (float) $bill->units_consumed,

    (float) $bill->generated_units,

    (float) $bill->bill_amount,

    $bill->generation_loss_reason

);

        /*
        |--------------------------------------------------------------------------
        | Extra Information
        |--------------------------------------------------------------------------
        */

        $analysis['consumer_name'] = $bill->consumer_name;

        $analysis['reference_number'] = $bill->reference_number;

        $analysis['area_name'] = optional($bill->area)->area_name;

        $analysis['bill_amount'] = $bill->bill_amount;

        $analysis['generation_loss_reason'] =
            $bill->generation_loss_reason;

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json($analysis);

    }
}