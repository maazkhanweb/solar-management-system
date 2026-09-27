<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

Route::get('/gemini-test', function () {

    $response = Http::timeout(15)->post(
        "https://generativelanguage.googleapis.com/v1beta/models/"
        . config('gemini.model')
        . ":generateContent?key="
        . config('gemini.api_key'),
        [
            "contents" => [
                [
                    "parts" => [
                        [
                            "text" => "Reply only SUCCESS"
                        ]
                    ]
                ]
            ]
        ]
    );

    return [
        "status" => $response->status(),
        "body" => $response->json(),
    ];
});