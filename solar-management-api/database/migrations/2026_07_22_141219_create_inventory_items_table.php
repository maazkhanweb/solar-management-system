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
        Schema::create('inventory_items', function (Blueprint $table) {

            $table->id();

            $table->enum('item_type', [
                'inverter',
                'solar_panel',
                'battery',
            ]);

            $table->string('item_name');

            $table->string('serial_number')->unique();

            $table->string('manufacturer');

            $table->decimal('capacity', 10, 2);

            /*
            |--------------------------------------------------------------------------
            | Stock Management
            |--------------------------------------------------------------------------
            */

            $table->unsignedInteger('quantity')->default(0);

            $table->unsignedInteger('available_quantity')->default(0);

            $table->unsignedInteger('assigned_quantity')->default(0);

            $table->unsignedInteger('damaged_quantity')->default(0);

            $table->unsignedInteger('minimum_stock')->default(5);

            /*
            |--------------------------------------------------------------------------
            | Item Details
            |--------------------------------------------------------------------------
            */

            $table->enum('condition', [
                'New',
                'Used',
            ])->default('New');

            $table->enum('status', [
                'Available',
                'Installed',
            ])->default('Available');

            $table->foreignId('area_id')
                ->nullable()
                ->constrained('areas')
                ->nullOnDelete();

            $table->date('installation_date')
                ->nullable();

            $table->date('removed_date')
                ->nullable();

            $table->text('remarks')
                ->nullable();

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
    }
};