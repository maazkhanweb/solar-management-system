<?php

namespace App\Http\Requests\SolarPanel;

use Illuminate\Foundation\Http\FormRequest;

class StoreSolarPanelRequest extends FormRequest
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

            // =========================
            // Solar Panel
            // =========================

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
                'unique:solar_panels,serial_number',
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

            // =========================
            // New Area (Optional)
            // =========================

            'area_location' => [
                'nullable',
                'string',
                'max:255',
            ],

            'area_manager' => [
                'nullable',
                'string',
                'max:255',
            ],

            'area_phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'area_capacity' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'area_status' => [
                'nullable',
                'in:Active,Inactive',
            ],

            // =========================
            // New Inverter (Optional)
            // =========================

            'inverter_serial_number' => [
                'nullable',
                'string',
                'max:255',
            ],

            'inverter_capacity' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'inverter_manufacturer' => [
                'nullable',
                'string',
                'max:255',
            ],

            'inverter_installation_date' => [
                'nullable',
                'date',
            ],

            'inverter_status' => [
                'nullable',
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

            'panel_name.required' => 'Panel name is required.',
            'panel_name.min' => 'Panel name must be at least 3 characters.',

            'serial_number.required' => 'Serial number is required.',
            'serial_number.unique' => 'Serial number already exists.',

            'area_name.required' => 'Area name is required.',

            'inverter_name.required' => 'Inverter name is required.',

            'capacity.required' => 'Panel capacity is required.',
            'capacity.numeric' => 'Panel capacity must be numeric.',

            'manufacturer.required' => 'Panel manufacturer is required.',

            'installation_date.required' => 'Panel installation date is required.',

            'status.required' => 'Panel status is required.',

            'area_capacity.numeric' => 'Area capacity must be numeric.',

            'inverter_capacity.numeric' => 'Inverter capacity must be numeric.',

            'inverter_installation_date.date' => 'Invalid inverter installation date.',

        ];
    }
}