<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OCR\GeminiVisionOCRService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class BillOCRController extends Controller
{
    /**
     * Gemini Vision OCR Service
     */
    protected GeminiVisionOCRService $ocrService;

    /**
     * Constructor
     */
    public function __construct(
        GeminiVisionOCRService $ocrService
    ) {
        $this->ocrService = $ocrService;
    }

    /**
     * Process WAPDA / PESCO Bill OCR
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function process(Request $request): JsonResponse
    {
        $request->validate([

            'bill_image' => [

                'required',

                'image',

                'mimes:jpg,jpeg,png,webp',

                'max:10240',

            ],

        ]);

        try {

            $result = $this->ocrService->extract(

                $request->file('bill_image')

            );

            if (!$result['success']) {

                return response()->json([

                    'success' => false,

                    'message' => $result['message'],

                    'errors' => $result['response'] ?? null,

                ], 400);

            }

            return response()->json([

                'success' => true,

                'message' => 'Bill OCR completed successfully.',

                'data' => $result['data'],

            ], 200);

        } catch (Throwable $exception) {

            report($exception);

            return response()->json([

                'success' => false,

                'message' => 'Internal Server Error',

                'error' => app()->hasDebugModeEnabled()
                    ? $exception->getMessage()
                    : 'Unexpected error occurred.',

            ], 500);

        }
    }
}