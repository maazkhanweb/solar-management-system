<?php

namespace App\Services;

use App\Models\Area;
use App\Models\InventoryAssignment;
use App\Models\InventoryItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AreaService
{
    /**
     * Get All Areas
     */
    public function getAreas(): array
    {
        $query = Area::select([
            'id',
            'area_name',
            'location',
            'manager',
            'phone',
            'status',
            'created_at',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Manager can view only his Area
        |--------------------------------------------------------------------------
        */

        if (Auth::user()->role === 'Manager') {

            $query->where(
                'id',
                Auth::user()->area_id
            );

        }

        return [

            'success' => true,

            'areas' => $query
                ->latest()
                ->paginate(10)
                ->withQueryString(),

        ];
    }

    /**
     * Get Areas For Dropdown
     */
    public function getAreaOptions(): array
    {
        $query = Area::select([
            'id',
            'area_name',
        ])
            ->where('status', 'Active');

        /*
        |--------------------------------------------------------------------------
        | Manager Area Dropdown
        |--------------------------------------------------------------------------
        */

        if (Auth::user()->role === 'Manager') {

            $query->where(
                'id',
                Auth::user()->area_id
            );

        }

        return [

            'success' => true,

            'areas' => $query
                ->orderBy('area_name')
                ->get(),

        ];
    }

    /**
     * Find Area By ID
     */
    public function findAreaById(
        Area $area
    ): array {

        /*
        |--------------------------------------------------------------------------
        | Manager cannot access other Areas
        |--------------------------------------------------------------------------
        */

        if (

            Auth::user()->role === 'Manager'

            &&

            $area->id != Auth::user()->area_id

        ) {

            abort(403);

        }

        return [

            'success' => true,

            'area' => $area,

        ];

    }

    /**
     * Get Area Assets
     */
    public function getAreaAssets(
        Area $area
    ): array {

        /*
        |--------------------------------------------------------------------------
        | Manager cannot view another Area Assets
        |--------------------------------------------------------------------------
        */

        if (

            Auth::user()->role === 'Manager'

            &&

            $area->id != Auth::user()->area_id

        ) {

            abort(403);

        }

        $assignments = InventoryAssignment::with(
            'inventoryItem'
        )
            ->where(
                'area_id',
                $area->id
            )
            ->where(
                'status',
                'Assigned'
            )
            ->latest()
            ->get();

        return [

            'success' => true,

            'area' => [

                'id' => $area->id,

                'area_name' => $area->area_name,

                'location' => $area->location,

                'manager' => $area->manager,

                'phone' => $area->phone,

                'status' => $area->status,

            ],

            'inventory' => $assignments->map(

                function ($assignment) {

                    return [

                        'assignment_id' =>
                            $assignment->id,

                        'inventory_item_id' =>
                            $assignment->inventory_item_id,

                        'item_name' =>
                            $assignment->inventoryItem?->item_name,

                        'item_type' =>
                            $assignment->inventoryItem?->item_type,

                        'manufacturer' =>
                            $assignment->inventoryItem?->manufacturer,

                        'capacity' =>
                            $assignment->inventoryItem?->capacity,

                        'serial_number' =>
                            $assignment->inventoryItem?->serial_number,

                        'quantity' =>
                            $assignment->quantity,

                        'assigned_at' =>
                            $assignment->assigned_at,

                        'remarks' =>
                            $assignment->remarks,

                    ];

                }

            ),

            'total_items' => $assignments->count(),

            'total_quantity' => $assignments->sum(
                'quantity'
            ),

        ];

    }
        /**
     * Create Area
     */
    public function createArea(array $data): array
    {
        /*
        |--------------------------------------------------------------------------
        | Only Administrator
        |--------------------------------------------------------------------------
        */

        if (Auth::user()->role !== 'Administrator') {

            abort(403);

        }

        $area = Area::create($data);

        return [

            'success' => true,

            'message' => 'Area created successfully.',

            'area' => $area,

        ];
    }

    /**
     * Update Area
     */
    public function updateArea(
        Area $area,
        array $data
    ): array {

        /*
        |--------------------------------------------------------------------------
        | Only Administrator
        |--------------------------------------------------------------------------
        */

        if (Auth::user()->role !== 'Administrator') {

            abort(403);

        }

        $area->update($data);

        return [

            'success' => true,

            'message' => 'Area updated successfully.',

            'area' => $area->fresh(),

        ];

    }

    /**
     * Move All Inventory Back To Warehouse
     */
    public function moveToInventory(
        Area $area
    ): array {

        /*
        |--------------------------------------------------------------------------
        | Only Administrator
        |--------------------------------------------------------------------------
        */

        if (Auth::user()->role !== 'Administrator') {

            abort(403);

        }

        DB::transaction(function () use ($area) {

            $assignments = InventoryAssignment::where(
                'area_id',
                $area->id
            )
                ->where(
                    'status',
                    'Assigned'
                )
                ->get();

            foreach ($assignments as $assignment) {

                $inventory = InventoryItem::find(
                    $assignment->inventory_item_id
                );

                if (!$inventory) {

                    continue;

                }

                $inventory->update([

                    'available_quantity' =>
                        $inventory->available_quantity +
                        $assignment->quantity,

                    'assigned_quantity' =>
                        $inventory->assigned_quantity -
                        $assignment->quantity,

                    'status' => 'Available',

                    'area_id' => null,

                    'installation_date' => null,

                    'removed_date' => now(),

                ]);

                $assignment->update([

                    'status' => 'Returned',

                    'returned_at' => now(),

                ]);

            }

        });

        return [

            'success' => true,

            'message' =>
                'All inventory moved back to warehouse successfully.',

        ];

    }

    /**
     * Delete Area
     */
    public function deleteArea(
        Area $area
    ): array {

        /*
        |--------------------------------------------------------------------------
        | Only Administrator
        |--------------------------------------------------------------------------
        */

        if (Auth::user()->role !== 'Administrator') {

            abort(403);

        }

        $hasInventory = InventoryAssignment::where(
            'area_id',
            $area->id
        )
            ->where(
                'status',
                'Assigned'
            )
            ->exists();

        if ($hasInventory) {

            return [

                'success' => false,

                'message' =>
                    'Area contains assigned inventory. Move all inventory back before deleting.',

            ];

        }

        $area->delete();

        return [

            'success' => true,

            'message' => 'Area deleted successfully.',

        ];

    }

}