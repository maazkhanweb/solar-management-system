<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class AssignInventoryRequest extends FormRequest
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

            'installation_date' => [

                'required',

                'date',

            ],

            'remarks' => [

                'nullable',

                'string',

            ],

        ];
    }

    /**
     * Custom Messages
     */
    public function messages(): array
    {
        return [

            'area_id.required' => 'Area is required.',

            'area_id.exists' => 'Selected area does not exist.',

            'installation_date.required' => 'Installation date is required.',

        ];
    }
}