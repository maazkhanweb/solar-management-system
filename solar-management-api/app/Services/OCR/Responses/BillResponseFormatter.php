<?php

namespace App\Services\OCR\Responses;

class BillResponseFormatter
{
    /**
     * Format Gemini Response
     *
     * @param string $response
     * @return array
     */
    public static function format(string $response): array
    {
        /*
        |--------------------------------------------------------------------------
        | Remove Markdown
        |--------------------------------------------------------------------------
        */

        $response = trim($response);

        $response = preg_replace('/^```json/i', '', $response);

        $response = preg_replace('/^```/i', '', $response);

        $response = preg_replace('/```$/', '', $response);

        $response = trim($response);

        /*
        |--------------------------------------------------------------------------
        | Decode JSON
        |--------------------------------------------------------------------------
        */

        $data = json_decode($response, true);

        if (

            json_last_error() !== JSON_ERROR_NONE ||

            !is_array($data)

        ) {

            return [

                "success" => false,

                "message" => "Gemini returned invalid JSON.",

                "raw_response" => $response,

            ];

        }

        /*
        |--------------------------------------------------------------------------
        | AI OCR Confidence
        |--------------------------------------------------------------------------
        */

        $confidence = self::calculateConfidence($data);

        /*
        |--------------------------------------------------------------------------
        | Success Response
        |--------------------------------------------------------------------------
        */

        return [

            "success" => true,

            "data" => [

                "consumer_name" => self::cleanString(
                    $data["consumer_name"] ?? null
                ),

                "reference_number" => self::cleanString(
                    $data["reference_number"] ?? null
                ),

                "bill_month" => self::cleanInteger(
                    $data["bill_month"] ?? null
                ),

                "bill_year" => self::cleanInteger(
                    $data["bill_year"] ?? null
                ),

                "units_consumed" => self::cleanNumber(
                    $data["units_consumed"] ?? null
                ),

                "bill_amount" => self::cleanNumber(
                    $data["bill_amount"] ?? null
                ),

                /*
                |--------------------------------------------------------------------------
                | Area Name
                |--------------------------------------------------------------------------
                */

                "area_name" => self::cleanString(
                    $data["area_name"] ?? null
                ),

                /*
                |--------------------------------------------------------------------------
                | Bill Status
                |--------------------------------------------------------------------------
                */

                "status" => self::cleanStatus(
                    $data["status"] ?? "Unpaid"
                ),

                /*
                |--------------------------------------------------------------------------
                | OCR Information
                |--------------------------------------------------------------------------
                */

                "ocr_status" => true,

                "ocr_confidence" => $confidence,

            ]

        ];

    }
        /**
     * Calculate OCR Confidence
     */
    protected static function calculateConfidence(
        array $data
    ): float {

        $score = 0;

        /*
        |--------------------------------------------------------------------------
        | Consumer Name (15)
        |--------------------------------------------------------------------------
        */

        if (!empty($data["consumer_name"])) {

            $score += 15;

        }

        /*
        |--------------------------------------------------------------------------
        | Reference Number (20)
        |--------------------------------------------------------------------------
        */

        if (!empty($data["reference_number"])) {

            $score += 20;

        }

        /*
        |--------------------------------------------------------------------------
        | Bill Month (10)
        |--------------------------------------------------------------------------
        */

        if (!empty($data["bill_month"])) {

            $score += 10;

        }

        /*
        |--------------------------------------------------------------------------
        | Bill Year (10)
        |--------------------------------------------------------------------------
        */

        if (!empty($data["bill_year"])) {

            $score += 10;

        }

        /*
        |--------------------------------------------------------------------------
        | Units Consumed (20)
        |--------------------------------------------------------------------------
        */

        if (!empty($data["units_consumed"])) {

            $score += 20;

        }

        /*
        |--------------------------------------------------------------------------
        | Bill Amount (20)
        |--------------------------------------------------------------------------
        */

        if (!empty($data["bill_amount"])) {

            $score += 20;

        }

        /*
        |--------------------------------------------------------------------------
        | Area Name (5)
        |--------------------------------------------------------------------------
        */

        if (!empty($data["area_name"])) {

            $score += 5;

        }

        return (float) $score;

    }

    /**
     * Clean String
     */
    protected static function cleanString(
        mixed $value
    ): ?string {

        if ($value === null) {

            return null;

        }

        $value = trim((string) $value);

        if ($value === "") {

            return null;

        }

        return $value;

    }

    /**
     * Clean Integer
     */
    protected static function cleanInteger(
        mixed $value
    ): ?int {

        if (

            $value === null ||

            $value === ""

        ) {

            return null;

        }

        $value = preg_replace(

            '/[^0-9]/',

            '',

            (string) $value

        );

        if ($value === "") {

            return null;

        }

        return (int) $value;

    }

    /**
     * Clean Float Number
     */
    protected static function cleanNumber(
        mixed $value
    ): ?float {

        if (

            $value === null ||

            $value === ""

        ) {

            return null;

        }

        $value = str_replace(

            ',',

            '',

            (string) $value

        );

        $value = preg_replace(

            '/[^0-9.]/',

            '',

            $value

        );

        if (

            $value === "" ||

            !is_numeric($value)

        ) {

            return null;

        }

        return (float) $value;

    }

    /**
     * Normalize Status
     */
    protected static function cleanStatus(
        mixed $value
    ): string {

        $value = strtolower(
            trim((string) $value)
        );

        return match ($value) {

            "paid" => "Paid",

            default => "Unpaid",

        };

    }

}