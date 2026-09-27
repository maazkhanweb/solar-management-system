import { useEffect } from "react";
import "./TransactionDetailsModal.css";

import {
    RiCloseLine,
    RiFileList3Line,
} from "react-icons/ri";

const TransactionDetailsModal = ({
    transaction,
    onClose,
}) => {

    /* ==========================================
       Close on ESC
    ========================================== */

    useEffect(() => {

        const handleEscape = (event) => {

            if (event.key === "Escape") {

                onClose();

            }

        };

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, [onClose]);

    if (!transaction) {

        return null;

    }

    /* ==========================================
       Transaction Label
    ========================================== */

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

            default:
                return type || "-";

        }

    };

    /* ==========================================
       Badge Class
    ========================================== */

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

            default:
                return "";

        }

    };

    /* ==========================================
       Render
    ========================================== */

    return (

        <div
            className="transaction-modal-overlay"
            onClick={onClose}
        >

            <div
                className="transaction-modal"
                onClick={(event) => event.stopPropagation()}
            >

                {/* ======================================
                    Header
                ====================================== */}

                <div className="transaction-modal-header">

                    <div className="transaction-modal-title">

                        <RiFileList3Line />

                        <h2>

                            Transaction Details

                        </h2>

                    </div>

                    <button
                        type="button"
                        className="transaction-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >

                        <RiCloseLine />

                    </button>

                </div>

                {/* ======================================
                    Body
                ====================================== */}

                <div className="transaction-modal-body">

                    <div className="transaction-detail-item">

                        <span>Transaction ID</span>

                        <strong>

                            {transaction.id ?? "-"}

                        </strong>

                    </div>

                    <div className="transaction-detail-item">

                        <span>Item Name</span>

                        <strong>

                            {transaction.inventory_item?.item_name || "-"}

                        </strong>

                    </div>

                    <div className="transaction-detail-item">

                        <span>Serial Number</span>

                        <strong>

                            {transaction.inventory_item?.serial_number || "-"}

                        </strong>

                    </div>

                    <div className="transaction-detail-item">

                        <span>Transaction Type</span>

                        <strong>

                            <span
                                className={`transaction-badge ${getBadgeClass(
                                    transaction.transaction_type
                                )}`}
                            >

                                {getTransactionLabel(
                                    transaction.transaction_type
                                )}

                            </span>

                        </strong>

                    </div>

                    <div className="transaction-detail-item">

                        <span>Quantity</span>

                        <strong>

                            {transaction.quantity ?? "-"}

                        </strong>

                    </div>

                    <div className="transaction-detail-item">

                        <span>From Area</span>

                        <strong>

                            {transaction.from_area_name || "Warehouse"}

                        </strong>

                    </div>

                    <div className="transaction-detail-item">

                        <span>To Area</span>

                        <strong>

                            {transaction.to_area_name || "-"}

                        </strong>

                    </div>
                                        <div className="transaction-detail-item">

                        <span>Performed By</span>

                        <strong>

                            {transaction.performed_by || "-"}

                        </strong>

                    </div>

                    <div className="transaction-detail-item">

                        <span>Area Manager</span>

                        <strong>

                            {transaction.area_manager || "-"}

                        </strong>

                    </div>

                    <div className="transaction-detail-item">

                        <span>Date & Time</span>

                        <strong>

                            {
                                transaction.created_at
                                    ? new Date(
                                          transaction.created_at
                                      ).toLocaleString()
                                    : "-"
                            }

                        </strong>

                    </div>

                    <div className="transaction-detail-item full-width">

                        <span>Remarks</span>

                        <strong>

                            {
                                transaction.remarks?.trim()
                                    ? transaction.remarks
                                    : "No remarks available."
                            }

                        </strong>

                    </div>

                </div>

                {/* ======================================
                    Footer
                ====================================== */}

                <div className="transaction-modal-footer">

                    <button
                        type="button"
                        className="transaction-close-btn"
                        onClick={onClose}
                    >

                        Close

                    </button>

                </div>

            </div>

        </div>

    );

};

export default TransactionDetailsModal;