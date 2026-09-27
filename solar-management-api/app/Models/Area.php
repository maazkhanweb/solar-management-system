<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'area_name',
    'location',
    'manager',
    'phone',
    'status',
])]

class Area extends Model
{
    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Area Users
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Area Inverters
     */
    public function inverters(): HasMany
    {
        return $this->hasMany(Inverter::class);
    }

    /**
     * Area Solar Panels
     */
    public function solarPanels(): HasMany
    {
        return $this->hasMany(SolarPanel::class);
    }

    /**
     * Area Batteries
     */
    public function batteries(): HasMany
    {
        return $this->hasMany(Battery::class);
    }

    /**
     * Inventory Assignments
     */
    public function inventoryAssignments(): HasMany
    {
        return $this->hasMany(
            InventoryAssignment::class
        );
    }

    /**
     * Outgoing Inventory Transactions
     */
    public function outgoingTransactions(): HasMany
    {
        return $this->hasMany(
            InventoryTransaction::class,
            'from_area_id'
        );
    }

    /**
     * Incoming Inventory Transactions
     */
    public function incomingTransactions(): HasMany
    {
        return $this->hasMany(
            InventoryTransaction::class,
            'to_area_id'
        );
    }
}