<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add area relationship to bills table.
     */
    public function up(): void
    {
        Schema::table('bills', function (
            Blueprint $table
        ) {

            /*
            |--------------------------------------------------------------------------
            | Selected Area
            |--------------------------------------------------------------------------
            */

            $table->foreignId('area_id')
                ->nullable()
                ->after('bill_address')
                ->constrained('areas')
                ->cascadeOnUpdate()
                ->nullOnDelete();

        });
    }

    /**
     * Reverse migration.
     */
    public function down(): void
    {
        Schema::table('bills', function (
            Blueprint $table
        ) {

            $table->dropConstrainedForeignId(
                'area_id'
            );

        });
    }
};