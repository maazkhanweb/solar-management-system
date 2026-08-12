import api from "./api";

const inventoryService = {

    /**
     * Get All Inventory
     */
    async getInventory() {

        const response = await api.get("/inventory");

        return response.data;

    },

    /**
     * Get Single Inventory
     */
    async getInventoryById(id) {

        const response = await api.get(`/inventory/${id}`);

        return response.data;

    },

    /**
     * Create Inventory
     */
    async createInventory(data) {

        const response = await api.post("/inventory", data);

        return response.data;

    },

    /**
     * Update Inventory
     */
    async updateInventory(id, data) {

        const response = await api.put(`/inventory/${id}`, data);

        return response.data;

    },

    /**
     * Delete Inventory
     */
    async deleteInventory(id) {

        const response = await api.delete(`/inventory/${id}`);

        return response.data;

    },

    /**
     * Assign Inventory
     */
    async assignInventory(data) {

        const response = await api.post(
            "/inventory-assignments",
            data
        );

        return response.data;

    },

    /**
     * Get Assignments
     */
    async getAssignments() {

        const response = await api.get(
            "/inventory-assignments"
        );

        return response.data.assignments;

    },

    /**
 * Return Inventory
 */
async returnInventory(id) {

    const response = await api.put(
        `/inventory/${id}/return`
    );

    return response.data;

},

    /**
     * Delete Assignment
     */
    async deleteAssignment(id) {

        const response = await api.delete(
            `/inventory-assignments/${id}`
        );

        return response.data;

    },

};

export default inventoryService;