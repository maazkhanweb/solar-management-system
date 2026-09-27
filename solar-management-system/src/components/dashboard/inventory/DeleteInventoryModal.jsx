import "./DeleteInventoryModal.css";

function DeleteInventoryModal({

    isOpen,

    onClose,

    onConfirm,

    item,

    loading,

}) {

    if (!isOpen) {

        return null;

    }

    return (

        <div className="modal-overlay">

            <div className="delete-modal">

                <h2>Delete Inventory</h2>

                <p>

                    Are you sure you want to delete

                    <strong> {item?.item_name}</strong> ?

                </p>

                <p>

                    This action cannot be undone.

                </p>

                <div className="delete-actions">

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

export default DeleteInventoryModal;