<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================================
 * File:
 * database/migrations/2026_07_20_101911_add_extra_fields_to_users_table.php
 *
 * Description:
 * Adds additional user information fields.
 * Area assignment is handled separately after the areas table is created.
 * ============================================================================
 */

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            /*
            |------------------------------------------------------------------
            | User Information
            |------------------------------------------------------------------
            */

            $table->string('phone', 20)
                ->nullable()
                ->after('email');

            /*
            |------------------------------------------------------------------
            | Role
            |------------------------------------------------------------------
            */

            $table->enum('role', [

                'Administrator',

                'Engineer',

                'Operator',

            ])
                ->default('Operator')
                ->after('password');

            /*
            |------------------------------------------------------------------
            | Profile Image
            |------------------------------------------------------------------
            */

            $table->string('profile_image')
                ->nullable()
                ->after('role');

            /*
            |------------------------------------------------------------------
            | Status
            |------------------------------------------------------------------
            */

            $table->enum('status', [

                'Active',

                'Inactive',

            ])
                ->default('Active')
                ->after('profile_image');

            /*
            |------------------------------------------------------------------
            | Last Login
            |------------------------------------------------------------------
            */

            $table->timestamp('last_login')
                ->nullable()
                ->after('status');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropColumn([

                'phone',

                'role',

                'profile_image',

                'status',

                'last_login',

            ]);

        });
    }
};