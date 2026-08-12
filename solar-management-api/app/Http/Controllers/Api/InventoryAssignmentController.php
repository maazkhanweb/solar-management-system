<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryAssignment;
use App\Services\InventoryAssignmentService;
use Illuminate\Http\Request;
use Exception;

class InventoryAssignmentController extends Controller
{
    protected InventoryAssignmentService $inventoryAssignmentService;

    public function __construct(
        InventoryAssignmentService $inventoryAssignmentService
    ) {
        $this->inventoryAssignmentService = $inventoryAssignmentService;
    }

    /**
     * Get All Assignments
     */
    public function index()
    {
        try {

            $assignments = $this->inventoryAssignmentService
                ->getAssignments();

            return response()->json([
                'success' => true,
                'assignments' => $assignments,
            ]);

        } catch (Exception $exception) {

            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);

        }
    }

    /**
     * Assign Inventory
     */
    public function store(Request $request)
    {
        $request->validate([

            'inventory_item_id' => 'required|exists:inventory_items,id',

            'area_id' => 'required|exists:areas,id',

            'quantity' => 'required|integer|min:1',

            'remarks' => 'nullable|string',

        ]);

        try {

            $assignment = $this->inventoryAssignmentService
                ->assignInventory($request->all());

            return response()->json([

                'success' => true,

                'message' => 'Inventory assigned successfully.',

                'assignment' => $assignment,

            ], 201);

        } catch (Exception $exception) {

            return response()->json([

                'success' => false,

                'message' => $exception->getMessage(),

            ], 500);

        }
    }

    /**
     * Return Inventory
     */
    public function returnInventory(
        InventoryAssignment $inventoryAssignment
    ) {
        try {

            $assignment = $this->inventoryAssignmentService
                ->returnInventory($inventoryAssignment);

            return response()->json([

                'success' => true,

                'message' => 'Inventory returned successfully.',

                'assignment' => $assignment,

            ]);

        } catch (Exception $exception) {

            return response()->json([

                'success' => false,

                'message' => $exception->getMessage(),

            ], 500);

        }
    }

    /**
     * Delete Assignment
     */
    public function destroy(
        InventoryAssignment $inventoryAssignment
    ) {
        try {

            $this->inventoryAssignmentService
                ->deleteAssignment($inventoryAssignment);

            return response()->json([

                'success' => true,

                'message' => 'Assignment deleted successfully.',

            ]);

        } catch (Exception $exception) {

            return response()->json([

                'success' => false,

                'message' => $exception->getMessage(),

            ], 500);

        }
    }
}