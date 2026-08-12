<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Bill\StoreBillRequest;
use App\Http\Requests\Bill\UpdateBillRequest;
use App\Models\Bill;
use App\Services\BillService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillController extends Controller
{
    protected BillService $billService;

    public function __construct(BillService $billService)
    {
        $this->billService = $billService;
    }

    /**
     * Display all bills.
     */
    public function index(Request $request): JsonResponse
    {
        $bills = $this->billService->getAllBills($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Bills fetched successfully.',
            'data' => $bills,
        ]);
    }

    /**
     * Store new bill.
     */
    public function store(StoreBillRequest $request): JsonResponse
    {
        $data = $request->validated();

        $data['created_by'] = auth()->id();

        $bill = $this->billService->storeBill($data);

        return response()->json([
            'success' => true,
            'message' => 'Bill created successfully.',
            'data' => $bill,
        ], 201);
    }

    /**
     * Display single bill.
     */
    public function show(Bill $bill): JsonResponse
    {
        $bill = $this->billService->getBill($bill);

        return response()->json([
            'success' => true,
            'message' => 'Bill fetched successfully.',
            'data' => $bill,
        ]);
    }

    /**
     * Update bill.
     */
    public function update(UpdateBillRequest $request, Bill $bill): JsonResponse
    {
        $data = $request->validated();

        $data['updated_by'] = auth()->id();

        $bill = $this->billService->updateBill($bill, $data);

        return response()->json([
            'success' => true,
            'message' => 'Bill updated successfully.',
            'data' => $bill,
        ]);
    }

    /**
     * Delete bill.
     */
    public function destroy(Bill $bill): JsonResponse
    {
        $this->billService->deleteBill($bill);

        return response()->json([
            'success' => true,
            'message' => 'Bill deleted successfully.',
        ]);
    }
}