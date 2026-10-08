/**
 * ============================================================================
 * AC/DC Comparison Bill API Service
 * ============================================================================
 *
 * This service is completely separate from:
 *
 * - WAPDA Bill Management
 * - Existing Bill OCR
 * - Existing Bill Service
 *
 * It handles:
 *
 * 1. AC/DC OCR upload
 * 2. Saved comparison bills
 * 3. Complete bill details
 * 4. Admin update
 * 5. Home Analysis save
 * 6. Admin delete
 * ============================================================================
 */

import api from "./api";

const comparisonBillService = {

    /*
    |--------------------------------------------------------------------------
    | OCR
    |--------------------------------------------------------------------------
    */

    processOCR: async (billFile) => {

        if (!billFile) {
            throw new Error(
                "Please select an electricity bill."
            );
        }

        const formData = new FormData();

        formData.append(
            "bill_file",
            billFile
        );

        const response = await api.post(
            "/comparison/process-ocr",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

        return response.data;
    },


    /*
    |--------------------------------------------------------------------------
    | Get Bills
    |--------------------------------------------------------------------------
    */

    getBills: async (
        params = {}
    ) => {

        const response = await api.get(
            "/comparison/bills",
            {
                params,
            }
        );

        return response.data;
    },


    /*
    |--------------------------------------------------------------------------
    | Get One Complete Bill
    |--------------------------------------------------------------------------
    |
    | This returns:
    |
    | - main OCR fields
    | - complete ocr_data
    | - home_analysis_data
    | - home_analysis_result
    | - user
    |
    */

    getBill: async (
        id
    ) => {

        const response = await api.get(
            `/comparison/bills/${id}`
        );

        return response.data;
    },


    /*
    |--------------------------------------------------------------------------
    | Update Bill
    |--------------------------------------------------------------------------
    |
    | Admin only.
    |
    */

    updateBill: async (
        id,
        billData
    ) => {

        const response = await api.put(
            `/comparison/bills/${id}`,
            billData
        );

        return response.data;
    },


    /*
    |--------------------------------------------------------------------------
    | Save Home Analysis
    |--------------------------------------------------------------------------
    |
    | The analysis is saved against the SAME bill record.
    |
    */

    saveHomeAnalysis: async (
        id,
        homeData,
        homeResult
    ) => {

        const response = await api.post(

            `/comparison/bills/${id}/home-analysis`,

            {
                home_data:
                    homeData,

                home_result:
                    homeResult,
            }
        );

        return response.data;
    },


    /*
    |--------------------------------------------------------------------------
    | Save Home Analysis - Compatibility
    |--------------------------------------------------------------------------
    |
    | Useful if frontend already has one combined object.
    |
    */

    saveCombinedHomeAnalysis: async (
        id,
        homeAnalysis
    ) => {

        const response = await api.post(

            `/comparison/bills/${id}/home-analysis`,

            {
                home_analysis:
                    homeAnalysis,
            }
        );

        return response.data;
    },


    /*
    |--------------------------------------------------------------------------
    | Delete Bill
    |--------------------------------------------------------------------------
    |
    | Admin only.
    |
    */

    deleteBill: async (
        id
    ) => {

        const response = await api.delete(
            `/comparison/bills/${id}`
        );

        return response.data;
    },


    /*
    |--------------------------------------------------------------------------
    | Refresh
    |--------------------------------------------------------------------------
    */

    refresh: async (
        params = {}
    ) => {

        return comparisonBillService.getBills(
            params
        );
    },

};

export default comparisonBillService;