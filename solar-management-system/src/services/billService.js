import api from "./api";

const billService = {

    /**
     * Get All Bills
     */
    async getBills(filters = {}) {

        const { data } = await api.get("/bills", {

            params: filters,

        });

        return data;

    },

    /**
     * Get Single Bill
     */
    async getBill(id) {

        const { data } = await api.get(`/bills/${id}`);

        return data;

    },

    /**
     * Create Bill
     */
    async createBill(formData) {

        const { data } = await api.post(

            "/bills",

            formData,

            {

                headers: {

                    "Content-Type": "multipart/form-data",

                },

            }

        );

        return data;

    },

    /**
     * Update Bill
     */
    async updateBill(id, formData) {

        formData.append("_method", "PUT");

        const { data } = await api.post(

            `/bills/${id}`,

            formData,

            {

                headers: {

                    "Content-Type": "multipart/form-data",

                },

            }

        );

        return data;

    },

    /**
     * Delete Bill
     */
    async deleteBill(id) {

        const { data } = await api.delete(`/bills/${id}`);

        return data;

    },

};

export default billService;