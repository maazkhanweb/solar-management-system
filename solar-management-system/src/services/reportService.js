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

        return api.post(

            `${REPORT_ENDPOINT}/export/csv/${module}`,

            {},

            {
                responseType: "blob",
            }

        );

    },

    /**
     * Export PDF
     */
    exportPDF(module) {

        return api.post(

            `${REPORT_ENDPOINT}/export/pdf/${module}`,

            {},

            {
                responseType: "blob",
            }

        );

    },

};

export default reportService;