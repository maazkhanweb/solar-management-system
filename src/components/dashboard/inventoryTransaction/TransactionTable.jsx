import "./TransactionTable.css";

import {

    RiEyeLine,
    RiDeleteBin6Line,

} from "react-icons/ri";

const TransactionTable = ({

    transactions = [],

    onView,

    onDelete,

    currentPage = 1,

    perPage = 10,

}) => {

    /**
     * Transaction Label
     */

    const getTransactionLabel = (type) => {

        switch (type) {

            case "ADD":

                return "Added";

            case "UPDATE":

                return "Updated";

            case "ASSIGN":

                return "Assigned";

            case "RETURN":

                return "Returned";

            case "DELETE":

                return "Deleted";

            case "DAMAGE":

                return "Damaged";

            case "REPAIR":

                return "Repaired";

            default:

                return type || "-";

        }

    };

    /**
     * Badge Class
     */

    const getBadgeClass = (type) => {

        switch (type) {

            case "ADD":

                return "badge-add";

            case "UPDATE":

                return "badge-update";

            case "ASSIGN":

                return "badge-assign";

            case "RETURN":

                return "badge-return";

            case "DELETE":

                return "badge-delete";

            case "DAMAGE":

                return "badge-damage";

            case "REPAIR":

                return "badge-repair";

            default:

                return "";

        }

    };

    /**
     * Date Formatter
     */

    const formatDateTime = (date) => {

        if (!date) {

            return "-";

        }

        return new Date(date).toLocaleString();

    };

    return (

        <div className="transaction-table-wrapper">

            <table className="transaction-table">

                <thead>

                    <tr>

                        <th>#</th>

                        <th>Item Name</th>

                        <th>Serial Number</th>

                        <th>Transaction</th>

                        <th>Quantity</th>

                        <th>From Area</th>

                        <th>To Area</th>

                        <th>Performed By</th>

                        <th>Area Manager</th>

                        <th>Date & Time</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        transactions.length === 0 ? (

                            <tr>

                                <td

                                    colSpan="11"

                                    className="transaction-no-data"

                                >

                                    No transaction history found.

                                </td>

                            </tr>

                        ) : (

                            transactions.map((transaction, index) => (

                                <tr key={transaction.id}>

                                    <td>

                                        {((currentPage - 1) * perPage) + index + 1}

                                    </td>

                                    <td>

                                        {transaction.inventory_item?.item_name || "-"}

                                    </td>

                                    <td>

                                        {transaction.inventory_item?.serial_number || "-"}

                                    </td>

                                    <td>

                                        <span

                                            className={`transaction-badge ${getBadgeClass(

                                                transaction.transaction_type

                                            )}`}

                                        >

                                            {getTransactionLabel(

                                                transaction.transaction_type

                                            )}

                                        </span>

                                    </td>

                                    <td>

                                        {transaction.quantity ?? "-"}

                                    </td>

                                    <td>

                                        {transaction.from_area_name || "Warehouse"}

                                    </td>

                                    <td>

                                        {transaction.to_area_name || "-"}

                                    </td>
                                                                        <td>

                                        {transaction.performed_by || "-"}

                                    </td>

                                    <td>

                                        {transaction.area_manager || "-"}

                                    </td>

                                    <td>

                                        {formatDateTime(
                                            transaction.created_at
                                        )}

                                    </td>

                                    <td>

    <div className="transaction-action-buttons">

        <button
            type="button"
            className="transaction-view-btn"
            onClick={() => onView(transaction)}
        >

            <RiEyeLine />

            <span>

                View

            </span>

        </button>

        <button
            type="button"
            className="transaction-delete-btn"
            onClick={() => onDelete(transaction)}
        >

            <RiDeleteBin6Line />

            <span>

                Delete

            </span>

        </button>

    </div>

</td>

                                </tr>

                            ))

                        )

                    }

                </tbody>

            </table>

        </div>

    );

};

export default TransactionTable;