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
        | Load Area Relation
        |--------------------------------------------------------------------------
        */

        $bill->load(
            'area'
        );


        /*
        |--------------------------------------------------------------------------
        | Analyze Bill
        |--------------------------------------------------------------------------
        */

        $response = $this->analysisService->analyze(

            (float) $bill->units_consumed,

            (float) $bill->generated_units,

            (float) $bill->bill_amount

        );


        /*
        |--------------------------------------------------------------------------
        | Add Bill Specific Information
        |--------------------------------------------------------------------------
        */

        $response['analysis']['area'] =

            $bill->area?->area_name

            ?? '-';


        $response['analysis']['generation_loss_reason'] =

            $bill->generation_loss_reason

            ?? '-';


        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return response()->json(
            $response
        );

    }
}