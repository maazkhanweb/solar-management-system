<?php

namespace App\Services\OCR;

use App\Services\OCR\Prompts\PakistanElectricityBillPrompt;
use App\Services\OCR\Prompts\SolarMonthlyReportPrompt;
use App\Services\OCR\Responses\BillResponseFormatter;
use App\Services\OCR\Responses\SolarReportResponseFormatter;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Throwable;

class GeminiVisionOCRService
{
    protected string $apiKey;

    protected string $model;

    public function __construct()
    {
        $this->apiKey = config('gemini.api_key');

        $this->model = config('gemini.model');
    }

    public function extract(
        UploadedFile $image
    ): array {

        return $this->processImage(

            $image,

            PakistanElectricityBillPrompt::generate(),

            "wapda"

        );

    }

    public function extractSolar(
        UploadedFile $image
    ): array {

        return $this->processImage(

            $image,

            SolarMonthlyReportPrompt::generate(),

            "solar"

        );

    }

    protected function processImage(
        UploadedFile $image,
        string $prompt,
        string $documentType
    ): array {

        try {

            if (!$image->isValid()) {

                return [

                    "success" => false,

                    "message" => "Invalid uploaded image."

                ];

            }

            if (empty($this->apiKey)) {

                return [

                    "success" => false,

                    "message" => "Gemini API Key is missing."

                ];

            }

            $imageData = base64_encode(

                file_get_contents(
                    $image->getRealPath()
                )

            );

            $mimeType = $image->getMimeType();

            $url =
                "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent";

            $response = Http::acceptJson()

                ->withHeaders([

                    "x-goog-api-key" => $this->apiKey,

                ])

                ->timeout(

                    config(
                        "gemini.timeout",
                        120
                    )

                )

                ->post(

                    $url,

                    [

                        "contents" => [

                            [

                                "parts" => [

                                    [

                                        "text" => $prompt

                                    ],

                                    [

                                        "inline_data" => [

                                            "mime_type" => $mimeType,

                                            "data" => $imageData

                                        ]

                                    ]

                                ]

                            ]

                        ],

                        "generationConfig" => [

                            "temperature" => (float) config(
                                "gemini.temperature",
                                0
                            ),

                            "topP" => (float) config(
                                "gemini.top_p",
                                0.95
                            ),

                            "topK" => (int) config(
                                "gemini.top_k",
                                40
                            ),

                            "maxOutputTokens" => (int) config(
                                "gemini.max_output_tokens",
                                2048
                            ),

                        ]

                    ]

                );

            if (!$response->successful()) {

                return [

                    "success" => false,

                    "message" =>
                        "Gemini Vision API request failed.",

                    "status" =>
                        $response->status(),

                    "response" =>
                        $response->json(),

                ];

            }

            $result = $response->json();

            $text = data_get(

                $result,

                "candidates.0.content.parts.0.text"

            );

            if (!$text) {

                return [

                    "success" => false,

                    "message" =>
                        "Gemini returned empty response.",

                    "response" => $result,

                ];

            }

            if ($documentType === "solar") {

                return SolarReportResponseFormatter::format(
                    $text
                );

            }

            return BillResponseFormatter::format(
                $text
            );

        } catch (Throwable $exception) {

            report($exception);

            return [

                "success" => false,

                "message" =>
                    $exception->getMessage(),

                "file" =>
                    $exception->getFile(),

                "line" =>
                    $exception->getLine(),

            ];

        }

    }
}