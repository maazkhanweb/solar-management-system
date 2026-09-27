<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Remove Old Constraint First
        |--------------------------------------------------------------------------
        */

        DB::statement("
            ALTER TABLE users
            DROP CONSTRAINT IF EXISTS users_role_check
        ");

        /*
        |--------------------------------------------------------------------------
        | Add Temporary Constraint
        |--------------------------------------------------------------------------
        | Administrator
        | Engineer
        | Operator
        | Manager
        |--------------------------------------------------------------------------
        */

        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT users_role_check
            CHECK (
                role IN (
                    'Administrator',
                    'Engineer',
                    'Operator',
                    'Manager'
                )
            )
        ");

        /*
        |--------------------------------------------------------------------------
        | Convert Existing Roles
        |--------------------------------------------------------------------------
        */

        DB::statement("
            UPDATE users
            SET role = 'Manager'
            WHERE role IN ('Engineer','Operator')
        ");

        /*
        |--------------------------------------------------------------------------
        | Replace Constraint
        |--------------------------------------------------------------------------
        */

        DB::statement("
            ALTER TABLE users
            DROP CONSTRAINT users_role_check
        ");

        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT users_role_check
            CHECK (
                role IN (
                    'Administrator',
                    'Manager'
                )
            )
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("
            ALTER TABLE users
            DROP CONSTRAINT IF EXISTS users_role_check
        ");

        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT users_role_check
            CHECK (
                role IN (
                    'Administrator',
                    'Engineer',
                    'Operator',
                    'Manager'
                )
            )
        ");

        DB::statement("
            UPDATE users
            SET role = 'Engineer'
            WHERE role = 'Manager'
        ");

        DB::statement("
            ALTER TABLE users
            DROP CONSTRAINT users_role_check
        ");

        DB::statement("
            ALTER TABLE users
            ADD CONSTRAINT users_role_check
            CHECK (
                role IN (
                    'Administrator',
                    'Engineer',
                    'Operator'
                )
            )
        ");
    }
};