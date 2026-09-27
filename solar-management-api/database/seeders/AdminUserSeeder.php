<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * ============================================================================
 * File:
 * database/seeders/AdminUserSeeder.php
 *
 * Description:
 * Creates or updates the default system administrator.
 * ============================================================================
 */

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(

            [
                'email' => 'admin@solar.com',
            ],

            [
                'name' => 'Super Admin',

                'password' => Hash::make('admin123'),

                'role' => 'Administrator',

                'profile_image' => null,

                'status' => 'Active',

                'last_login' => null,

                'email_verified_at' => now(),
            ]

        );
    }
}