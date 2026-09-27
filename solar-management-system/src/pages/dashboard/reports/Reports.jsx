import { useCallback, useEffect, useState } from "react";

import "./Reports.css";

import ReportCards from "../../../components/dashboard/reports/ReportCards";
import ReportFilters from "../../../components/dashboard/reports/ReportFilters";
import ReportsTable from "../../../components/dashboard/reports/ReportsTable";

import reportService from "../../../services/reportService";

function Reports() {

    const [loading, setLoading] = useState(true);

    const [summary, setSummary] = useState({

        totalReports: 0,

        dailyReports: 0,

        monthlyReports: 0,

        yearlyReports: 0,

    });

    const [reports, setReports] = useState([]);

    const [filteredReports, setFilteredReports] = useState([]);

    /**
     * ==========================================
     * Load Reports
     * ==========================================
     */

    const loadReports = useCallback(async () => {

        try {

            const response =
                await reportService.getReports();

            const data = response.data.data;

            setSummary(data.summary);

            setReports(data.reports);

            setFilteredReports(data.reports);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadReports();

    }, [loadReports]);

    /**
     * ==========================================
     * Search Reports
     * ==========================================
     */

    const handleSearch = (searchValue) => {

        if (!searchValue.trim()) {

            setFilteredReports(reports);

            return;

        }

        const keyword = searchValue.toLowerCase();

        const filtered = reports.filter((report) => {

            return (

                report.reportName
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                report.module
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                report.reportType
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                report.status
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                report.generatedDate
                    ?.toLowerCase()
                    .includes(keyword)

            );

        });

        setFilteredReports(filtered);

    };

    /**
     * ==========================================
     * Export CSV
     * ==========================================
     */

    const handleExportCSV = (report) => {

        console.log(
            "Export CSV",
            report
        );

        // Backend API will be connected here

    };

    /**
     * ==========================================
     * Export PDF
     * ==========================================
     */

    const handleExportPDF = (report) => {

        console.log(
            "Export PDF",
            report
        );

        // Backend API will be connected here

    };

    /**
     * ==========================================
     * Delete Report
     * ==========================================
     */

    const handleDelete = (report) => {

        console.log(
            "Delete Report",
            report
        );

        // Backend API will be connected here

    };

    return (

        <section className="reports-page">

            {/* ==========================================
                Header
            ========================================== */}

            <div className="reports-header">

                <div>

                    <h1>

                        Reports

                    </h1>

                    <p>

                        View and manage all generated reports of the Solar Management System.

                    </p>

                </div>

            </div>

            {
                loading ? (

                    <div
                        style={{
                            padding: "60px",
                            textAlign: "center",
                            fontSize: "18px",
                            fontWeight: "600",
                        }}
                    >

                        Loading Reports...

                    </div>

                ) : (

                    <>
                                            {/* ==========================================
                            Summary Cards
                        ========================================== */}

                        <ReportCards
                            summary={summary}
                        />

                        {/* ==========================================
                            Search
                        ========================================== */}

                        <ReportFilters
                            onSearch={handleSearch}
                        />

                        {/* ==========================================
                            Reports Table
                        ========================================== */}

                        <ReportsTable
                            reports={filteredReports}
                            onExportCSV={handleExportCSV}
                            onExportPDF={handleExportPDF}
                            onDelete={handleDelete}
                        />

                    </>

                )

            }

        </section>

    );

}

export default Reports;