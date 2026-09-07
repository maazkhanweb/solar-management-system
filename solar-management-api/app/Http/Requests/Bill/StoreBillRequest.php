<?php

namespace App\Http\Requests\Bill;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'consumer_name' => [
                'required',
                'string',
                'max:255',
            ],

            'reference_number' => [
                'required',
                'string',
                'max:100',
                'unique:bills,reference_number',
            ],

            'bill_month' => [
                'required',
                'integer',
                'between:1,12',
            ],

            'bill_year' => [
                'required',
                'integer',
                'digits:4',
            ],

            'bill_address' => [
                'nullable',
                'string',
                'max:500',
            ],

            'area_id' => [
                'nullable',
                'integer',
                'exists:areas,id',
            ],

            'units_consumed' => [
                'required',
                'numeric',
                'min:0',
            ],

            'bill_amount' => [
                'required',
                'numeric',
                'min:0',
            ],

            'generated_units' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'difference_units' => [
                'nullable',
                'numeric',
            ],

            'status' => [
                'required',
                Rule::in([
                    'Paid',
                    'Unpaid',
                ]),
            ],

            'generation_loss_reason' => [
                'nullable',
                'string',
                'max:255',
            ],

            'remarks' => [
                'nullable',
                'string',
            ],

            'bill_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'ocr_status' => [
                'nullable',
                'boolean',
            ],

            'ocr_confidence' => [
                'nullable',
                'numeric',
                'between:0,100',
            ],
        ];
    }
}