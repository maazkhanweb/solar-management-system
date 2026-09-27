<?php

namespace App\Services\OCR\Responses;

class SolarReportResponseFormatter
{
    public static function format(string $response): array
    {
        $response = trim($response);

        $response = preg_replace(
            '/^```json/i',
            '',
            $response
        );

        $response = preg_replace(
            '/^```/i',
            '',
            $response
        );

        $response = preg_replace(
            '/```$/',
            '',
            $response
        );

        $response = trim($response);

        $data = json_decode(
            $response,
            true
        );

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

        return [

            "success" => true,

            "data" => [

                "solar_area" => self::cleanString(
                    $data["solar_area"] ?? null
                ),

                "report_month" => self::cleanInteger(
                    $data["report_month"] ?? null
                ),

                "report_year" => self::cleanInteger(
                    $data["report_year"] ?? null
                ),

                "generated_units" => self::cleanNumber(
                    $data["generated_units"] ?? null
                ),

                "generation_loss_reason" => self::cleanString(
                    $data["generation_loss_reason"] ?? null
                ),

            ],

        ];

    }

    protected static function cleanString(
        mixed $value
    ): ?string {

        if ($value === null) {

            return null;

        }

        $value = trim(
            (string) $value
        );

        if ($value === "") {

            return null;

        }

        return $value;

    }

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
}