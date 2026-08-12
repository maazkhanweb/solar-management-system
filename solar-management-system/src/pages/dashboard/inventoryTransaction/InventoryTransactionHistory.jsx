import { useEffect, useState } from "react";

import "./InventoryTransactionHistory.css";

import TransactionFilters from "../../../components/dashboard/inventoryTransaction/TransactionFilters";
import TransactionTable from "../../../components/dashboard/inventoryTransaction/TransactionTable";
import TransactionDetailsModal from "../../../components/dashboard/inventoryTransaction/TransactionDetailsModal";
import DeleteTransactionModal from "../../../components/dashboard/inventoryTransaction/DeleteTransactionModal";
import inventoryTransactionService from "../../../services/inventoryTransactionService";
import authService from "../../../services/authService";

const InventoryTransactionHistory = () => {

    /**
     * States
     */

    const [transactions, setTransactions] = useState([]);

    /**
     * Initial Page Loading
     */
    const [loading, setLoading] = useState(true);

    /**
     * Table Loading (Search / Filters / Refresh)
     */
    const [tableLoading, setTableLoading] = useState(false);

    const [error, setError] = useState("");

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [viewTransaction, setViewTransaction] = useState(null);

const [deleteTransaction, setDeleteTransaction] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

const [deleteLoading, setDeleteLoading] = useState(false);

    /**
     * Search
     */

    const [search, setSearch] = useState("");

    /**
     * Filters
     */

    const [filters, setFilters] = useState({

        action: "",

        area: "",

        user: "",

        date: "",

    });

    /**
     * Dropdown Data
     */

    const [areas, setAreas] = useState([]);

    const [users, setUsers] = useState([]);

    /**
     * Pagination
     */

    const [currentPage, setCurrentPage] = useState(1);

    const [perPage] = useState(10);

    const [pagination, setPagination] = useState({

        current_page: 1,

        last_page: 1,

        total: 0,

        per_page: 10,

    });

    /**
     * Load Areas & Users
     */

    const fetchFilterData = async () => {

        try {

            const [areasResponse, usersResponse] = await Promise.all([

                authService.getAreaOptions(),

                authService.getUserOptions(),

            ]);

            if (areasResponse.success) {

                setAreas(areasResponse.areas);

            }

            if (usersResponse.success) {

                setUsers(usersResponse.users);

            }

        } catch (error) {

            console.error("Filter Data Error:", error);

        }

    };

    /**
     * Fetch Transactions
     */

    const fetchTransactions = async (initialLoad = false) => {

        try {

            /**
             * Initial page loading
             */
            if (initialLoad) {

                setLoading(true);

            } else {

                /**
                 * Search / Filter loading
                 */
                setTableLoading(true);

            }

            setError("");

            const params = {

                page: currentPage,

                per_page: perPage,

            };

            /**
             * Search
             */

            if (search.trim() !== "") {

                params.search = search.trim();

            }

            /**
             * Filters
             */

            if (filters.action !== "") {

                params.transaction_type = filters.action;

            }

            if (filters.area !== "") {

                params.area_id = filters.area;

            }

            if (filters.user !== "") {

                params.user_id = filters.user;

            }

            if (filters.date !== "") {

                params.date = filters.date;

            }

            const response =
                await inventoryTransactionService.getAllTransactions(params);

            const result = response.data.data;

            setTransactions(result.data);

            setPagination({

                current_page: result.current_page,

                last_page: result.last_page,

                total: result.total,

                per_page: result.per_page,

            });

        } catch (error) {

            console.error(error);

            setError("Unable to load transaction history.");

        } finally {

            if (initialLoad) {

                setLoading(false);

            } else {

                setTableLoading(false);

            }

        }

    };

    /**
     * Load Initial Data
     */

    useEffect(() => {

        fetchFilterData();

        fetchTransactions(true);

    }, []);

    /**
     * Search / Filters / Pagination
     */

    useEffect(() => {

        if (!loading) {

            fetchTransactions(false);

        }

    }, [

        currentPage,

        search,

        filters,

    ]);

    /**
     * Refresh
     */

    const handleRefresh = () => {

        fetchTransactions(false);

    };

    /**
     * View Details
     */

    const openDetails = (transaction) => {

    setViewTransaction(transaction);

};

    /**
     * Close Details
     */

   const closeDetails = () => {

    setViewTransaction(null);

};

    /**
 * Delete Click
 */
const handleDeleteClick = (transaction) => {

    setDeleteTransaction(transaction);

    setIsDeleteModalOpen(true);

};

/**
 * Delete Transaction
 */
const handleDeleteTransaction = async () => {

    console.log("========== DELETE ==========");
    console.log(selectedTransaction);
    console.log(selectedTransaction?.id);

    try {

        setDeleteLoading(true);

        await inventoryTransactionService.deleteTransaction(
            deleteTransaction.id
            
        );

        setIsDeleteModalOpen(false);

        setSelectedTransaction(null);

        fetchTransactions(false);

    } catch (error) {

        console.error(error);

    } finally {

        setDeleteLoading(false);

    }

};;

    return (

        <div className="inventory-transaction-page">

            <div className="inventory-transaction-header">

                <div>

                    <h1>

                        Inventory Transaction History

                    </h1>

                    <p>

                        Monitor every inventory movement,
                        assignment, return, update and deletion
                        across all areas.

                    </p>

                </div>

                <button
                    className="transaction-refresh-btn"
                    onClick={handleRefresh}
                >

                    Refresh

                </button>

            </div>
                        {

                loading ? (

                    <div className="transaction-loading">

                        Loading transaction history...

                    </div>

                ) : error ? (

                    <div className="transaction-error">

                        {error}

                    </div>

                ) : (

                    <>

                        <TransactionFilters

                            search={search}

                            setSearch={setSearch}

                            filters={filters}

                            setFilters={setFilters}

                            setCurrentPage={setCurrentPage}

                            areas={areas}

                            users={users}

                        />

                        {

                            tableLoading && (

                                <div className="transaction-loading">

                                    Updating transaction history...

                                </div>

                            )

                        }

                        <TransactionTable

    transactions={transactions}

    onView={openDetails}

    onDelete={handleDeleteClick}

    currentPage={currentPage}

    perPage={perPage}

/>

                        <div className="transaction-pagination">

                            <div className="transaction-pagination-info">

                                Showing

                                <strong>

                                    {" "}

                                    {transactions.length}

                                    {" "}

                                </strong>

                                of

                                <strong>

                                    {" "}

                                    {pagination.total}

                                    {" "}

                                </strong>

                                transactions

                            </div>

                            <div className="transaction-pagination-buttons">

                                <button

                                    type="button"

                                    onClick={() =>
                                        setCurrentPage((page) => page - 1)
                                    }

                                    disabled={
                                        currentPage === 1
                                    }

                                >

                                    Previous

                                </button>

                                <span>

                                    Page{" "}

                                    <strong>

                                        {pagination.current_page}

                                    </strong>

                                    {" "}of{" "}

                                    <strong>

                                        {pagination.last_page}

                                    </strong>

                                </span>

                                <button

                                    type="button"

                                    onClick={() =>
                                        setCurrentPage((page) => page + 1)
                                    }

                                    disabled={
                                        currentPage === pagination.last_page
                                    }

                                >

                                    Next

                                </button>

                            </div>

                        </div>

                    </>

                )

            }

            <TransactionDetailsModal

    transaction={viewTransaction}

    onClose={closeDetails}

/>

            <DeleteTransactionModal

    isOpen={isDeleteModalOpen}

    transaction={deleteTransaction}

    loading={deleteLoading}

    onClose={() => {

        setIsDeleteModalOpen(false);

        setDeleteTransaction(null);

    }}

    onConfirm={handleDeleteTransaction}

/>

        </div>

    );

};

export default InventoryTransactionHistory;