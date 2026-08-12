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
        Schema::create('bills', function (Blueprint $table) {

            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Consumer Information
            |--------------------------------------------------------------------------
            */

            $table->string('consumer_name');

            $table->string('reference_number')->unique();

            /*
            |--------------------------------------------------------------------------
            | Bill Information
            |--------------------------------------------------------------------------
            */

            $table->unsignedTinyInteger('bill_month');

            $table->unsignedSmallInteger('bill_year');

            /*
|--------------------------------------------------------------------------
| Bill Address
|--------------------------------------------------------------------------
*/

$table->string('bill_address')
    ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Consumption
            |--------------------------------------------------------------------------
            */

            $table->decimal('units_consumed', 10, 2);

            $table->decimal('bill_amount', 12, 2);

            /*
            |--------------------------------------------------------------------------
            | Solar Comparison
            |--------------------------------------------------------------------------
            */

            $table->decimal('generated_units', 10, 2)
                ->default(0);

            $table->decimal('difference_units', 10, 2)
                ->default(0);

            /*
            |--------------------------------------------------------------------------
            | Status
            |--------------------------------------------------------------------------
            */

            $table->enum('status', [

                'Paid',

                'Unpaid',

            ])->default('Unpaid');

            /*
            |--------------------------------------------------------------------------
            | Generation Analysis
            |--------------------------------------------------------------------------
            */

            $table->string('generation_loss_reason')
                ->nullable();

            $table->text('remarks')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | OCR
            |--------------------------------------------------------------------------
            */

            $table->string('bill_image')
                ->nullable();

            $table->boolean('ocr_status')
                ->default(false);

            $table->decimal('ocr_confidence', 5, 2)
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Audit
            |--------------------------------------------------------------------------
            */

            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->cascadeOnUpdate()
                ->nullOnDelete();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */

            $table->index('bill_month');

            $table->index('bill_year');

            $table->index('status');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};