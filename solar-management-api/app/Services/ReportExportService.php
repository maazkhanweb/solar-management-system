<?php

namespace App\Services;

use App\Models\Area;
use App\Models\Bill;
use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportExportService
{
    /**
     * Export CSV
     */
    public function exportCsv(string $module): StreamedResponse
    {
        $module = strtolower($module);

        switch ($module) {

            case "users":

                $fileName = "Users_Report.csv";

                $headers = [
                    "ID",
                    "Name",
                    "Email",
                    "Role",
                    "Status",
                    "Created At",
                ];

                $rows = $this->getUsersData();

                break;

            case "areas":

                $fileName = "Areas_Report.csv";

                $headers = [
                    "ID",
                    "Area Name",
                    "Location",
                    "Manager",
                    "Phone",
                    "Status",
                    "Created At",
                ];

                $rows = $this->getAreasData();

                break;

            case "inventory":

                $fileName = "Inventory_Report.csv";

                $headers = [
                    "ID",
                    "Item",
                    "Item Type",
                    "Quantity",
                    "Available",
                    "Minimum Stock",
                    "Status",
                    "Created At",
                ];

                $rows = $this->getInventoryData();

                break;

            case "transactions":

                $fileName = "Inventory_Transactions_Report.csv";

                $headers = [
                    "ID",
                    "Inventory Item",
                    "Transaction Type",
                    "Quantity",
                    "From Area",
                    "To Area",
                    "Performed By",
                    "Created At",
                ];

                $rows = $this->getInventoryTransactionData();

                break;

            case "bills":

                $fileName = "Bills_Report.csv";

                $headers = [
                    "ID",
                    "Consumer",
                    "Reference No",
                    "Month",
                    "Year",
                    "Units",
                    "Bill Amount",
                    "Status",
                    "Created At",
                ];

                $rows = $this->getBillsData();

                break;

            default:

                abort(404, "Invalid Report Module.");

        }

        return response()->streamDownload(

            function () use ($headers, $rows, $module) {

                $handle = fopen("php://output", "w");

                fputcsv($handle, $headers);

                foreach ($rows as $row) {

                    switch ($module) {

                        case "transactions":

                            fputcsv($handle, [

                                $row->id,

                                $row->inventoryItem?->item_name,

                                $row->transaction_type,

                                $row->quantity,

                                $row->fromArea?->area_name ?? "Warehouse",

                                $row->toArea?->area_name ?? "-",

                                $row->user?->name ?? "-",

                                $row->created_at,

                            ]);

                            break;

                        default:

                            fputcsv(
                                $handle,
                                array_values(
                                    $row->toArray()
                                )
                            );

                    }

                }

                fclose($handle);

            },

            $fileName,

            [

                "Content-Type" => "text/csv",

            ]

        );

    }

    /**
     * Export PDF
     */
    public function exportPdf(string $module)
    {
        $module = strtolower($module);

        $title = $this->getModuleTitle($module);

        $rows = $this->getModuleData($module);

        $view = $this->getModuleView($module);

        $html = view($view, [

            "title" => $title,

            "module" => ucfirst($module),

            "rows" => $rows,

            "generatedAt" => now(),

            "user" => Auth::user(),

        ])->render();

        $pdf = Pdf::loadHTML($html);

        $fileName = str_replace(
            " ",
            "_",
            $title
        ) . ".pdf";

        return response(

            $pdf->output(),

            200,

            [

                "Content-Type" => "application/pdf",

                "Content-Disposition" =>
                    "attachment; filename=\"{$fileName}\"",

                "Cache-Control" =>
                    "no-cache, no-store, must-revalidate",

                "Pragma" => "no-cache",

                "Expires" => "0",

            ]

        );

    }
        /**
     * Users Data
     */
    public function getUsersData()
    {
        $user = Auth::user();

        if ($user->role === "Administrator") {

            return User::select(
                "id",
                "name",
                "email",
                "role",
                "status",
                "created_at"
            )
            ->orderBy("id")
            ->get();

        }

        return User::select(
            "id",
            "name",
            "email",
            "role",
            "status",
            "created_at"
        )
        ->where("id", $user->id)
        ->get();
    }

    /**
     * Areas Data
     */
    public function getAreasData()
    {
        $user = Auth::user();

        if ($user->role === "Administrator") {

            return Area::select(
                "id",
                "area_name",
                "location",
                "manager",
                "phone",
                "status",
                "created_at"
            )
            ->orderBy("id")
            ->get();

        }

        return Area::select(
            "id",
            "area_name",
            "location",
            "manager",
            "phone",
            "status",
            "created_at"
        )
        ->where("id", $user->area_id)
        ->get();
    }

    /**
     * Inventory Data
     */
    public function getInventoryData()
    {
        $user = Auth::user();

        $query = InventoryItem::select(
            "id",
            "item_name",
            "item_type",
            "quantity",
            "available_quantity",
            "minimum_stock",
            "status",
            "created_at",
            "area_id"
        );

        if ($user->role === "Manager") {

            $query->where(
                "area_id",
                $user->area_id
            );

        }

        return $query
            ->orderBy("id")
            ->get();
    }

    /**
     * Inventory Transactions Data
     */
    public function getInventoryTransactionData()
    {
        $user = Auth::user();

        $query = InventoryTransaction::with([
            "inventoryItem",
            "fromArea",
            "toArea",
            "user",
        ]);

        if ($user->role === "Manager") {

            $query->where(function ($q) use ($user) {

                $q->where(
                    "from_area_id",
                    $user->area_id
                )
                ->orWhere(
                    "to_area_id",
                    $user->area_id
                );

            });

        }

        return $query
            ->latest()
            ->get();
    }

    /**
     * Bills Data
     */
    public function getBillsData()
    {
        $user = Auth::user();

        $query = Bill::select(
            "id",
            "consumer_name",
            "reference_number",
            "bill_month",
            "bill_year",
            "units_consumed",
            "bill_amount",
            "status",
            "created_at",
            "created_by"
        );

        if ($user->role === "Manager") {

            $query->where(
                "created_by",
                $user->id
            );

        }

        return $query
            ->orderByDesc("id")
            ->get();
    }

    /**
     * Get Report Data By Module
     */
    public function getModuleData(string $module)
    {
        $module = strtolower($module);

        return match ($module) {

            "users" => $this->getUsersData(),

            "areas" => $this->getAreasData(),

            "inventory" => $this->getInventoryData(),

            "transactions" => $this->getInventoryTransactionData(),

            "bills" => $this->getBillsData(),

            default => collect(),

        };
    }

    /**
     * Get Report Title
     */
    public function getModuleTitle(string $module): string
    {
        return match (strtolower($module)) {

            "users" => "Users Report",

            "areas" => "Areas Report",

            "inventory" => "Inventory Report",

            "transactions" => "Inventory Transactions Report",

            "bills" => "WAPDA Bills Report",

            default => "Report",

        };
    }

    /**
     * Get Blade View
     */
    public function getModuleView(string $module): string
    {
        return match (strtolower($module)) {

            "users" => "reports.users",

            "areas" => "reports.areas",

            "inventory" => "reports.inventory",

            "transactions" => "reports.transactions",

            "bills" => "reports.bills",

            default => abort(
                404,
                "Invalid Report Module."
            ),

        };
    }
}