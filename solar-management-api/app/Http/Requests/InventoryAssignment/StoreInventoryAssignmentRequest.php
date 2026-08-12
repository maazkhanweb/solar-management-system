<?php

namespace App\Http\Requests\InventoryAssignment;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryAssignmentRequest extends FormRequest
{
    /**
     * Authorize Request
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

            'inventory_item_id' => [
                'required',
                'exists:inventory_items,id',
            ],

            'area_id' => [
                'required',
                'exists:areas,id',
            ],

            'quantity' => [
                'required',
                'integer',
                'min:1',
            ],

            'remarks' => [
                'nullable',
                'string',
                'max:1000',
            ],

        ];
    }

    /**
     * Validation Messages
     */
    public function messages(): array
    {
        return [

            'inventory_item_id.required' => 'Inventory Item is required.',

            'inventory_item_id.exists' => 'Selected Inventory Item does not exist.',

            'area_id.required' => 'Area is required.',

            'area_id.exists' => 'Selected Area does not exist.',

            'quantity.required' => 'Quantity is required.',

            'quantity.integer' => 'Quantity must be a number.',

            'quantity.min' => 'Quantity must be at least 1.',

        ];
    }
}