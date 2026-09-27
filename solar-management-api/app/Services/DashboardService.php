<?php

namespace App\Services;

use App\Models\Area;
use App\Models\Bill;
use App\Models\InventoryItem;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DashboardService
{
    /**
     * Report Service
     */
    protected ReportService $reportService;

    /**
     * Constructor
     */
    public function __construct(
        ReportService $reportService
    ) {
        $this->reportService = $reportService;
    }

    /**
     * Get Dashboard Data
     */
    public function getDashboardData(): array
    {
        return [

            'statistics'     => $this->getStatistics(),

            'production'     => $this->getProductionChart(),

            'batteryHealth'  => $this->getBatteryHealthChart(),

            'wapdaTrend'     => $this->getWapdaBillTrend(),

            'aiPerformance'  => $this->getAiPerformance(),

        ];
    }

    /**
     * Dashboard Statistics
     */
    private function getStatistics(): array
    {
        $user = Auth::user();

        /*
        |--------------------------------------------------------------------------
        | Administrator
        |--------------------------------------------------------------------------
        */

        if ($user->role === 'Administrator') {

            return [

                'totalUsers' => User::count(),

                'totalAreas' => Area::count(),

                'totalInventoryItems' => InventoryItem::count(),

                'totalAssignedItems' => InventoryItem::where(
                    'assigned_quantity',
                    '>',
                    0
                )->count(),

                'totalLowStockItems' => InventoryItem::all()
                    ->filter(function ($item) {

                        return $item->available_quantity <= $item->minimum_stock;

                    })
                    ->count(),

                'totalWapdaBills' => Bill::count(),

                'totalReports' => $this->reportService->getReportCount(),

            ];

        }

        /*
        |--------------------------------------------------------------------------
        | Manager
        |--------------------------------------------------------------------------
        */

        return [

            /*
             * Users
             */

            'totalUsers' => User::where(
                'area_id',
                $user->area_id
            )->count(),

            /*
             * Areas
             */

            'totalAreas' => 1,

            /*
             * Inventory
             */

            'totalInventoryItems' => InventoryItem::where(
                'area_id',
                $user->area_id
            )->count(),

            /*
             * Assigned Items
             */

            'totalAssignedItems' => InventoryItem::where(
                'area_id',
                $user->area_id
            )
            ->where(
                'assigned_quantity',
                '>',
                0
            )
            ->count(),

            /*
             * Low Stock
             */

            'totalLowStockItems' => InventoryItem::where(
                'area_id',
                $user->area_id
            )
            ->get()
            ->filter(function ($item) {

                return $item->available_quantity <= $item->minimum_stock;

            })
            ->count(),

            /*
             * Bills uploaded by Manager
             */

            'totalWapdaBills' => Bill::where(
                'created_by',
                $user->id
            )->count(),

            /*
             * Reports
             */

            'totalReports' => $this->reportService->getReportCount(),

        ];
    }
        /**
     * Solar Production Chart
     */
    private function getProductionChart(): array
    {
        $user = Auth::user();

        $query = Bill::query();

        /*
        |--------------------------------------------------------------------------
        | Manager
        |--------------------------------------------------------------------------
        */

        if ($user->role === 'Manager') {

            $query->where(
                'created_by',
                $user->id
            );

        }

        $rows = $query
            ->selectRaw("
                bill_month,
                COALESCE(SUM(generated_units),0) as production
            ")
            ->groupBy('bill_month')
            ->orderBy('bill_month')
            ->get();

        $months = [

            1 => 'Jan',
            2 => 'Feb',
            3 => 'Mar',
            4 => 'Apr',
            5 => 'May',
            6 => 'Jun',
            7 => 'Jul',
            8 => 'Aug',
            9 => 'Sep',
            10 => 'Oct',
            11 => 'Nov',
            12 => 'Dec',

        ];

        $chart = [];

        foreach ($months as $number => $name) {

            $production = optional(
                $rows->firstWhere(
                    'bill_month',
                    $number
                )
            )->production ?? 0;

            $chart[] = [

                'month' => $name,

                'production' => (float) $production,

            ];

        }

        return $chart;
    }

  /**
 * Battery Health Chart
 */
private function getBatteryHealthChart(): array
{
    $user = Auth::user();

    $query = InventoryItem::query()
        ->where('item_type', 'battery');

    /*
    |--------------------------------------------------------------------------
    | Manager
    |--------------------------------------------------------------------------
    */

    if ($user->role === 'Manager') {

        $query->where(
            'area_id',
            $user->area_id
        );

    }

    $batteries = $query
        ->orderBy('item_name')
        ->get();

    $chart = [];

    foreach ($batteries as $battery) {

        $chart[] = [

            'battery' => $battery->item_name,

            'health' => (float) $battery->battery_health,

        ];

    }

    return $chart;
}

    /**
 * WAPDA Bill Trend
 */
private function getWapdaBillTrend(): array
{
    $user = Auth::user();

    $query = Bill::query();

    /*
    |--------------------------------------------------------------------------
    | Manager
    |--------------------------------------------------------------------------
    */

    if ($user->role === 'Manager') {

        $query->where(
            'created_by',
            $user->id
        );

    }

    $rows = $query
        ->selectRaw("
            bill_month,
            COALESCE(SUM(bill_amount),0) as total_bill
        ")
        ->groupBy('bill_month')
        ->orderBy('bill_month')
        ->get();

    $months = [

        1 => 'Jan',
        2 => 'Feb',
        3 => 'Mar',
        4 => 'Apr',
        5 => 'May',
        6 => 'Jun',
        7 => 'Jul',
        8 => 'Aug',
        9 => 'Sep',
        10 => 'Oct',
        11 => 'Nov',
        12 => 'Dec',

    ];

    $chart = [];

    foreach ($months as $number => $name) {

        $bill = optional(

            $rows->firstWhere(
                'bill_month',
                $number
            )

        )->total_bill ?? 0;

        $chart[] = [

            'month' => $name,

            'bill' => (float) $bill,

        ];

    }

    return $chart;
}

    private function getAiPerformance(): array
{
    $user = Auth::user();

    $query = Bill::query();

    /*
    |--------------------------------------------------------------------------
    | Manager
    |--------------------------------------------------------------------------
    */

    if ($user->role === 'Manager') {

        $query->where(
            'created_by',
            $user->id
        );

    }

    $bills = $query->get();

    $excellent = 0;
    $good = 0;
    $average = 0;
    $poor = 0;

    foreach ($bills as $bill) {

        $confidence = (float) $bill->ocr_confidence;

        if ($confidence >= 95) {

            $excellent++;

        } elseif ($confidence >= 85) {

            $good++;

        } elseif ($confidence >= 70) {

            $average++;

        } else {

            $poor++;

        }

    }

    return [

        [
            'name' => 'Excellent',
            'value' => $excellent,
        ],

        [
            'name' => 'Good',
            'value' => $good,
        ],

        [
            'name' => 'Average',
            'value' => $average,
        ],

        [
            'name' => 'Poor',
            'value' => $poor,
        ],

    ];
}
}