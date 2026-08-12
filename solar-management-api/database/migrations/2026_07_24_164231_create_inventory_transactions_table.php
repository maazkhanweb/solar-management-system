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
        Schema::create('inventory_transactions', function (Blueprint $table) {

            $table->id();

            // Inventory Item
            $table->foreignId('inventory_item_id')
                ->constrained('inventory_items')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Transaction Type
            $table->enum('transaction_type', [
                'ADD',
                'ASSIGN',
                'RETURN',
                'UPDATE',
                'DELETE',
                'DAMAGE',
                'REPAIR',
            ]);

            // Quantity
            $table->integer('quantity')->default(0);

            // From Area
            $table->foreignId('from_area_id')
                ->nullable()
                ->constrained('areas')
                ->nullOnDelete();

            // To Area
            $table->foreignId('to_area_id')
                ->nullable()
                ->constrained('areas')
                ->nullOnDelete();

            // User
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Optional Notes
            $table->text('remarks')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('transaction_type');
            $table->index('inventory_item_id');
            $table->index('user_id');
            $table->index('created_at');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
    }
};