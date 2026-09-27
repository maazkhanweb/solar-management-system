/**
 * ============================================================================
 * File:
 * src/services/billService.js
 *
 * Description:
 * Handles WAPDA Bill Management API requests.
 * ============================================================================
 */

import api from "./api";


const multipartConfig = {
    headers: {
        "Content-Type": "multipart/form-data",
    },
};


const billService = {

    async getBills(filters = {}) {

        const { data } = await api.get(
            "/bills",
            {
                params: filters,
            }
        );

        return data;

    },


    async getBill(id) {

        const { data } = await api.get(
            `/bills/${id}`
        );

        return data;

    },


    async createBill(formData) {

        const { data } = await api.post(
            "/bills",
            formData,
            multipartConfig
        );

        return data;

    },


    async updateBill(id, formData) {

        if (!formData.has("_method")) {
            formData.append("_method", "PUT");
        }


        const { data } = await api.post(
            `/bills/${id}`,
            formData,
            multipartConfig
        );

        return data;

    },


    async processOCR(file) {

        const formData = new FormData();

        formData.append(
            "bill_image",
            file
        );


        const { data } = await api.post(
            "/bills/process-ocr",
            formData,
            multipartConfig
        );

        return data;

    },


    async processSolarOCR(file) {

        const formData = new FormData();

        formData.append(
            "solar_image",
            file
        );


        const { data } = await api.post(
            "/bills/process-solar-ocr",
            formData,
            multipartConfig
        );

        return data;

    },


    async deleteBill(id) {

        const { data } = await api.delete(
            `/bills/${id}`
        );

        return data;

    },

};


export default billService;