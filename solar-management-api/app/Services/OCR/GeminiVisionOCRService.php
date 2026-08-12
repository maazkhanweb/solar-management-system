<?php

namespace App\Services\OCR;

use App\Services\OCR\Prompts\PakistanElectricityBillPrompt;
use App\Services\OCR\Responses\BillResponseFormatter;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Throwable;

class GeminiVisionOCRService
{
    /**
     * Gemini API Key
     */
    protected string $apiKey;

    /**
     * Gemini Model
     */
    protected string $model;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->apiKey = config('gemini.api_key');
        $this->model = config('gemini.model');
    }

    /**
     * Extract Data From Pakistan Electricity Bill
     *
     * @param UploadedFile $image
     * @return array
     */
    public function extract(UploadedFile $image): array
    {
        try {

            /*
            |--------------------------------------------------------------------------
            | Validate Uploaded Image
            |--------------------------------------------------------------------------
            */

            if (!$image->isValid()) {

                return [
                    "success" => false,
                    "message" => "Invalid uploaded image."
                ];

            }

            /*
            |--------------------------------------------------------------------------
            | Validate API Key
            |--------------------------------------------------------------------------
            */

            if (empty($this->apiKey)) {

                return [
                    "success" => false,
                    "message" => "Gemini API Key is missing."
                ];

            }

            /*
            |--------------------------------------------------------------------------
            | Convert Image To Base64
            |--------------------------------------------------------------------------
            */

            $imageData = base64_encode(
                file_get_contents($image->getRealPath())
            );

            $mimeType = $image->getMimeType();

            /*
            |--------------------------------------------------------------------------
            | Generate Prompt
            |--------------------------------------------------------------------------
            */

            $prompt = PakistanElectricityBillPrompt::generate();

            /*
            |--------------------------------------------------------------------------
            | Build Gemini URL
            |--------------------------------------------------------------------------
            */

            $url =
                "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent";

            /*
            |--------------------------------------------------------------------------
            | Send Request To Gemini
            |--------------------------------------------------------------------------
            */

            $response = Http::acceptJson()
                ->withHeaders([
                    "x-goog-api-key" => $this->apiKey,
                ])
                ->timeout(config("gemini.timeout", 120))
                ->post($url, [

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

                        "temperature" => (float) config("gemini.temperature", 0),

                        "topP" => (float) config("gemini.top_p", 0.95),

                        "topK" => (int) config("gemini.top_k", 40),

                        "maxOutputTokens" => (int) config("gemini.max_output_tokens", 2048),

                    ]

                ]);

            if (!$response->successful()) {

                return [

                    "success" => false,

                    "message" => "Gemini Vision API request failed.",

                    "status" => $response->status(),

                    "response" => $response->json(),

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

                    "message" => "Gemini returned empty response.",

                    "response" => $result,

                ];

            }

            return BillResponseFormatter::format($text);

        } catch (Throwable $exception) {

            report($exception);

            return [

                "success" => false,

                "message" => $exception->getMessage(),

                "file" => $exception->getFile(),

                "line" => $exception->getLine(),

            ];

        }

    }
}