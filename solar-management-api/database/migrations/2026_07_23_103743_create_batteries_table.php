<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('batteries', function (Blueprint $table) {

            $table->id();

            $table->string('battery_name');

            $table->string('battery_type');

            $table->decimal('capacity',10,2);

            $table->string('voltage');

            $table->foreignId('area_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('inverter_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->date('installation_date')->nullable();

            $table->enum('status',[
                'Active',
                'Inactive'
            ]);

            $table->text('notes')->nullable();

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batteries');
    }
};