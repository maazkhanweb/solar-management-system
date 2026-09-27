<?php

namespace App\Services\Analysis;

/**
 * ===========================================================
 * File:
 * app/Services/Analysis/BillAnalysisService.php
 *
 * Description:
 * Calculates WAPDA bill and solar generation analysis.
 * Difference units can now be positive or negative so the
 * frontend can identify surplus and shortage generation.
 * ===========================================================
 */

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
        |------------------------------------------------------------------
        | Difference Units
        |------------------------------------------------------------------
        |
        | Positive:
        | Solar generated more units than consumed.
        |
        | Negative:
        | Solar generated fewer units than consumed.
        */

        $differenceUnits =
            $generatedUnits -
            $unitsConsumed;

        /*
        |------------------------------------------------------------------
        | Unit Rate
        |------------------------------------------------------------------
        */

        $unitRate = 0;

        if ($unitsConsumed > 0) {

            $unitRate =
                $billAmount /
                $unitsConsumed;

        }

        /*
        |------------------------------------------------------------------
        | Solar Coverage
        |------------------------------------------------------------------
        */

        $coverage = 0;

        if ($unitsConsumed > 0) {

            $coverage =
                (
                    $generatedUnits /
                    $unitsConsumed
                ) * 100;

        }

        /*
        |------------------------------------------------------------------
        | WAPDA Dependency
        |------------------------------------------------------------------
        */

        $dependency = max(
            0,
            100 - $coverage
        );

        /*
        |------------------------------------------------------------------
        | Estimated Saving
        |------------------------------------------------------------------
        */

        $estimatedSaving =
            $generatedUnits *
            $unitRate;

        /*
        |------------------------------------------------------------------
        | Efficiency
        |------------------------------------------------------------------
        */

        if ($coverage >= 100) {

            $efficiency = "Excellent";

        } elseif ($coverage >= 90) {

            $efficiency = "Very Good";

        } elseif ($coverage >= 80) {

            $efficiency = "Good";

        } elseif ($coverage >= 60) {

            $efficiency = "Average";

        } else {

            $efficiency = "Poor";

        }

        /*
        |------------------------------------------------------------------
        | Response
        |------------------------------------------------------------------
        */

        return [

            "success" => true,

            "message" =>
                "Bill analyzed successfully.",

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

                "efficiency" =>
                    $efficiency,

                "generation_loss_reason" =>
                    $generationLossReason,

            ],

        ];

    }
}