<?php

namespace App\Services;

use App\Models\InventoryAssignment;
use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;

class InventoryAssignmentService
{
    /**
     * Inventory Transaction Service
     */
    protected InventoryTransactionService $transactionService;

    /**
     * Constructor
     */
    public function __construct(
        InventoryTransactionService $transactionService
    ) {
        $this->transactionService = $transactionService;
    }

    /**
     * Get All Assignments
     */
    public function getAssignments(): Collection
    {
        $query = InventoryAssignment::with([

            'inventoryItem',

            'area',

            'assignedBy',

        ]);

        /*
        |--------------------------------------------------------------------------
        | Manager can view only his Area Assignments
        |--------------------------------------------------------------------------
        */

        if (

            Auth::user()->role === 'Manager'

        ) {

            $query->where(

                'area_id',

                Auth::user()->area_id

            );

        }

        return $query
            ->latest()
            ->get();
    }

    /**
     * Assign Inventory To Area
     */
    public function assignInventory(
        array $data
    ): InventoryAssignment {

        /*
        |--------------------------------------------------------------------------
        | Only Administrator
        |--------------------------------------------------------------------------
        */

        if (

            Auth::user()->role !== 'Administrator'

        ) {

            abort(403);

        }

        return DB::transaction(function () use ($data) {

            $inventory = InventoryItem::findOrFail(
                $data['inventory_item_id']
            );

            $quantity = (int) $data['quantity'];

            /*
            |--------------------------------------------------------------------------
            | Validate Stock
            |--------------------------------------------------------------------------
            */

            if (

                $inventory->available_quantity <= 0

            ) {

                throw new Exception(
                    'No stock available.'
                );

            }

            if (

                $quantity > $inventory->available_quantity

            ) {

                throw new Exception(
                    'Requested quantity exceeds available stock.'
                );

            }

            /*
            |--------------------------------------------------------------------------
            | Create Assignment
            |--------------------------------------------------------------------------
            */

            $assignment = InventoryAssignment::create([

                'inventory_item_id' => $inventory->id,

                'area_id' => $data['area_id'],

                'quantity' => $quantity,

                'assigned_by' => Auth::id(),

                'assigned_at' => now(),

                'status' => 'Assigned',

                'remarks' => $data['remarks'] ?? null,

            ]);

            /*
            |--------------------------------------------------------------------------
            | Update Inventory
            |--------------------------------------------------------------------------
            */

            $inventory->update([

                'available_quantity' =>

                    $inventory->available_quantity - $quantity,

                'assigned_quantity' =>

                    $inventory->assigned_quantity + $quantity,

                'status' => 'Installed',

                'area_id' => $data['area_id'],

                'installation_date' => now(),

                'removed_date' => null,

            ]);

            /*
            |--------------------------------------------------------------------------
            | Transaction History
            |--------------------------------------------------------------------------
            */

            $this->transactionService->logAssign(

                $inventory->fresh(),

                $quantity,

                null,

                $data['area_id'],

                Auth::id(),

                $data['remarks']
                    ?? 'Inventory assigned.'

            );

            return $assignment->load([

                'inventoryItem',

                'area',

                'assignedBy',

            ]);

        });

    }
        /**
     * Return Inventory By Inventory Item
     */
    public function returnInventoryByInventory(
        InventoryItem $inventory
    ): InventoryAssignment {

        /*
        |--------------------------------------------------------------------------
        | Only Administrator
        |--------------------------------------------------------------------------
        */

        if (

            Auth::user()->role !== 'Administrator'

        ) {

            abort(403);

        }

        $assignment = InventoryAssignment::where(
            'inventory_item_id',
            $inventory->id
        )
            ->where(
                'status',
                'Assigned'
            )
            ->latest()
            ->first();

        if (!$assignment) {

            throw new Exception(
                'No active assignment found for this inventory.'
            );

        }

        return $this->returnInventory($assignment);

    }

    /**
     * Return Inventory To Warehouse
     */
    public function returnInventory(
        InventoryAssignment $assignment
    ): InventoryAssignment {

        /*
        |--------------------------------------------------------------------------
        | Only Administrator
        |--------------------------------------------------------------------------
        */

        if (

            Auth::user()->role !== 'Administrator'

        ) {

            abort(403);

        }

        return DB::transaction(function () use (
            $assignment
        ) {

            /*
            |--------------------------------------------------------------------------
            | Already Returned?
            |--------------------------------------------------------------------------
            */

            if (

                $assignment->status === 'Returned'

            ) {

                throw new Exception(
                    'This inventory has already been returned.'
                );

            }

            /*
            |--------------------------------------------------------------------------
            | Inventory Item
            |--------------------------------------------------------------------------
            */

            $inventory = $assignment->inventoryItem;

            /*
            |--------------------------------------------------------------------------
            | Restore Stock
            |--------------------------------------------------------------------------
            */

            $inventory->update([

                'available_quantity' =>

                    $inventory->available_quantity +

                    $assignment->quantity,

                'assigned_quantity' =>

                    max(

                        0,

                        $inventory->assigned_quantity -

                        $assignment->quantity

                    ),

                'status' => 'Available',

                'area_id' => null,

                'installation_date' => null,

                'removed_date' => now(),

            ]);

            /*
            |--------------------------------------------------------------------------
            | Update Assignment
            |--------------------------------------------------------------------------
            */

            $assignment->update([

                'status' => 'Returned',

                'returned_at' => now(),

            ]);

            /*
            |--------------------------------------------------------------------------
            | Transaction History
            |--------------------------------------------------------------------------
            */

            $this->transactionService->logReturn(

                $inventory->fresh(),

                $assignment->quantity,

                $assignment->area_id,

                null,

                Auth::id(),

                'Inventory returned to warehouse.'

            );

            return $assignment->fresh()->load([

                'inventoryItem',

                'area',

                'assignedBy',

            ]);

        });

    }

    /**
     * Delete Assignment
     */
    public function deleteAssignment(
        InventoryAssignment $assignment
    ): bool {

        /*
        |--------------------------------------------------------------------------
        | Only Administrator
        |--------------------------------------------------------------------------
        */

        if (

            Auth::user()->role !== 'Administrator'

        ) {

            abort(403);

        }

        return DB::transaction(function () use (
            $assignment
        ) {

            /*
            |--------------------------------------------------------------------------
            | Restore Stock Before Delete
            |--------------------------------------------------------------------------
            */

            if (

                $assignment->status === 'Assigned'

            ) {

                $inventory = $assignment->inventoryItem;

                $inventory->update([

                    'available_quantity' =>

                        $inventory->available_quantity +

                        $assignment->quantity,

                    'assigned_quantity' =>

                        max(

                            0,

                            $inventory->assigned_quantity -

                            $assignment->quantity

                        ),

                ]);

            }

            return $assignment->delete();

        });

    }

}