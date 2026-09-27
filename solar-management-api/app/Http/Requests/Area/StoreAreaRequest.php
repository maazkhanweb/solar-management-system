<?php

namespace App\Http\Requests\Area;

use Illuminate\Foundation\Http\FormRequest;


/**
 * ============================================================================
 * File:
 * app/Http/Requests/Area/StoreAreaRequest.php
 *
 * Description:
 * Validation rules for creating and updating an Area.
 * Phone validation has been removed.
 * ============================================================================
 */

class StoreAreaRequest extends FormRequest
{
    /**
     * ============================================================
     * AUTHORIZE REQUEST
     * ============================================================
     */

    public function authorize(): bool
    {
        return true;
    }


    /**
     * ============================================================
     * VALIDATION RULES
     * ============================================================
     */

    public function rules(): array
    {
        return [

            'area_name' => [

                'required',

                'string',

                'min:3',

                'max:255',

            ],


            'location' => [

                'required',

                'string',

                'max:255',

            ],


            'manager' => [

                'required',

                'string',

                'max:255',

            ],


            'status' => [

                'required',

                'in:Active,Inactive',

            ],

        ];
    }


    /**
     * ============================================================
     * CUSTOM VALIDATION MESSAGES
     * ============================================================
     */

    public function messages(): array
    {
        return [

            'area_name.required' =>
                'Area name is required.',


            'area_name.min' =>
                'Area name must be at least 3 characters.',


            'location.required' =>
                'Location is required.',


            'manager.required' =>
                'Manager name is required.',


            'status.required' =>
                'Status is required.',


            'status.in' =>
                'Invalid status selected.',

        ];
    }
}