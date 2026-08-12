<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    protected $fillable = [

        'consumer_name',

        'reference_number',

        'bill_month',

        'bill_year',

        'bill_address',

        'units_consumed',

        'bill_amount',

        'generated_units',

        'difference_units',

        'status',

        'generation_loss_reason',

        'remarks',

        'bill_image',

        'ocr_status',

        'ocr_confidence',

        'created_by',

        'updated_by',

    ];

    protected $casts = [

        'units_consumed' => 'decimal:2',

        'bill_amount' => 'decimal:2',

        'generated_units' => 'decimal:2',

        'difference_units' => 'decimal:2',

        'ocr_status' => 'boolean',

        'ocr_confidence' => 'decimal:2',

    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}