/**
 * ============================================================================
 * File:
 * src/components/dashboard/inventoryTransaction/DeleteTransactionModal.jsx
 * Description:
 * Delete Confirmation Modal For Inventory Transaction
 * ============================================================================
 */

import "./DeleteTransactionModal.css";

function DeleteTransactionModal({

    isOpen,

    transaction,

    onClose,

    onConfirm,

    loading,

}) {

    if (!isOpen) {

        return null;

    }

    return (

        <div className="modal-overlay">

            <div className="delete-modal">

                <h2>

                    Delete Transaction

                </h2>

                <p>

                    Are you sure you want to delete this inventory transaction?

                </p>

                <p>

                    <strong>

                        Transaction ID:

                    </strong>

                    {" "}

                    {transaction?.id}

                </p>

                <div className="delete-modal-actions">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        Cancel

                    </button>

                    <button

                        className="delete-btn"

                        onClick={onConfirm}

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Deleting..."

                                : "Delete"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteTransactionModal;