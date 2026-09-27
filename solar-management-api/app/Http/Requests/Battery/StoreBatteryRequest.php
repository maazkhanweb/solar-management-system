<?php

namespace App\Http\Requests\Battery;

use Illuminate\Foundation\Http\FormRequest;

class StoreBatteryRequest extends FormRequest
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

            'battery_name' => 'required|string|max:255',

            'battery_type' => 'required|string|max:255',

            'capacity' => 'required|numeric|min:1',

            'voltage' => 'required|string|max:100',

            'area_id' => 'nullable|exists:areas,id',

            'inverter_id' => 'nullable|exists:inverters,id',

            'installation_date' => 'nullable|date',

            'status' => 'required|in:Active,Inactive',

            'notes' => 'nullable|string',

        ];
    }
}