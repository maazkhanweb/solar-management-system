<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InventoryAssignment extends Model
{
    use HasFactory;

    protected $fillable = [

        'inventory_item_id',

        'area_id',

        'quantity',

        'assigned_by',

        'assigned_at',

        'returned_at',

        'status',

        'remarks',

    ];

    protected $casts = [

        'assigned_at' => 'datetime',

        'returned_at' => 'datetime',

    ];

    /**
     * Inventory Item
     */
    public function inventoryItem()
    {
        return $this->belongsTo(
            InventoryItem::class
        );
    }

    /**
     * Area
     */
    public function area()
    {
        return $this->belongsTo(
            Area::class
        );
    }

    /**
     * Assigned By User
     */
    public function assignedBy()
    {
        return $this->belongsTo(
            User::class,
            'assigned_by'
        );
    }
}