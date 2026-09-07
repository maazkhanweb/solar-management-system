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
        if (!Schema::hasColumn('inventory_items', 'damage_reason')) {
            Schema::table('inventory_items', function (Blueprint $table) {
                $table->text('damage_reason')
                    ->nullable()
                    ->after('damaged_quantity');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('inventory_items', 'damage_reason')) {
            Schema::table('inventory_items', function (Blueprint $table) {
                $table->dropColumn('damage_reason');
            });
        }
    }
};