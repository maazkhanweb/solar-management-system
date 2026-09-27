<?php

/*
|--------------------------------------------------------------------------
| File:
| database/migrations/xxxx_xx_xx_xxxxxx_allow_custom_inventory_item_types.php
|
| Description:
| Removes the restriction that only allowed:
|
| - inverter
| - solar_panel
| - battery
|
| Custom inventory item types such as Cable can now be saved.
|--------------------------------------------------------------------------
*/

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
        | Remove old CHECK constraint from PostgreSQL
        |--------------------------------------------------------------------------
        */

        DB::statement("
            DO \$\$
            DECLARE
                constraint_name TEXT;
            BEGIN
                FOR constraint_name IN
                    SELECT conname
                    FROM pg_constraint
                    WHERE conrelid = 'inventory_items'::regclass
                    AND contype = 'c'
                    AND pg_get_constraintdef(oid)
                        ILIKE '%item_type%'
                LOOP
                    EXECUTE
                        'ALTER TABLE inventory_items DROP CONSTRAINT '
                        || quote_ident(constraint_name);
                END LOOP;
            END \$\$;
        ");


        /*
        |--------------------------------------------------------------------------
        | Convert Item Type To Normal String
        |--------------------------------------------------------------------------
        */

        DB::statement("
            ALTER TABLE inventory_items
            ALTER COLUMN item_type
            TYPE VARCHAR(255)
            USING item_type::text
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        /*
        |--------------------------------------------------------------------------
        | No automatic rollback is applied here because custom
        | item types may already exist in the database.
        |--------------------------------------------------------------------------
        */
    }
};