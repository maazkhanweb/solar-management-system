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
        Schema::table('bills', function (Blueprint $table) {

            /*
            |--------------------------------------------------------------------------
            | Solar Bill Image
            |--------------------------------------------------------------------------
            |
            | area_id is NOT added here because it was already
            | created by the previous migration:
            |
            | 2026_08_14_071345_add_area_id_to_bills_table
            |
            */

            if (!Schema::hasColumn('bills', 'solar_image')) {

                $table->string('solar_image')
                    ->nullable()
                    ->after('bill_image');

            }

        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bills', function (Blueprint $table) {

            if (Schema::hasColumn('bills', 'solar_image')) {

                $table->dropColumn('solar_image');

            }

        });
    }
};