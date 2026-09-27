<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * User Service
     */
    protected UserService $userService;

    /**
     * Constructor
     */
    public function __construct(
        UserService $userService
    ) {
        $this->userService = $userService;
    }

    /**
     * Get All Users
     */
    public function index(): JsonResponse
    {
        return response()->json(
            $this->userService->getUsers()
        );
    }

    /**
     * Get Users For Dropdown
     */
    public function options(): JsonResponse
    {
        return response()->json(
            $this->userService->getUserOptions()
        );
    }

    /**
     * Get Single User
     */
    public function show(User $user): JsonResponse
    {
        return response()->json(
            $this->userService->findUserById($user)
        );
    }

    /**
     * Store User
     */
    public function store(
        StoreUserRequest $request
    ): JsonResponse {

        $data = $request->validated();

        if ($request->hasFile('profile_image')) {

            $data['profile_image'] =
                $request->file('profile_image');

        }

        return response()->json(

            $this->userService->createUser($data),

            201

        );
    }

    /**
     * Update User
     */
    public function update(
        UpdateUserRequest $request,
        User $user
    ): JsonResponse {

        $data = $request->validated();

        if ($request->hasFile('profile_image')) {

            $data['profile_image'] =
                $request->file('profile_image');

        }

        return response()->json(

            $this->userService->updateUser(

                $user,

                $data

            )

        );
    }

    /**
     * Delete User
     */
    public function destroy(
        User $user
    ): JsonResponse {

        return response()->json(

            $this->userService->deleteUser($user)

        );
    }
}