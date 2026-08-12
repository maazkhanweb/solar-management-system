<?php

namespace App\Services;

use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    /**
     * Get All Inventory
     */
    public function getAll(): Collection
    {
        $query = InventoryItem::with('area');

        /*
        |--------------------------------------------------------------------------
        | Manager can view only his Area Inventory
        |--------------------------------------------------------------------------
        */

        $user = Auth::user();

        if (

            $user->role === 'Manager'

        ) {

            $query->where(

                'area_id',

                $user->area_id

            );

        }

        return $query
            ->latest()
            ->get();
    }

    /**
     * Store Inventory Item
     */
    public function store(array $data): InventoryItem
    {
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

            /*
            |--------------------------------------------------------------------------
            | Default Status
            |--------------------------------------------------------------------------
            */

            $data['status'] = $data['status'] ?? 'Available';

            /*
            |--------------------------------------------------------------------------
            | Stock Initialization
            |--------------------------------------------------------------------------
            */

            $quantity = (int) ($data['quantity'] ?? 0);

            $data['quantity'] = $quantity;

            $data['available_quantity'] = $quantity;

            $data['assigned_quantity'] = 0;

            $data['damaged_quantity'] = 0;

            $data['minimum_stock'] = $data['minimum_stock'] ?? 5;

            return InventoryItem::create($data);

        });
    }

    /**
     * Update Inventory Item
     */
    public function update(
        InventoryItem $inventory,
        array $data
    ): InventoryItem {

        /*
        |--------------------------------------------------------------------------
        | Manager cannot update another Area Inventory
        |--------------------------------------------------------------------------
        */

        if (

            Auth::user()->role === 'Manager'

            &&

            $inventory->area_id != Auth::user()->area_id

        ) {

            abort(403);

        }

        return DB::transaction(function () use (

            $inventory,

            $data

        ) {

            /*
            |--------------------------------------------------------------------------
            | Total Quantity cannot be
            | less than Assigned Quantity
            |--------------------------------------------------------------------------
            */

            if (

                isset($data['quantity'])

                &&

                $data['quantity'] < $inventory->assigned_quantity

            ) {

                $data['quantity'] =

                    $inventory->assigned_quantity;

            }

            /*
            |--------------------------------------------------------------------------
            | Recalculate Available Stock
            |--------------------------------------------------------------------------
            */

            if (isset($data['quantity'])) {

                $data['available_quantity'] =

                    $data['quantity']

                    -

                    $inventory->assigned_quantity

                    -

                    $inventory->damaged_quantity;

            }

            $inventory->update($data);

            return $inventory
                ->fresh()
                ->load('area');

        });

    }
        /**
     * Temporary Assignment
     *
     * This method will be removed after
     * InventoryAssignment module is completed.
     */
    public function assignToArea(
        InventoryItem $inventory,
        array $data
    ): InventoryItem {

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

            $inventory,

            $data

        ) {

            $inventory->update([

                'area_id' => $data['area_id'],

                'installation_date' =>
                    $data['installation_date'],

                'remarks' =>
                    $data['remarks'] ?? null,

                'status' => 'Installed',

            ]);

            return $inventory
                ->fresh()
                ->load('area');

        });

    }

    /**
     * Delete Inventory Item
     */
    public function delete(
        InventoryItem $inventory
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
            $inventory
        ) {

            return $inventory->delete();

        });

    }

    /**
     * Get Single Inventory Item
     */
    public function getById(
        InventoryItem $inventory
    ): InventoryItem {

        /*
        |--------------------------------------------------------------------------
        | Manager cannot access another Area Inventory
        |--------------------------------------------------------------------------
        */

        if (

            Auth::user()->role === 'Manager'

            &&

            $inventory->area_id != Auth::user()->area_id

        ) {

            abort(403);

        }

        return $inventory->load('area');

    }

    /**
     * Low Stock Items
     */
    public function getLowStock(): Collection
    {
        /*
        |--------------------------------------------------------------------------
        | Administrator
        |--------------------------------------------------------------------------
        */

        if (

            Auth::user()->role === 'Administrator'

        ) {

            return InventoryItem::whereColumn(
                'available_quantity',
                '<=',
                'minimum_stock'
            )->get();

        }

        /*
        |--------------------------------------------------------------------------
        | Manager
        |--------------------------------------------------------------------------
        */

        return InventoryItem::where(
            'area_id',
            Auth::user()->area_id
        )
            ->whereColumn(
                'available_quantity',
                '<=',
                'minimum_stock'
            )
            ->get();

    }

    /**
     * Out Of Stock Items
     */
    public function getOutOfStock(): Collection
    {
        /*
        |--------------------------------------------------------------------------
        | Administrator
        |--------------------------------------------------------------------------
        */

        if (

            Auth::user()->role === 'Administrator'

        ) {

            return InventoryItem::where(
                'available_quantity',
                0
            )->get();

        }

        /*
        |--------------------------------------------------------------------------
        | Manager
        |--------------------------------------------------------------------------
        */

        return InventoryItem::where(
            'area_id',
            Auth::user()->area_id
        )
            ->where(
                'available_quantity',
                0
            )
            ->get();

    }

}