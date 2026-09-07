/**
 * ============================================================================
 * File:
 * src/services/ocrService.js
 *
 * Description:
 * Handles OCR requests for WAPDA Bills and Solar Reports.
 * ============================================================================
 */

import api from "./api";


const multipartConfig = {
    headers: {
        "Content-Type": "multipart/form-data",
    },
};


const ocrService = {

    async processBill(imageFile) {

        const formData = new FormData();

        formData.append(
            "bill_image",
            imageFile
        );


        const { data } = await api.post(
            "/bills/process-ocr",
            formData,
            multipartConfig
        );

        return data;

    },


    async processSolar(imageFile) {

        const formData = new FormData();

        formData.append(
            "solar_image",
            imageFile
        );


        const { data } = await api.post(
            "/bills/process-solar-ocr",
            formData,
            multipartConfig
        );

        return data;

    },

};


export default ocrService;