<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserService
{
    /**
     * Get All Users
     */
    public function getUsers(): array
    {
        $query = User::with('area')
            ->select([
                'id',
                'name',
                'email',
                'phone',
                'area_id',
                'role',
                'status',
                'profile_image',
                'last_login',
                'created_at',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Manager
        |--------------------------------------------------------------------------
        */

        if (Auth::user()->role === 'Manager') {

            $query->where(
                'area_id',
                Auth::user()->area_id
            );

        }

        return [

            'success' => true,

            'users' => $query
                ->latest()
                ->paginate(10)
                ->withQueryString(),

        ];
    }

    /**
     * Get Users For Dropdown
     */
    public function getUserOptions(): array
    {
        $query = User::with('area')
            ->select([
                'id',
                'name',
                'area_id',
            ])
            ->where('status', 'Active');

        if (Auth::user()->role === 'Manager') {

            $query->where(
                'area_id',
                Auth::user()->area_id
            );

        }

        return [

            'success' => true,

            'users' => $query
                ->orderBy('name')
                ->get(),

        ];
    }

    /**
     * Find User
     */
    public function findUserById(User $user): array
    {
        if (
            Auth::user()->role === 'Manager'
            &&
            $user->area_id != Auth::user()->area_id
        ) {

            abort(403);

        }

        return [

            'success' => true,

            'user' => $user->load('area'),

        ];
    }

    /**
     * Create User
     */
    public function createUser(array $data): array
    {
        /*
        |--------------------------------------------------------------------------
        | Manager can create users only
        | in his own Area
        |--------------------------------------------------------------------------
        */

        if (Auth::user()->role === 'Manager') {

            $data['area_id'] = Auth::user()->area_id;

        }

        if (isset($data['profile_image'])) {

            $data['profile_image'] = $data['profile_image']
                ->store('users', 'public');

        }

        $data['password'] = Hash::make(
            $data['password']
        );

        $user = User::create($data);

        return [

            'success' => true,

            'message' => 'User created successfully.',

            'user' => $user->load('area'),

        ];
    }

    /**
     * Update User
     */
    public function updateUser(
        User $user,
        array $data
    ): array {

        if (
            Auth::user()->role === 'Manager'
            &&
            $user->area_id != Auth::user()->area_id
        ) {

            abort(403);

        }

        /*
        |--------------------------------------------------------------------------
        | Manager cannot change Area
        |--------------------------------------------------------------------------
        */

        if (Auth::user()->role === 'Manager') {

            $data['area_id'] = Auth::user()->area_id;

        }

        if (isset($data['profile_image'])) {

            if (

                $user->profile_image

                &&

                Storage::disk('public')
                    ->exists($user->profile_image)

            ) {

                Storage::disk('public')
                    ->delete($user->profile_image);

            }

            $data['profile_image'] =

                $data['profile_image']
                    ->store('users', 'public');

        }

        if (!empty($data['password'])) {

            $data['password'] = Hash::make(
                $data['password']
            );

        } else {

            unset($data['password']);

        }

        $user->update($data);

        return [

            'success' => true,

            'message' => 'User updated successfully.',

            'user' => $user
                ->fresh()
                ->load('area'),

        ];
    }

    /**
     * Delete User
     */
    public function deleteUser(
        User $user
    ): array {

        if (
            Auth::user()->role === 'Manager'
            &&
            $user->area_id != Auth::user()->area_id
        ) {

            abort(403);

        }

        if (

            $user->profile_image

            &&

            Storage::disk('public')
                ->exists($user->profile_image)

        ) {

            Storage::disk('public')
                ->delete($user->profile_image);

        }

        $user->delete();

        return [

            'success' => true,

            'message' => 'User deleted successfully.',

        ];
    }
}