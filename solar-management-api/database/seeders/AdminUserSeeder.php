<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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

                'phone' => '03001234567',

                // Laravel automatically hash karega
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