<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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

            'name' => [
                'required',
                'string',
                'min:3',
                'max:255',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
            ],

            'phone' => [
                'nullable',
                'regex:/^[0-9+\-\s()]+$/',
                'max:20',
            ],

            /*
            |--------------------------------------------------------------------------
            | Area
            |--------------------------------------------------------------------------
            */

            'area_id' => [
                'nullable',
                'exists:areas,id',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
            ],

            'role' => [
    'required',
    'in:Administrator,Manager',
],

            'status' => [
                'required',
                'in:Active,Inactive',
            ],

            'profile_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],

        ];
    }

    /**
     * Custom Messages
     */
    public function messages(): array
    {
        return [

            'name.required' => 'Full name is required.',
            'name.min' => 'Name must be at least 3 characters.',

            'email.required' => 'Email is required.',
            'email.email' => 'Enter a valid email address.',
            'email.unique' => 'Email already exists.',

            'phone.regex' => 'Enter a valid phone number.',

            'area_id.exists' => 'Selected area is invalid.',

            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',

            'role.required' => 'Role is required.',
            'role.in' => 'Invalid role selected.',

            'status.required' => 'Status is required.',
            'status.in' => 'Invalid status selected.',

            'profile_image.image' => 'Profile image must be an image.',
            'profile_image.mimes' => 'Allowed formats: jpg, jpeg, png, webp.',
            'profile_image.max' => 'Image size must not exceed 2 MB.',

        ];
    }
}