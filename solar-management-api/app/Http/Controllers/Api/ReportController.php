<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Services\ReportExportService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    /**
     * Report Service
     */
    protected ReportService $reportService;

    /**
     * Report Export Service
     */
    protected ReportExportService $reportExportService;

    /**
     * Constructor
     */
    public function __construct(
        ReportService $reportService,
        ReportExportService $reportExportService
    ) {
        $this->reportService = $reportService;
        $this->reportExportService = $reportExportService;
    }

    /**
     * Reports Listing
     */
    public function index(): JsonResponse
    {
        return response()->json([

            "success" => true,

            "message" => "Reports fetched successfully.",

            "data" => $this->reportService->getReports(),

        ]);
    }

    /**
     * Report Preview
     */
    public function preview(string $module): JsonResponse
    {
        return response()->json([

            "success" => true,

            "message" => "Report Preview Loaded.",

            "data" => $this->reportService->getReportPreview($module),

        ]);
    }

    /**
     * Export CSV
     */
    public function exportCsv(string $module): StreamedResponse
    {
        return $this->reportExportService->exportCsv($module);
    }

    /**
     * Export PDF
     */
public function exportPdf(string $module)
{
    return $this->reportExportService->exportPdf($module);
}
}