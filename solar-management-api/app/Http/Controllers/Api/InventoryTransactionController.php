<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryTransaction;
use App\Services\InventoryTransactionService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryTransactionController extends Controller
{
    /**
 * Inventory Transaction Service
 */
protected InventoryTransactionService $inventoryTransactionService;

/**
 * Constructor
 */
public function __construct(
    InventoryTransactionService $inventoryTransactionService
) {

    $this->inventoryTransactionService =
        $inventoryTransactionService;

}
    /**
     * Display Inventory Transaction History
     */
    public function index(Request $request): JsonResponse
    {
        $query = InventoryTransaction::with([
            'inventoryItem',
            'fromArea',
            'toArea',
            'user',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if ($request->filled('search')) {

            $search = $request->search;

            $query->whereHas('inventoryItem', function ($q) use ($search) {

                $q->where('item_name', 'LIKE', "%{$search}%")
                    ->orWhere('serial_number', 'LIKE', "%{$search}%");

            });

        }

        /*
        |--------------------------------------------------------------------------
        | Transaction Type
        |--------------------------------------------------------------------------
        */

        if ($request->filled('transaction_type')) {

            $query->where(
                'transaction_type',
                $request->transaction_type
            );

        }

        /*
        |--------------------------------------------------------------------------
        | User
        |--------------------------------------------------------------------------
        */

        if ($request->filled('user_id')) {

            $query->where(
                'user_id',
                $request->user_id
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Area
        |--------------------------------------------------------------------------
        */

        if ($request->filled('area_id')) {

            $query->where(function ($q) use ($request) {

                $q->where('from_area_id', $request->area_id)
                    ->orWhere('to_area_id', $request->area_id);

            });

        }

        /*
        |--------------------------------------------------------------------------
        | Date
        |--------------------------------------------------------------------------
        */

        if ($request->filled('date')) {

            $query->whereDate(
                'created_at',
                $request->date
            );

        }

        /*
        |--------------------------------------------------------------------------
        | Latest First
        |--------------------------------------------------------------------------
        */

        $transactions = $query
            ->latest()
            ->paginate(
                $request->get('per_page', 10)
            );

        return response()->json([

            'success' => true,

            'message' => 'Inventory Transaction History fetched successfully.',

            'data' => $transactions,

        ]);
    }

    /**
 * Display Single Transaction
 */
public function show(
    InventoryTransaction $inventoryTransaction
): JsonResponse {

    $inventoryTransaction->load([

        'inventoryItem',

        'fromArea',

        'toArea',

        'user',

    ]);

    return response()->json([

        'success' => true,

        'message' => 'Transaction details fetched successfully.',

        'data' => $inventoryTransaction,

    ]);
}

/**
 * Delete Transaction
 */
public function destroy(
    InventoryTransaction $inventoryTransaction
): JsonResponse {

    try {

        $this->inventoryTransactionService
            ->deleteTransaction(
                $inventoryTransaction
            );

        return response()->json([

            'success' => true,

            'message' => 'Transaction deleted successfully.',

        ]);

    } catch (Exception $exception) {

        return response()->json([

            'success' => false,

            'message' => $exception->getMessage(),

        ], 500);

    }

}
}