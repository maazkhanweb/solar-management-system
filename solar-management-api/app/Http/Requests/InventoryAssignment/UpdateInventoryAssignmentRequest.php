<?php

namespace App\Http\Requests\InventoryAssignment;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInventoryAssignmentRequest extends FormRequest
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

            'status' => [

                'nullable',

                'in:Assigned,Returned',

            ],

        ];
    }

    /**
     * Custom Validation Messages
     */
    public function messages(): array
    {
        return [

            'area_id.required' => 'Area is required.',

            'area_id.exists' => 'Selected area does not exist.',

            'quantity.required' => 'Quantity is required.',

            'quantity.integer' => 'Quantity must be a number.',

            'quantity.min' => 'Quantity must be at least 1.',

            'remarks.max' => 'Remarks may not exceed 1000 characters.',

            'status.in' => 'Invalid assignment status.',

        ];
    }
}