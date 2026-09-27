/**
 * ============================================================================
 * File:
 * src/services/billAnalysisService.js
 *
 * Description:
 * Handles Bill Analysis API requests.
 * ============================================================================
 */

import api from "./api";


const billAnalysisService = {

    async getAnalysis(billId) {

        const { data } = await api.get(
            `/bills/${billId}/analysis`
        );

        return data;

    },

};


export default billAnalysisService;