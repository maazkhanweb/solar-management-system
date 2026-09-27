<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * ============================================================================
 * File:
 * app/Models/Bill.php
 *
 * Description:
 * Bill model for WAPDA Bill Management.
 * Handles bill data, area relationship,
 * audit relationships and attribute casting.
 * ============================================================================
 */

class Bill extends Model
{
    /**
     * Mass Assignable Fields
     */
    protected $fillable = [

        'consumer_name',

        'reference_number',

        /*
        |--------------------------------------------------------------------------
        | Bill Period
        |--------------------------------------------------------------------------
        */

        'bill_month',

        'bill_year',

        /*
        |--------------------------------------------------------------------------
        | Area Information
        |--------------------------------------------------------------------------
        */

        'bill_address',

        'area_id',

        /*
        |--------------------------------------------------------------------------
        | Bill Consumption
        |--------------------------------------------------------------------------
        */

        'units_consumed',

        'bill_amount',

        /*
        |--------------------------------------------------------------------------
        | Solar Analysis
        |--------------------------------------------------------------------------
        */

        'generated_units',

        'difference_units',

        'generation_loss_reason',

        /*
        |--------------------------------------------------------------------------
        | Bill Status
        |--------------------------------------------------------------------------
        */

        'status',

        'remarks',

        /*
        |--------------------------------------------------------------------------
        | Bill Image & OCR
        |--------------------------------------------------------------------------
        */

        'bill_image',

        'ocr_status',

        'ocr_confidence',

        /*
        |--------------------------------------------------------------------------
        | Audit Fields
        |--------------------------------------------------------------------------
        */

        'created_by',

        'updated_by',

    ];


    /**
     * Attribute Casting
     */
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

    /**
     * Selected Area
     */
    public function area()
    {
        return $this->belongsTo(
            Area::class,
            'area_id'
        );
    }


    /**
     * Bill Created By
     */
    public function createdBy()
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }


    /**
     * Bill Updated By
     */
    public function updatedBy()
    {
        return $this->belongsTo(
            User::class,
            'updated_by'
        );
    }
}