<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    /**
     * Mass Assignable Attributes
     */
    protected $fillable = [

        'item_type',

        'item_name',

        'serial_number',

        'manufacturer',

        'capacity',

        'battery_health',

        'quantity',

        'available_quantity',

        'assigned_quantity',

        'damaged_quantity',

        'minimum_stock',

        'condition',

        'status',

        'area_id',

        'installation_date',

        'removed_date',

        'remarks',

    ];

    /**
     * Attribute Casting
     */
    protected $casts = [

        'quantity' => 'integer',

        'available_quantity' => 'integer',

        'assigned_quantity' => 'integer',

        'damaged_quantity' => 'integer',

        'minimum_stock' => 'integer',

        'battery_health' => 'decimal:2',

        'installation_date' => 'date',

        'removed_date' => 'date',

    ];

    /**
     * Area
     * (Temporary Relationship - Will be removed
     * after full Inventory Assignment migration)
     */
    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    /**
     * Inventory Assignments
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(
            InventoryAssignment::class
        );
    }

    /**
     * Inventory Transactions
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(
            InventoryTransaction::class
        );
    }
}