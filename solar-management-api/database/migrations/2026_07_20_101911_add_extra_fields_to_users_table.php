<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            /*
            |--------------------------------------------------------------------------
            | User Information
            |--------------------------------------------------------------------------
            */

            $table->string('phone', 20)
                ->nullable()
                ->after('email');

            /*
            |--------------------------------------------------------------------------
            | Area Assignment
            |--------------------------------------------------------------------------
            */

            $table->foreignId('area_id')
                ->nullable()
                ->after('phone')
                ->constrained('areas')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Role
            |--------------------------------------------------------------------------
            */

            $table->enum('role', [

                'Administrator',

                'Engineer',

                'Operator',

            ])->default('Operator')
              ->after('password');

            /*
            |--------------------------------------------------------------------------
            | Profile
            |--------------------------------------------------------------------------
            */

            $table->string('profile_image')
                ->nullable()
                ->after('role');

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            $table->enum('status', [

                'Active',

                'Inactive',

            ])->default('Active')
              ->after('profile_image');

            /*
            |--------------------------------------------------------------------------
            | Last Login
            |--------------------------------------------------------------------------
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

            $table->dropConstrainedForeignId('area_id');

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