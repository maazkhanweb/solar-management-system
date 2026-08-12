<?php

namespace App\Http\Requests\Inverter;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInverterRequest extends FormRequest
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

            'inverter_name' => [
                'required',
                'string',
                'max:255',
            ],

            'serial_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('inverters', 'serial_number')
                    ->ignore($this->route('inverter')),
            ],

            'area_id' => [
                'required',
                'exists:areas,id',
            ],

            'capacity' => [
                'required',
                'numeric',
                'min:0',
            ],

            'manufacturer' => [
                'required',
                'string',
                'max:255',
            ],

            'installation_date' => [
                'required',
                'date',
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

            'inverter_name.required' => 'Inverter name is required.',

            'serial_number.required' => 'Serial number is required.',
            'serial_number.unique' => 'Serial number already exists.',

            'area_id.required' => 'Area is required.',
            'area_id.exists' => 'Selected area is invalid.',

            'capacity.required' => 'Capacity is required.',
            'capacity.numeric' => 'Capacity must be numeric.',

            'manufacturer.required' => 'Manufacturer is required.',

            'installation_date.required' => 'Installation date is required.',
            'installation_date.date' => 'Enter a valid installation date.',

            'status.required' => 'Status is required.',
            'status.in' => 'Invalid status selected.',

        ];
    }
}