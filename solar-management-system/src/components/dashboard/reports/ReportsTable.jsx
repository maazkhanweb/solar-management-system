/**
 * ============================================================================
 * File:
 * src/components/dashboard/reports/ReportsTable.jsx
 *
 * Description:
 * Reports Table
 * ============================================================================
 */

import {
    FaDownload,
    FaTrash,
} from "react-icons/fa";

import reportService from "../../../services/reportService";

import "./ReportsTable.css";

function ReportsTable({

    reports,

}) {

    /**
     * ==========================================================
     * Download CSV
     * ==========================================================
     */

    const handleCSVDownload = async (module) => {

        try {

            const response =
                await reportService.exportCSV(
                    module.toLowerCase()
                );

            const url =
                window.URL.createObjectURL(
                    new Blob([response.data])
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `${module}_Report.csv`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(error);

            alert(
                "Unable to download CSV."
            );

        }

    };

    /**
     * ==========================================================
     * Download PDF
     * ==========================================================
     */

    const handlePDFDownload = async (module) => {

        try {

            const response =
                await reportService.exportPDF(
                    module.toLowerCase()
                );

            const blob =
                new Blob(
                    [response.data],
                    {
                        type: "application/pdf",
                    }
                );

            const url =
                window.URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `${module}_Report.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            if (
                error.response?.data instanceof Blob
            ) {

                const text =
                    await error.response.data.text();

                console.log(text);

            } else {

                console.error(error);

            }

            alert(
                "Unable to download PDF."
            );

        }

    };

    /**
     * ==========================================================
     * Delete Report
     * ==========================================================
     */

    const handleDelete = async (report) => {

        const confirmDelete =
            window.confirm(

                `Are you sure you want to delete "${report.reportName}" ?`

            );

        if (!confirmDelete) {

            return;

        }

        try {

            await reportService.deleteReport(
                report.id
            );

            window.location.reload();

        } catch (error) {

            console.error(error);

            alert(
                "Unable to delete report."
            );

        }

    };

    return (

        <div className="reports-table-container">

            <table className="reports-table">

                <thead>

                    <tr>

                        <th>#</th>

                        <th>Report Name</th>

                        <th>Module</th>

                        <th>Generated Date</th>

                        <th>Report Type</th>

                        <th>Status</th>

                        <th>Total Records</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        reports.length > 0 ? (

                            reports.map((report) => (

                                <tr key={report.id}>

                                    <td>

                                        {report.id}

                                    </td>

                                    <td>

                                        {report.reportName}

                                    </td>

                                    <td>

                                        {report.module}

                                    </td>

                                    <td>

                                        {report.generatedDate}

                                    </td>

                                    <td>

                                        {report.reportType}

                                    </td>

                                    <td>

                                        <span
                                            className={`status ${report.status.toLowerCase()}`}
                                        >

                                            {report.status}

                                        </span>

                                    </td>

                                    <td>

                                        {report.totalRecords}

                                    </td>

                                    <td>

                                        <div className="table-actions">
                                                                                        <button
                                                className="download-btn"
                                                onClick={() =>
                                                    handleCSVDownload(
                                                        report.module
                                                    )
                                                }
                                                title="Export CSV"
                                            >

                                                Export CSV

                                            </button>

                                            <button
                                                className="pdf-btn"
                                                onClick={() =>
                                                    handlePDFDownload(
                                                        report.module
                                                    )
                                                }
                                                title="Export PDF"
                                            >

                                                Download PDF

                                            </button>

                                            

                                        </div>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="8"
                                    style={{
                                        textAlign: "center",
                                        padding: "30px",
                                        fontWeight: "600",
                                    }}
                                >

                                    No Reports Found.

                                </td>

                            </tr>

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}

export default ReportsTable;