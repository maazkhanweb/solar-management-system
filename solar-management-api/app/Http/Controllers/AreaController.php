<?php

namespace App\Http\Controllers;

use App\Http\Requests\Area\StoreAreaRequest;
use App\Http\Requests\Area\UpdateAreaRequest;
use App\Models\Area;
use App\Services\AreaService;
use Illuminate\Http\JsonResponse;

class AreaController extends Controller
{
    protected AreaService $areaService;

    /**
     * Constructor
     */
    public function __construct(AreaService $areaService)
    {
        $this->areaService = $areaService;
    }

    /**
     * Get All Areas
     */
    public function index(): JsonResponse
    {
        return response()->json(
            $this->areaService->getAreas()
        );
    }

    /**
     * Get Areas For Dropdown
     */
    public function options(): JsonResponse
    {
        return response()->json(
            $this->areaService->getAreaOptions()
        );
    }

    /**
     * Get Single Area
     */
    public function show(Area $area): JsonResponse
    {
        return response()->json(
            $this->areaService->findAreaById($area)
        );
    }

    /**
     * Get Area Assets
     */
    public function assets(
        Area $area
    ): JsonResponse {

        return response()->json(
            $this->areaService->getAreaAssets($area)
        );

    }

    /**
     * Store Area
     */
    public function store(
        StoreAreaRequest $request
    ): JsonResponse {

        return response()->json(
            $this->areaService->createArea(
                $request->validated()
            ),
            201
        );
    }

    /**
     * Update Area
     */
    public function update(
        UpdateAreaRequest $request,
        Area $area
    ): JsonResponse {

        return response()->json(
            $this->areaService->updateArea(
                $area,
                $request->validated()
            )
        );
    }

    /**
     * Move All Inventory Back To Warehouse
     */
    public function moveToInventory(
        Area $area
    ): JsonResponse {

        return response()->json(
            $this->areaService->moveToInventory($area)
        );

    }

    /**
     * Delete Area
     */
    public function destroy(
        Area $area
    ): JsonResponse {

        return response()->json(
            $this->areaService->deleteArea($area)
        );
    }
}