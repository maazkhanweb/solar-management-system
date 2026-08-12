import api from "./api";

const inventoryTransactionService = {

    /**
     * Get All Transactions
     */
    getAllTransactions(params = {}) {

        return api.get("/inventory-transactions", {
            params,
        });

    },

    /**
     * Get Single Transaction
     */
    getTransaction(id) {

        return api.get(`/inventory-transactions/${id}`);

    },

    /**
     * Search Transactions
     */
    searchTransactions(search) {

        return api.get("/inventory-transactions", {

            params: {
                search,
            },

        });

    },

    /**
     * Filter Transactions
     */
    filterTransactions(filters = {}) {

        return api.get("/inventory-transactions", {

            params: filters,

        });

    },

    /**
     * Get Transactions by Type
     */
    getTransactionsByType(transactionType) {

        return api.get("/inventory-transactions", {

            params: {
                transaction_type: transactionType,
            },

        });

    },

    /**
     * Get Transactions by Area
     */
    getTransactionsByArea(areaId) {

        return api.get("/inventory-transactions", {

            params: {
                area_id: areaId,
            },

        });

    },

    /**
     * Get Transactions by User
     */
    getTransactionsByUser(userId) {

        return api.get("/inventory-transactions", {

            params: {
                user_id: userId,
            },

        });

    },

    /**
     * Get Transactions by Date
     */
    getTransactionsByDate(date) {

        return api.get("/inventory-transactions", {

            params: {
                date,
            },

        });

    },

    /**
     * Get Paginated Transactions
     */
    getPaginatedTransactions(page = 1, perPage = 10) {

        return api.get("/inventory-transactions", {

            params: {

                page,

                per_page: perPage,

            },

        });

    },


    /**
 * Delete Transaction
 */
deleteTransaction(id) {

    return api.delete(

        `/inventory-transactions/${id}`

    );

},

};

export default inventoryTransactionService;