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
        Schema::create('solar_panels', function (Blueprint $table) {

            $table->id();

            $table->string('panel_name');

            $table->string('serial_number')->unique();

            $table->foreignId('area_id')
                ->constrained('areas')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('inverter_id')
                ->constrained('inverters')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->decimal('capacity', 10, 2);

            $table->string('manufacturer');

            $table->date('installation_date');

            $table->enum('status', [
                'Active',
                'Inactive',
            ])->default('Active');

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solar_panels');
    }
};