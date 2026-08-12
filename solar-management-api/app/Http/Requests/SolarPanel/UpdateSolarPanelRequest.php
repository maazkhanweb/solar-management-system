<?php

namespace App\Http\Requests\SolarPanel;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSolarPanelRequest extends FormRequest
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
        $solarPanel = $this->route('solarPanel');

        return [

            'panel_name' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],

            'serial_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('solar_panels', 'serial_number')->ignore($solarPanel),
            ],

            'area_name' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],

            'inverter_name' => [
                'required',
                'string',
                'min:3',
                'max:255',
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
                'in:Active,Inactive,Maintenance',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],

        ];
    }

    /**
     * Custom Messages
     */
    public function messages(): array
    {
        return [

            'panel_name.required' => 'Panel name is required.',
            'panel_name.min' => 'Panel name must be at least 3 characters.',

            'serial_number.required' => 'Serial number is required.',
            'serial_number.unique' => 'Serial number already exists.',

            'area_name.required' => 'Area is required.',
            'area_name.min' => 'Area name must be at least 3 characters.',

            'inverter_name.required' => 'Inverter is required.',
            'inverter_name.min' => 'Inverter name must be at least 3 characters.',

            'capacity.required' => 'Capacity is required.',
            'capacity.numeric' => 'Capacity must be numeric.',

            'manufacturer.required' => 'Manufacturer is required.',

            'installation_date.required' => 'Installation date is required.',
            'installation_date.date' => 'Invalid installation date.',

            'status.required' => 'Status is required.',
            'status.in' => 'Invalid status selected.',

        ];
    }
}