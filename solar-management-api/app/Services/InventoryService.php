<?php

/*
|--------------------------------------------------------------------------
| File:
| app/Services/InventoryService.php
|
| Description:
| Handles inventory operations.
|
| Features:
| - Inventory listing
| - New inventory creation
| - Existing inventory quantity merging
| - Damaged quantity management
| - Damage reason management
| - Available stock calculation
| - Inventory update
| - Inventory assignment
| - Inventory deletion
| - Low stock / out of stock queries
|--------------------------------------------------------------------------
*/

namespace App\Services;

use App\Models\InventoryItem;

use Illuminate\Database\Eloquent\Collection;

use Illuminate\Support\Facades\DB;

class InventoryService
{
    /**
     * Get All Inventory
     */
    public function getAll(): Collection
    {
        return InventoryItem::with('area')
            ->latest()
            ->get();
    }


    /**
     * Store Inventory Item
     *
     * If the same Item Type and Item Name already exist,
     * the new quantity is merged into the existing inventory.
     */
    public function store(array $data): InventoryItem
    {
        return DB::transaction(

            function () use ($data) {

                /*
                |--------------------------------------------------------------------------
                | Find Existing Matching Inventory
                |--------------------------------------------------------------------------
                */

                $existingInventory =

                    InventoryItem::where(

                        'item_type',

                        $data['item_type']

                    )

                    ->whereRaw(

                        'LOWER(item_name) = ?',

                        [

                            strtolower(

                                trim(

                                    $data['item_name']

                                )

                            ),

                        ]

                    )

                    ->lockForUpdate()

                    ->first();


                /*
                |--------------------------------------------------------------------------
                | Damage Information
                |--------------------------------------------------------------------------
                */

                $newQuantity =

                    (int) (

                        $data['quantity']

                        ?? 0

                    );


                $newDamagedQuantity =

                    (int) (

                        $data['damaged_quantity']

                        ?? 0

                    );


                /*
                |--------------------------------------------------------------------------
                | Merge Existing Inventory
                |--------------------------------------------------------------------------
                */

                if ($existingInventory) {

                    /*
                    |--------------------------------------------------------------------------
                    | Add New Quantity
                    |--------------------------------------------------------------------------
                    */

                    $existingInventory->quantity +=

                        $newQuantity;


                    /*
                    |--------------------------------------------------------------------------
                    | Add Damaged Quantity
                    |--------------------------------------------------------------------------
                    */

                    $existingInventory->damaged_quantity +=

                        $newDamagedQuantity;


                    /*
                    |--------------------------------------------------------------------------
                    | Add Available Quantity
                    |--------------------------------------------------------------------------
                    |
                    | New available stock =
                    | New quantity - New damaged quantity
                    |
                    */

                    $newAvailableQuantity =

                        $newQuantity -

                        $newDamagedQuantity;


                    if ($newAvailableQuantity < 0) {

                        $newAvailableQuantity = 0;

                    }


                    $existingInventory->available_quantity +=

                        $newAvailableQuantity;


                    /*
                    |--------------------------------------------------------------------------
                    | Preserve Serial Numbers
                    |--------------------------------------------------------------------------
                    */

                    $existingSerials = collect(

                        preg_split(

                            '/[,\n]+/',

                            $existingInventory->serial_number

                        )

                    )

                    ->map(

                        fn ($serial) => trim($serial)

                    )

                    ->filter();


                    $newSerials = collect(

                        preg_split(

                            '/[,\n]+/',

                            $data['serial_number']

                        )

                    )

                    ->map(

                        fn ($serial) => trim($serial)

                    )

                    ->filter();


                    $mergedSerials =

                        $existingSerials

                            ->merge($newSerials)

                            ->unique(

                                fn ($serial) =>

                                    strtolower($serial)

                            )

                            ->values()

                            ->implode(', ');


                    /*
                    |--------------------------------------------------------------------------
                    | Update Serial Numbers
                    |--------------------------------------------------------------------------
                    */

                    $existingInventory->serial_number =

                        $mergedSerials;


                    /*
                    |--------------------------------------------------------------------------
                    | Minimum Stock
                    |--------------------------------------------------------------------------
                    */

                    $existingInventory->minimum_stock =

                        $data['minimum_stock']

                        ??

                        $existingInventory->minimum_stock;


                    /*
                    |--------------------------------------------------------------------------
                    | Damage Reason
                    |--------------------------------------------------------------------------
                    |
                    | If the newly added inventory contains damaged items,
                    | store the new reason.
                    |
                    */

                    if (

                        $newDamagedQuantity > 0

                        &&

                        !empty(

                            $data['damage_reason']

                            ?? null

                        )

                    ) {

                        $newDamageReason =

                            trim(

                                $data['damage_reason']

                            );


                        $existingDamageReason =

                            trim(

                                $existingInventory->damage_reason

                                ?? ''

                            );


                        if (

                            $existingDamageReason !== ''

                        ) {

                            if (

                                stripos(

                                    $existingDamageReason,

                                    $newDamageReason

                                ) === false

                            ) {

                                $existingInventory->damage_reason =

                                    $existingDamageReason

                                    . '; '

                                    . $newDamageReason;

                            }

                        } else {

                            $existingInventory->damage_reason =

                                $newDamageReason;

                        }

                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Save Existing Inventory
                    |--------------------------------------------------------------------------
                    */

                    $existingInventory->save();


                    return $existingInventory

                        ->fresh()

                        ->load('area');

                }


                /*
                |--------------------------------------------------------------------------
                | Create New Inventory Item
                |--------------------------------------------------------------------------
                */

                $data['status'] =

                    $data['status']

                    ??

                    'Available';


                $data['quantity'] =

                    $newQuantity;


                /*
                |--------------------------------------------------------------------------
                | Damaged Quantity
                |--------------------------------------------------------------------------
                */

                $data['damaged_quantity'] =

                    $newDamagedQuantity;


                /*
                |--------------------------------------------------------------------------
                | Available Quantity
                |--------------------------------------------------------------------------
                |
                | Available = Total - Damaged
                |
                */

                $availableQuantity =

                    $newQuantity -

                    $newDamagedQuantity;


                if ($availableQuantity < 0) {

                    $availableQuantity = 0;

                }


                $data['available_quantity'] =

                    $availableQuantity;


                /*
                |--------------------------------------------------------------------------
                | Assigned Quantity
                |--------------------------------------------------------------------------
                */

                $data['assigned_quantity'] =

                    0;


                /*
                |--------------------------------------------------------------------------
                | Minimum Stock
                |--------------------------------------------------------------------------
                */

                $data['minimum_stock'] =

                    $data['minimum_stock']

                    ??

                    5;


                /*
                |--------------------------------------------------------------------------
                | Damage Reason
                |--------------------------------------------------------------------------
                |
                | If there are no damaged items, don't store
                | an unnecessary damage reason.
                |
                */

                if (

                    $newDamagedQuantity <= 0

                ) {

                    $data['damage_reason'] = null;

                }


                /*
                |--------------------------------------------------------------------------
                | Create Inventory
                |--------------------------------------------------------------------------
                */

                return InventoryItem::create(

                    $data

                );

            }

        );
    }


    /**
     * Update Inventory Item
     */
    public function update(
        InventoryItem $inventory,
        array $data
    ): InventoryItem {

        return DB::transaction(

            function () use (

                $inventory,

                $data

            ) {

                /*
                |--------------------------------------------------------------------------
                | Get Current Assigned Quantity
                |--------------------------------------------------------------------------
                */

                $assignedQuantity =

                    (int) (

                        $inventory->assigned_quantity

                        ?? 0

                    );


                /*
                |--------------------------------------------------------------------------
                | Get New Quantity
                |--------------------------------------------------------------------------
                */

                $quantity =

                    isset($data['quantity'])

                    ?

                    (int) $data['quantity']

                    :

                    (int) $inventory->quantity;


                /*
                |--------------------------------------------------------------------------
                | Get New Damaged Quantity
                |--------------------------------------------------------------------------
                */

                $damagedQuantity =

                    array_key_exists(

                        'damaged_quantity',

                        $data

                    )

                    ?

                    (int) (

                        $data['damaged_quantity']

                        ?? 0

                    )

                    :

                    (int) (

                        $inventory->damaged_quantity

                        ?? 0

                    );


                /*
                |--------------------------------------------------------------------------
                | Prevent Invalid Damaged Quantity
                |--------------------------------------------------------------------------
                */

                if (

                    $damagedQuantity > $quantity

                ) {

                    $damagedQuantity =

                        $quantity;

                }


                /*
                |--------------------------------------------------------------------------
                | Total Quantity Cannot Be Less Than
                | Assigned + Damaged Quantity
                |--------------------------------------------------------------------------
                */

                $minimumRequiredQuantity =

                    $assignedQuantity +

                    $damagedQuantity;


                if (

                    $quantity <

                    $minimumRequiredQuantity

                ) {

                    $quantity =

                        $minimumRequiredQuantity;

                }


                /*
                |--------------------------------------------------------------------------
                | Update Quantity
                |--------------------------------------------------------------------------
                */

                $data['quantity'] =

                    $quantity;


                /*
                |--------------------------------------------------------------------------
                | Update Damaged Quantity
                |--------------------------------------------------------------------------
                */

                $data['damaged_quantity'] =

                    $damagedQuantity;


                /*
                |--------------------------------------------------------------------------
                | Recalculate Available Stock
                |--------------------------------------------------------------------------
                |
                | Available =
                | Total - Assigned - Damaged
                |
                */

                $availableQuantity =

                    $quantity -

                    $assignedQuantity -

                    $damagedQuantity;


                if ($availableQuantity < 0) {

                    $availableQuantity = 0;

                }


                $data['available_quantity'] =

                    $availableQuantity;


                /*
                |--------------------------------------------------------------------------
                | Damage Reason
                |--------------------------------------------------------------------------
                |
                | If damaged quantity is zero,
                | remove the damage reason.
                |
                */

                if (

                    $damagedQuantity <= 0

                ) {

                    $data['damage_reason'] = null;

                }


                /*
                |--------------------------------------------------------------------------
                | Update Inventory
                |--------------------------------------------------------------------------
                */

                $inventory->update(

                    $data

                );


                /*
                |--------------------------------------------------------------------------
                | Return Fresh Inventory
                |--------------------------------------------------------------------------
                */

                return $inventory

                    ->fresh()

                    ->load('area');

            }

        );
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

        return DB::transaction(

            function () use (

                $inventory,

                $data

            ) {

                $inventory->update([

                    'area_id' =>

                        $data['area_id'],

                    'installation_date' =>

                        $data['installation_date'],

                    'remarks' =>

                        $data['remarks']

                        ??

                        null,

                    'status' =>

                        'Installed',

                ]);


                return $inventory

                    ->fresh()

                    ->load('area');

            }

        );
    }


    /**
     * Delete Inventory Item
     */
    public function delete(
        InventoryItem $inventory
    ): bool {

        return DB::transaction(

            function () use (

                $inventory

            ) {

                return $inventory->delete();

            }

        );
    }


    /**
     * Get Single Inventory Item
     */
    public function getById(
        InventoryItem $inventory
    ): InventoryItem {

        return $inventory->load(

            'area'

        );
    }


    /**
     * Low Stock Items
     */
    public function getLowStock(): Collection
    {
        return InventoryItem::whereColumn(

            'available_quantity',

            '<=',

            'minimum_stock'

        )->get();
    }


    /**
     * Out Of Stock Items
     */
    public function getOutOfStock(): Collection
    {
        return InventoryItem::where(

            'available_quantity',

            0

        )->get();
    }
}