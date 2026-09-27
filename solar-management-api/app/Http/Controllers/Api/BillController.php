<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bill\StoreBillRequest;
use App\Http\Requests\Bill\UpdateBillRequest;
use App\Models\Bill;
use App\Services\BillService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * ============================================================================
 * File:
 * app/Http/Controllers/Api/BillController.php
 *
 * Description:
 * Handles WAPDA Bill Management API operations including:
 * - Fetching bills
 * - Creating bills
 * - Fetching a single bill
 * - Updating bills
 * - Deleting bills
 * ============================================================================
 */

class BillController extends Controller
{
    /**
     * Bill Service Instance
     */
    protected BillService $billService;


    /**
     * Constructor
     */
    public function __construct(
        BillService $billService
    ) {
        $this->billService = $billService;
    }


    /**
     * Get All Bills
     */
    public function index(
        Request $request
    ): JsonResponse {

        $bills = $this->billService->getAllBills(
            $request->all()
        );


        return response()->json([

            'success' => true,

            'message' => 'Bills fetched successfully.',

            'data' => $bills,

        ]);

    }


    /**
     * Create New Bill
     */
    public function store(
        StoreBillRequest $request
    ): JsonResponse {

        $data = $request->validated();


        /*
        |--------------------------------------------------------------------------
        | Audit
        |--------------------------------------------------------------------------
        */

        $data['created_by'] = auth()->id();


        /*
        |--------------------------------------------------------------------------
        | Store Bill
        |--------------------------------------------------------------------------
        */

        $bill = $this->billService->storeBill(
            $data
        );


        return response()->json([

            'success' => true,

            'message' => 'Bill created successfully.',

            'data' => $bill,

        ], 201);

    }


    /**
     * Get Single Bill
     */
    public function show(
        Bill $bill
    ): JsonResponse {

        $bill = $this->billService->getBill(
            $bill
        );


        return response()->json([

            'success' => true,

            'message' => 'Bill fetched successfully.',

            'data' => $bill,

        ]);

    }


    /**
     * Update Existing Bill
     */
    public function update(
        UpdateBillRequest $request,
        Bill $bill
    ): JsonResponse {

        $data = $request->validated();


        /*
        |--------------------------------------------------------------------------
        | Audit
        |--------------------------------------------------------------------------
        */

        $data['updated_by'] = auth()->id();


        /*
        |--------------------------------------------------------------------------
        | Update Bill
        |--------------------------------------------------------------------------
        */

        $bill = $this->billService->updateBill(
            $bill,
            $data
        );


        return response()->json([

            'success' => true,

            'message' => 'Bill updated successfully.',

            'data' => $bill,

        ]);

    }


    /**
     * Delete Bill
     */
    public function destroy(
        Bill $bill
    ): JsonResponse {

        $this->billService->deleteBill(
            $bill
        );


        return response()->json([

            'success' => true,

            'message' => 'Bill deleted successfully.',

        ]);

    }
}