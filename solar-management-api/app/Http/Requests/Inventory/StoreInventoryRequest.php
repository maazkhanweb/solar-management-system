<?php

/*
|--------------------------------------------------------------------------
| File:
| app/Http/Requests/Inventory/StoreInventoryRequest.php
|
| Description:
| Validation rules for creating Inventory.
| Supports default and custom Item Types.
| Handles damaged quantity and damage reason.
|--------------------------------------------------------------------------
*/

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInventoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation Rules
     */
    public function rules(): array
    {
        return [

            'item_type' => [
                'required',
                'string',
                'max:255',
            ],

            'item_name' => [
                'required',
                'string',
                'max:255',
            ],

            'serial_number' => [
                'required',
                'string',
                'max:255',
            ],

            'manufacturer' => [
                'required',
                'string',
                'max:255',
            ],

            'capacity' => [
                'required',
                'numeric',
                'min:0',
            ],

            'quantity' => [
                'required',
                'integer',
                'min:1',
            ],

            /*
            |--------------------------------------------------------------------------
            | Damaged Quantity
            |--------------------------------------------------------------------------
            */

            'damaged_quantity' => [
                'nullable',
                'integer',
                'min:0',
                'lte:quantity',
            ],

            /*
            |--------------------------------------------------------------------------
            | Damage Reason
            |--------------------------------------------------------------------------
            |
            | Required only when damaged quantity is greater than 0.
            |
            */

            'damage_reason' => [
                'nullable',
                'string',
                'max:1000',

                Rule::requiredIf(function () {

                    return (int) (
                        $this->input('damaged_quantity') ?? 0
                    ) > 0;

                }),
            ],

            'minimum_stock' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'condition' => [
                'required',
                'in:New,Used',
            ],

            'status' => [
                'nullable',
                'in:Available,Installed',
            ],

            'area_id' => [
                'nullable',
                'exists:areas,id',
            ],

            'installation_date' => [
                'nullable',
                'date',
            ],

            'removed_date' => [
                'nullable',
                'date',
            ],

            'remarks' => [
                'nullable',
                'string',
            ],

        ];
    }

    /**
     * Custom Validation Messages
     */
    public function messages(): array
    {
        return [

            'item_type.required' =>
                'Item type is required.',

            'item_name.required' =>
                'Item name is required.',

            'serial_number.required' =>
                'Serial number is required.',

            'manufacturer.required' =>
                'Manufacturer is required.',

            'capacity.required' =>
                'Capacity is required.',

            'capacity.numeric' =>
                'Capacity must be numeric.',

            'quantity.required' =>
                'Quantity is required.',

            'quantity.integer' =>
                'Quantity must be a whole number.',

            'quantity.min' =>
                'Quantity must be at least 1.',

            'damaged_quantity.integer' =>
                'Damaged quantity must be a whole number.',

            'damaged_quantity.min' =>
                'Damaged quantity cannot be negative.',

            'damaged_quantity.lte' =>
                'Damaged quantity cannot be greater than total quantity.',

            'damage_reason.required' =>
                'Damage reason is required when damaged quantity is greater than 0.',

            'damage_reason.string' =>
                'Damage reason must be a valid text.',

            'condition.required' =>
                'Condition is required.',

            'area_id.exists' =>
                'Selected area does not exist.',

        ];
    }
}