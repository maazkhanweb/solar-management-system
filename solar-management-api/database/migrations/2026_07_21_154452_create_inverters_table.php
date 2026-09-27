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
        Schema::create('inverters', function (Blueprint $table) {

            $table->id();

            $table->string('inverter_name');

            $table->string('serial_number')->unique();

            $table->string('manufacturer');

            $table->decimal('capacity', 10, 2);

            $table->enum('status', [

                'Active',

                'Inactive',

                'Maintenance',

            ])->default('Active');

            $table->foreignId('area_id')
                ->nullable()
                ->constrained('areas')
                ->nullOnDelete();

            $table->date('installation_date')
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
        Schema::dropIfExists('inverters');
    }
};