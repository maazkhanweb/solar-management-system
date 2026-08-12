<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

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
                'in:inverter,solar_panel,battery',
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
                'unique:inventory_items,serial_number',
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

            'battery_health' => [
    'nullable',
    'numeric',
    'min:0',
    'max:100',
],

            'quantity' => [
    'required',
    'integer',
    'min:1',
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

            // Status is optional.
            // If frontend doesn't send it,
            // Controller/Service will save "Available".
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

            'item_type.required' => 'Item type is required.',

            'item_name.required' => 'Item name is required.',

            'serial_number.required' => 'Serial number is required.',

            'serial_number.unique' => 'Serial number already exists.',

            'manufacturer.required' => 'Manufacturer is required.',

            'capacity.required' => 'Capacity is required.',

            'capacity.numeric' => 'Capacity must be numeric.',

            'condition.required' => 'Condition is required.',

            'area_id.exists' => 'Selected area does not exist.',

        ];
    }
}