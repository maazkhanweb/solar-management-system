<?php

namespace App\Services\Analysis;

class BillAnalysisService
{
    /**
     * Analyze Bill
     */
   public function analyze(
    float $unitsConsumed,
    float $generatedUnits,
    float $billAmount,
    ?string $generationLossReason = null
): array {
        /*
        |--------------------------------------------------------------------------
        | Difference Units
        |--------------------------------------------------------------------------
        */

        $differenceUnits = max(
            0,
            $unitsConsumed - $generatedUnits
        );

        /*
        |--------------------------------------------------------------------------
        | Unit Rate
        |--------------------------------------------------------------------------
        */

        $unitRate = 0;

        if ($unitsConsumed > 0) {

            $unitRate = $billAmount / $unitsConsumed;

        }

        /*
        |--------------------------------------------------------------------------
        | Solar Coverage
        |--------------------------------------------------------------------------
        */

        $coverage = 0;

        if ($unitsConsumed > 0) {

            $coverage = (

                $generatedUnits /

                $unitsConsumed

            ) * 100;

        }

        /*
        |--------------------------------------------------------------------------
        | WAPDA Dependency
        |--------------------------------------------------------------------------
        */

        $dependency = 100 - $coverage;

        /*
        |--------------------------------------------------------------------------
        | Estimated Saving
        |--------------------------------------------------------------------------
        */

        $estimatedSaving =

            $generatedUnits *

            $unitRate;

        /*
        |--------------------------------------------------------------------------
        | Efficiency
        |--------------------------------------------------------------------------
        */

        if ($coverage >= 90) {

            $efficiency = "Excellent";

        } elseif ($coverage >= 80) {

            $efficiency = "Very Good";

        } elseif ($coverage >= 70) {

            $efficiency = "Good";

        } elseif ($coverage >= 60) {

            $efficiency = "Average";

        } else {

            $efficiency = "Poor";

        }

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return [

            "success" => true,

            "message" => "Bill analyzed successfully.",

            "analysis" => [

                "units_consumed" => round(
                    $unitsConsumed,
                    2
                ),

                "generated_units" => round(
                    $generatedUnits,
                    2
                ),

                "difference_units" => round(
                    $differenceUnits,
                    2
                ),

                "bill_amount" => round(
                    $billAmount,
                    2
                ),

                "unit_rate" => round(
                    $unitRate,
                    2
                ),

                "solar_coverage" => round(
                    $coverage,
                    2
                ),

                "wapda_dependency" => round(
                    $dependency,
                    2
                ),

                "estimated_saving" => round(
                    $estimatedSaving,
                    2
                ),

                "efficiency" => $efficiency,
                "generation_loss_reason" => $generationLossReason,

            ]

        ];

    }
}