/**
 * ============================================================================
 * File: src/services/ocrService.js
 * Description:
 * OCR Service for uploading WAPDA/PESCO bill images and retrieving parsed data.
 * ============================================================================
 */

import api from "./api";

const OCR_ENDPOINT = "/bills/process-ocr";

const ocrService = {

    /**
     * Upload Bill Image
     *
     * @param {File} imageFile
     * @returns {Promise}
     */
    async processBill(imageFile) {

        const formData = new FormData();

        formData.append(
            "bill_image",
            imageFile
        );

        try {

            const response = await api.post(

                OCR_ENDPOINT,

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data",

                    },

                }

            );

            console.log("========== OCR SUCCESS ==========");
            console.log(response.data);
            console.log("=================================");

            return response;

        } catch (error) {

            console.log("========== OCR ERROR ==========");
            console.log("Status:", error.response?.status);
            console.log("Data:", error.response?.data);
            console.log("Message:", error.message);
            console.log(error);
            console.log("===============================");

            throw error;

        }

    }

};

export default ocrService;