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
        Schema::create('areas', function (Blueprint $table) {

            $table->id();

            $table->string('area_name');

            $table->string('location');

            $table->string('manager');

            /*
            |--------------------------------------------------------------------------
            | OPTIONAL FIELDS
            |--------------------------------------------------------------------------
            */

            // Phone number is optional.
            $table->string('phone', 20)->nullable();

            // Capacity is optional.
            $table->decimal('capacity', 10, 2)->nullable();

            $table->enum('status', [
                'Active',
                'Inactive',
            ])->default('Active');

            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('areas');
    }
};