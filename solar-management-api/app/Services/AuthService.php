<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Authenticate User
     */
    public function login(array $credentials): array
    {
        /*
        |--------------------------------------------------------------------------
        | Find User
        |--------------------------------------------------------------------------
        */

        $user = User::with('area')
            ->where('email', $credentials['email'])
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Invalid Email
        |--------------------------------------------------------------------------
        */

        if (!$user) {

            return [

                'success' => false,

                'message' => 'Invalid email or password.',

            ];

        }

        /*
        |--------------------------------------------------------------------------
        | Invalid Password
        |--------------------------------------------------------------------------
        */

        if (!Hash::check($credentials['password'], $user->password)) {

            return [

                'success' => false,

                'message' => 'Invalid email or password.',

            ];

        }

        /*
        |--------------------------------------------------------------------------
        | Inactive Account
        |--------------------------------------------------------------------------
        */

        if ($user->status !== 'Active') {

            return [

                'success' => false,

                'message' => 'Your account is inactive.',

            ];

        }

        /*
        |--------------------------------------------------------------------------
        | Update Last Login
        |--------------------------------------------------------------------------
        */

        $user->update([

            'last_login' => now(),

        ]);

        /*
        |--------------------------------------------------------------------------
        | Generate Token
        |--------------------------------------------------------------------------
        */

        $token = $user
            ->createToken('auth_token')
            ->plainTextToken;

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return [

            'success' => true,

            'message' => 'Login successful.',

            'token' => $token,

            'user' => [

                'id' => $user->id,

                'name' => $user->name,

                'email' => $user->email,

                'phone' => $user->phone,

                'role' => $user->role,

                'status' => $user->status,

                'last_login' => $user->last_login,

                'area_id' => $user->area_id,

                'area' => $user->area
                    ? [
                        'id' => $user->area->id,
                        'area_name' => $user->area->area_name,
                    ]
                    : null,

            ],

        ];
    }

    /**
     * Logout User
     */
    public function logout(User $user): array
    {
        $user->currentAccessToken()->delete();

        return [

            'success' => true,

            'message' => 'Logout successful.',

        ];
    }
}