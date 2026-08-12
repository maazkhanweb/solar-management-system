<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected AuthService $authService;

    /**
     * Constructor
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Login User
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $response = $this->authService->login($request->validated());

        if (!$response['success']) {
            return response()->json($response, 401);
        }

        return response()->json($response, 200);
    }

    /**
     * Logout User
     */
    public function logout(Request $request): JsonResponse
    {
        $response = $this->authService->logout($request->user());

        return response()->json($response, 200);
    }

    /**
     * Logged In User
     */
    public function me(Request $request): JsonResponse
{
    $user = $request->user()->load('area');

    return response()->json([

        'success' => true,

        'user' => [

            'id' => $user->id,

            'name' => $user->name,

            'email' => $user->email,

            'phone' => $user->phone,

            'role' => $user->role,

            'status' => $user->status,

            'last_login' => $user->last_login,

            'area_id' => $user->area_id,

            'area' => $user->area
                ? [
                    'id' => $user->area->id,
                    'area_name' => $user->area->area_name,
                ]
                : null,

        ],

    ]);
}
}