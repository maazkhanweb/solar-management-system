<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreInventoryRequest;
use App\Http\Requests\Inventory\UpdateInventoryRequest;
use App\Models\InventoryItem;
use App\Services\InventoryService;
use Illuminate\Http\JsonResponse;
use Exception;

class InventoryController extends Controller
{
    /**
     * Inventory Service
     */
    protected InventoryService $inventoryService;

    /**
     * Constructor
     */
    public function __construct(
        InventoryService $inventoryService
    ) {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Display All Inventory Items
     */
    public function index(): JsonResponse
    {
        try {

            $inventory = $this->inventoryService->getAll();

            return response()->json([
                'success' => true,
                'message' => 'Inventory retrieved successfully.',
                'data' => $inventory,
            ], 200);

        } catch (Exception $exception) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve inventory.',
                'error' => $exception->getMessage(),
            ], 500);

        }
    }

    /**
     * Store New Inventory Item
     */
    public function store(
        StoreInventoryRequest $request
    ): JsonResponse
    {
        try {

            $inventory = $this->inventoryService->store(
                $request->validated()
            );

            return response()->json([
                'success' => true,
                'message' => 'Inventory item created successfully.',
                'data' => $inventory,
            ], 201);

        } catch (Exception $exception) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to create inventory item.',
                'error' => $exception->getMessage(),
            ], 500);

        }
    }

    /**
     * Display Single Inventory Item
     */
    public function show(
        InventoryItem $inventory
    ): JsonResponse
    {
        try {

            $inventory = $this->inventoryService->getById(
                $inventory
            );

            return response()->json([
                'success' => true,
                'message' => 'Inventory item retrieved successfully.',
                'data' => $inventory,
            ], 200);

        } catch (Exception $exception) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve inventory item.',
                'error' => $exception->getMessage(),
            ], 500);

        }
    }
        /**
     * Update Inventory Item
     */
    public function update(
        UpdateInventoryRequest $request,
        InventoryItem $inventory
    ): JsonResponse
    {
        try {

            $inventory = $this->inventoryService->update(
                $inventory,
                $request->validated()
            );

            return response()->json([
                'success' => true,
                'message' => 'Inventory item updated successfully.',
                'data' => $inventory,
            ], 200);

        } catch (Exception $exception) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to update inventory item.',
                'error' => $exception->getMessage(),
            ], 500);

        }
    }

    /**
     * Return Inventory Back To Warehouse
     */
    public function returnInventory(
        InventoryItem $inventory
    ): JsonResponse
    {
        try {

            $inventory = $this->inventoryService->update(
                $inventory,
                [
                    'area_id' => null,
                    'installation_date' => null,
                    'removed_date' => now()->toDateString(),
                    'status' => 'Available',
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Inventory returned to warehouse successfully.',
                'data' => $inventory,
            ], 200);

        } catch (Exception $exception) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to return inventory.',
                'error' => $exception->getMessage(),
            ], 500);

        }
    }

    /**
     * Delete Inventory Item
     */
    public function destroy(
        InventoryItem $inventory
    ): JsonResponse
    {
        try {

            $this->inventoryService->delete(
                $inventory
            );

            return response()->json([
                'success' => true,
                'message' => 'Inventory item deleted successfully.',
            ], 200);

        } catch (Exception $exception) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete inventory item.',
                'error' => $exception->getMessage(),
            ], 500);

        }
    }
}