<?php

namespace App\Services;

use App\Models\InventoryItem;
use App\Models\InventoryTransaction;

class InventoryTransactionService
{
    /**
     * Create Inventory Transaction
     */
    public function create(array $data): InventoryTransaction
    {
        return InventoryTransaction::create([

            'inventory_item_id' => $data['inventory_item_id'],

            'transaction_type'  => $data['transaction_type'],

            'quantity'          => $data['quantity'] ?? 0,

            'from_area_id'      => $data['from_area_id'] ?? null,

            'to_area_id'        => $data['to_area_id'] ?? null,

            'user_id'           => $data['user_id'],

            'remarks'           => $data['remarks'] ?? null,

        ]);
    }

    /**
     * Log Add Transaction
     */
    public function logAdd(
        InventoryItem $inventory,
        int $userId,
        ?string $remarks = null
    ): InventoryTransaction {

        return $this->create([

            'inventory_item_id' => $inventory->id,

            'transaction_type'  => 'ADD',

            'quantity'          => $inventory->quantity,

            'user_id'           => $userId,

            'remarks'           => $remarks,

        ]);
    }

    /**
     * Log Assign Transaction
     */
    public function logAssign(
        InventoryItem $inventory,
        int $quantity,
        ?int $fromAreaId,
        ?int $toAreaId,
        int $userId,
        ?string $remarks = null
    ): InventoryTransaction {

        return $this->create([

            'inventory_item_id' => $inventory->id,

            'transaction_type'  => 'ASSIGN',

            'quantity'          => $quantity,

            'from_area_id'      => $fromAreaId,

            'to_area_id'        => $toAreaId,

            'user_id'           => $userId,

            'remarks'           => $remarks,

        ]);
    }

    /**
     * Log Return Transaction
     */
    public function logReturn(
        InventoryItem $inventory,
        int $quantity,
        ?int $fromAreaId,
        ?int $toAreaId,
        int $userId,
        ?string $remarks = null
    ): InventoryTransaction {

        return $this->create([

            'inventory_item_id' => $inventory->id,

            'transaction_type'  => 'RETURN',

            'quantity'          => $quantity,

            'from_area_id'      => $fromAreaId,

            'to_area_id'        => $toAreaId,

            'user_id'           => $userId,

            'remarks'           => $remarks,

        ]);
    }

    /**
     * Log Update Transaction
     */
    public function logUpdate(
        InventoryItem $inventory,
        int $userId,
        ?string $remarks = null
    ): InventoryTransaction {

        return $this->create([

            'inventory_item_id' => $inventory->id,

            'transaction_type'  => 'UPDATE',

            'quantity'          => $inventory->quantity,

            'user_id'           => $userId,

            'remarks'           => $remarks,

        ]);
    }

    /**
     * Log Delete Transaction
     */
    public function logDelete(
        InventoryItem $inventory,
        int $userId,
        ?string $remarks = null
    ): InventoryTransaction {

        return $this->create([

            'inventory_item_id' => $inventory->id,

            'transaction_type'  => 'DELETE',

            'quantity'          => $inventory->quantity,

            'user_id'           => $userId,

            'remarks'           => $remarks,

        ]);
    }

    /**
     * Log Damage Transaction
     */
    public function logDamage(
        InventoryItem $inventory,
        int $quantity,
        int $userId,
        ?string $remarks = null
    ): InventoryTransaction {

        return $this->create([

            'inventory_item_id' => $inventory->id,

            'transaction_type'  => 'DAMAGE',

            'quantity'          => $quantity,

            'user_id'           => $userId,

            'remarks'           => $remarks,

        ]);
    }

    /**
     * Log Repair Transaction
     */
    public function logRepair(
        InventoryItem $inventory,
        int $quantity,
        int $userId,
        ?string $remarks = null
    ): InventoryTransaction {

        return $this->create([

            'inventory_item_id' => $inventory->id,

            'transaction_type'  => 'REPAIR',

            'quantity'          => $quantity,

            'user_id'           => $userId,

            'remarks'           => $remarks,

        ]);
    }

    /**
 * Delete Inventory Transaction
 */
public function deleteTransaction(
    InventoryTransaction $transaction
): bool {

    $user = auth()->user();

    /*
    |--------------------------------------------------------------------------
    | Administrator
    |--------------------------------------------------------------------------
    */

    if ($user->role === 'Administrator') {

        return $transaction->delete();

    }

    /*
    |--------------------------------------------------------------------------
    | Manager
    |--------------------------------------------------------------------------
    */

    if ($user->role === 'Manager') {

        $allowed =

            $transaction->from_area_id == $user->area_id ||

            $transaction->to_area_id == $user->area_id;

        if (!$allowed) {

            abort(
                403,
                'You are not authorized to delete this transaction.'
            );

        }

        return $transaction->delete();

    }

    abort(
        403,
        'Unauthorized.'
    );

}
}