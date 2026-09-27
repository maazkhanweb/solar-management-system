<?php

namespace App\Services;

use App\Models\User;
use App\Models\Area;
use App\Models\Bill;
use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use Illuminate\Support\Facades\Auth;

class ReportService
{
    /**
     * Available Report Modules
     */
    private array $modules = [

        [
            "id" => 1,
            "reportName" => "Users Report",
            "module" => "Users",
            "model" => User::class,
        ],

        [
            "id" => 2,
            "reportName" => "Areas Report",
            "module" => "Areas",
            "model" => Area::class,
        ],

        [
            "id" => 3,
            "reportName" => "Inventory Report",
            "module" => "Inventory",
            "model" => InventoryItem::class,
        ],

        [
            "id" => 4,
            "reportName" => "Inventory Transactions Report",
            "module" => "Transactions",
            "model" => InventoryTransaction::class,
        ],

        [
            "id" => 5,
            "reportName" => "WAPDA Bills Report",
            "module" => "Bills",
            "model" => Bill::class,
        ],

    ];

    /**
     * Reports Listing
     */
    public function getReports(array $filters = []): array
    {
        $user = Auth::user();

        $reports = [];

        foreach ($this->modules as $report) {

            $totalRecords = 0;

            switch ($report["module"]) {

                case "Users":

                    $totalRecords =

                        $user->role === "Administrator"

                        ? User::count()

                        : 1;

                    break;

                case "Areas":

                    $totalRecords =

                        $user->role === "Administrator"

                        ? Area::count()

                        : Area::where(
                            "id",
                            $user->area_id
                        )->count();

                    break;

                case "Inventory":

                    $totalRecords =

                        $user->role === "Administrator"

                        ? InventoryItem::count()

                        : InventoryItem::where(
                            "area_id",
                            $user->area_id
                        )->count();

                    break;

                case "Transactions":

                    $totalRecords =

                        $user->role === "Administrator"

                        ? InventoryTransaction::count()

                        : InventoryTransaction::where(
                            "to_area_id",
                            $user->area_id
                        )->count();

                    break;

                case "Bills":

                    $totalRecords =

                        $user->role === "Administrator"

                        ? Bill::count()

                        : Bill::where(
                            "created_by",
                            $user->id
                        )->count();

                    break;

            }

            $reports[] = [

                "id" => $report["id"],

                "reportName" => $report["reportName"],

                "module" => $report["module"],

                "generatedDate" => now()->format("d M Y"),

                "reportType" => "CSV / PDF",

                "status" => "Ready",

                "totalRecords" => $totalRecords,

            ];

        }

        return [

            "summary" => $this->getSummary($reports),

            "reports" => $reports,

        ];

    }
        /**
     * Report Preview
     */
    public function getReportPreview(string $module): array
    {
        $module = strtolower($module);

        $user = Auth::user();

        switch ($module) {

            case "users":

                $records =

                    $user->role === "Administrator"

                    ? User::latest()->take(10)->get()

                    : User::where(
                        "id",
                        $user->id
                    )->get();

                break;

            case "areas":

                $records =

                    $user->role === "Administrator"

                    ? Area::latest()->take(10)->get()

                    : Area::where(
                        "id",
                        $user->area_id
                    )->get();

                break;

            case "inventory":

                $records =

                    $user->role === "Administrator"

                    ? InventoryItem::latest()->take(10)->get()

                    : InventoryItem::where(
                        "area_id",
                        $user->area_id
                    )
                    ->latest()
                    ->take(10)
                    ->get();

                break;

            case "transactions":

                $records =

                    $user->role === "Administrator"

                    ? InventoryTransaction::latest()->take(10)->get()

                    : InventoryTransaction::where(
                        "to_area_id",
                        $user->area_id
                    )
                    ->latest()
                    ->take(10)
                    ->get();

                break;

            case "bills":

                $records =

                    $user->role === "Administrator"

                    ? Bill::latest()->take(10)->get()

                    : Bill::where(
                        "created_by",
                        $user->id
                    )
                    ->latest()
                    ->take(10)
                    ->get();

                break;

            default:

                abort(404, "Invalid Report Module.");

        }

        return [

            "module" => ucfirst($module),

            "totalRecords" => $records->count(),

            "preview" => $records,

        ];

    }

    /**
     * Summary Cards
     */
    private function getSummary(array $reports): array
    {
        $totalReports = count($reports);

        return [

            "totalReports" => $totalReports,

            "dailyReports" => $totalReports,

            "monthlyReports" => $totalReports,

            "yearlyReports" => $totalReports,

        ];

    }

    /**
     * Dashboard Report Count
     */
    public function getReportCount(): int
    {
        return count($this->modules);
    }
}