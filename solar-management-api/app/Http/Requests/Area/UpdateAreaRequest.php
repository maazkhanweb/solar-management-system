<?php

namespace App\Http\Requests\Area;

class UpdateAreaRequest extends StoreAreaRequest
{
    /**
     * =========================================================================
     * Update Area Validation Rules
     *
     * Phone number is optional.
     * =========================================================================
     */

    public function rules(): array
    {
        return [
            'area_name' => [
                'required',
                'string',
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

            'phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'status' => [
                'required',
                'string',
                'in:Active,Inactive',
            ],
        ];
    }
}