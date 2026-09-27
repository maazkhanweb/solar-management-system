/**
 * ============================================================================
 * File:
 * src/components/dashboard/reports/ReportsTable.jsx
 *
 * Description:
 * Reports Table
 * ============================================================================
 */

import reportService from "../../../services/reportService";

import "./ReportsTable.css";

function ReportsTable({
    reports = [],
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

            const blob = new Blob(
                [response.data],
                {
                    type:
                        response.headers?.["content-type"] ||
                        "text/csv",
                }
            );

            const url =
                window.URL.createObjectURL(blob);

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

            console.error(
                "CSV DOWNLOAD ERROR:",
                error
            );

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

            const blob = new Blob(
                [response.data],
                {
                    type:
                        response.headers?.["content-type"] ||
                        "application/pdf",
                }
            );

            const url =
                window.URL.createObjectURL(blob);

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

            console.error(
                "PDF DOWNLOAD ERROR:",
                error
            );

            /*
             * If Laravel returns an error as Blob,
             * try to read the actual backend message.
             */

            if (
                error.response?.data instanceof Blob
            ) {

                try {

                    const text =
                        await error.response.data.text();

                    console.error(
                        "BACKEND ERROR:",
                        text
                    );

                } catch (blobError) {

                    console.error(
                        "Unable to read backend error:",
                        blobError
                    );

                }

            }

            alert(
                "Unable to download PDF."
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

                    {reports.length > 0 ? (

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

                    )}

                </tbody>

            </table>

        </div>

    );

}

export default ReportsTable;