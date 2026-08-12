import api from "./api";

const billAnalysisService = {

    /**
     * Get Bill Analysis
     */
    async getAnalysis(billId) {

        const response = await api.get(
            `/bills/${billId}/analysis`
        );

        return response.data;

    },

};

export default billAnalysisService;