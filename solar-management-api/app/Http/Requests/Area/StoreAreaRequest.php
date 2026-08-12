<?php

namespace App\Http\Requests\Area;

use Illuminate\Foundation\Http\FormRequest;

class StoreAreaRequest extends FormRequest
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

            'phone' => [
                'required',
                'regex:/^[0-9+\-\s()]+$/',
                'max:20',
            ],

            

            'status' => [
                'required',
                'in:Active,Inactive',
            ],

        ];
    }

    /**
     * Custom Messages
     */
    public function messages(): array
    {
        return [

            'area_name.required' => 'Area name is required.',
            'area_name.min' => 'Area name must be at least 3 characters.',

            'location.required' => 'Location is required.',

            'manager.required' => 'Manager name is required.',

            'phone.required' => 'Phone number is required.',
            'phone.regex' => 'Enter a valid phone number.',

        
            'status.required' => 'Status is required.',
            'status.in' => 'Invalid status selected.',

        ];
    }
}