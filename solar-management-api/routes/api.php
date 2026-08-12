<?php

use App\Http\Controllers\Api\BillAnalysisController;
use App\Http\Controllers\Api\BillController;
use App\Http\Controllers\Api\BillOCRController;
use App\Http\Controllers\Api\InventoryAssignmentController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\InventoryTransactionController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| OCR (Temporary Public Route)
|--------------------------------------------------------------------------
|
| During OCR development we are keeping this route public.
| Later it will be moved inside auth:sanctum middleware.
|
*/

Route::post(
    '/bills/process-ocr',
    [BillOCRController::class, 'process']
);

/*
|--------------------------------------------------------------------------
| OCR Test Route
|--------------------------------------------------------------------------
*/

Route::post('/ocr-test', function () {

    dd('OCR TEST WORKING');

});

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', [AuthController::class, 'me']);

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', [DashboardController::class, 'index']);

    /*
    |--------------------------------------------------------------------------
    | User Management
    |--------------------------------------------------------------------------
    */

    Route::get('/users/options', [UserController::class, 'options']);

    Route::get('/users', [UserController::class, 'index']);

    Route::get('/users/{user}', [UserController::class, 'show']);

    Route::post('/users', [UserController::class, 'store']);

    Route::put('/users/{user}', [UserController::class, 'update']);

    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | Area Management
    |--------------------------------------------------------------------------
    */

    Route::get('/areas/options', [AreaController::class, 'options']);

    Route::get('/areas', [AreaController::class, 'index']);

    Route::get('/areas/{area}', [AreaController::class, 'show']);

    Route::get(
        '/areas/{area}/assets',
        [AreaController::class, 'assets']
    );

    Route::post('/areas', [AreaController::class, 'store']);

    Route::put('/areas/{area}', [AreaController::class, 'update']);

    Route::put(
        '/areas/{area}/move-to-inventory',
        [AreaController::class, 'moveToInventory']
    );

    Route::delete('/areas/{area}', [AreaController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | Inventory Management
    |--------------------------------------------------------------------------
    */

    Route::get('/inventory', [InventoryController::class, 'index']);

    Route::get('/inventory/{inventory}', [InventoryController::class, 'show']);

    Route::post('/inventory', [InventoryController::class, 'store']);

    Route::put('/inventory/{inventory}', [InventoryController::class, 'update']);

    Route::put(
        '/inventory/{inventory}/return',
        [InventoryController::class, 'returnInventory']
    );

    Route::delete('/inventory/{inventory}', [InventoryController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | Inventory Assignment
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/inventory-assignments',
        [InventoryAssignmentController::class, 'index']
    );

    Route::post(
        '/inventory-assignments',
        [InventoryAssignmentController::class, 'store']
    );

    Route::put(
        '/inventory-assignments/{inventoryAssignment}/return',
        [InventoryAssignmentController::class, 'returnInventory']
    );

    Route::delete(
        '/inventory-assignments/{inventoryAssignment}',
        [InventoryAssignmentController::class, 'destroy']
    );

    /*
    |--------------------------------------------------------------------------
    | Inventory Transactions
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/inventory-transactions',
        [InventoryTransactionController::class, 'index']
    );

    Route::get(
        '/inventory-transactions/{inventoryTransaction}',
        [InventoryTransactionController::class, 'show']
    );

    Route::delete(
    '/inventory-transactions/{inventoryTransaction}',
    [InventoryTransactionController::class, 'destroy']
);

    /*
    |--------------------------------------------------------------------------
    | Bill Management
    |--------------------------------------------------------------------------
    */

    Route::get('/bills', [BillController::class, 'index']);

    Route::get('/bills/{bill}', [BillController::class, 'show']);

    Route::post('/bills', [BillController::class, 'store']);

    Route::put('/bills/{bill}', [BillController::class, 'update']);

    Route::delete('/bills/{bill}', [BillController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | Bill Analysis
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/bills/{bill}/analysis',
        [BillAnalysisController::class, 'analyze']
    );

    /*
    |--------------------------------------------------------------------------
    | Reports
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/reports',
        [ReportController::class, 'index']
    );

    Route::get(
        '/reports/{module}/preview',
        [ReportController::class, 'preview']
    );

    Route::post(
        '/reports/export/csv/{module}',
        [ReportController::class, 'exportCsv']
    );

    Route::post(
        '/reports/export/pdf/{module}',
        [ReportController::class, 'exportPdf']
    );

});