<?php

/*
|--------------------------------------------------------------------------
| File:
| database/migrations/xxxx_xx_xx_xxxxxx_update_inventory_item_type_and_serial_number.php
|
| Description:
| Changes item_type from fixed enum to string so custom inventory
| types such as Cable can be added.
|
| Also removes the unique constraint from serial_number because one
| inventory row can now preserve multiple serial numbers.
|--------------------------------------------------------------------------
*/

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
        Schema::table(
            'inventory_items',

            function (Blueprint $table) {

                $table->dropUnique(
                    'inventory_items_serial_number_unique'
                );

                $table->string('item_type')
                    ->change();

            }
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table(
            'inventory_items',

            function (Blueprint $table) {

                $table->string('serial_number')
                    ->unique()
                    ->change();

            }
        );
    }
};