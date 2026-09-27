/**
 * ============================================================================
 * File: src/services/reportService.js
 * Description:
 * Report Management API Service
 * ============================================================================
 */

import api from "./api";

const REPORT_ENDPOINT = "/reports";

const reportService = {

    /**
     * Get Reports
     */
    getReports(params = {}) {

        return api.get(
            REPORT_ENDPOINT,
            {
                params,
            }
        );

    },

    /**
     * Export CSV
     */
    exportCSV(module) {

        return api.get(

            `${REPORT_ENDPOINT}/export/csv/${module}`,

            {
                responseType: "blob",

                headers: {
                    Accept: "text/csv",
                },
            }

        );

    },

    /**
     * Export PDF
     */
    exportPDF(module) {

        return api.get(

            `${REPORT_ENDPOINT}/export/pdf/${module}`,

            {
                responseType: "blob",

                headers: {
                    Accept: "application/pdf",
                },
            }

        );

    },

};

export default reportService;