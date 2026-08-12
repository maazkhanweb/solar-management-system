<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryTransaction extends Model
{
    use HasFactory;

    protected $fillable = [

        'inventory_item_id',

        'transaction_type',

        'quantity',

        'from_area_id',

        'to_area_id',

        'user_id',

        'remarks',

    ];

    /**
     * Computed Attributes
     */
    protected $appends = [

        'from_area_name',

        'to_area_name',

        'performed_by',

        'area_manager',

    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function inventoryItem()
    {
        return $this->belongsTo(InventoryItem::class);
    }

    public function fromArea()
    {
        return $this->belongsTo(Area::class, 'from_area_id');
    }

    public function toArea()
    {
        return $this->belongsTo(Area::class, 'to_area_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    /**
     * Get From Area Name
     */
    public function getFromAreaNameAttribute(): string
    {
        return $this->fromArea?->area_name ?? 'Warehouse';
    }

    /**
     * Get To Area Name
     */
    public function getToAreaNameAttribute(): ?string
    {
        return $this->toArea?->area_name;
    }

    /**
     * Get Performed By
     */
    public function getPerformedByAttribute(): ?string
    {
        return $this->user?->name;
    }

    /**
     * Get Area Manager
     */
    public function getAreaManagerAttribute(): ?string
    {
        return $this->toArea?->manager;
    }
}