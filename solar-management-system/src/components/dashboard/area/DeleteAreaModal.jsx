import "./DeleteAreaModal.css";

const DeleteAreaModal = ({
    isOpen,
    onClose,
    onConfirm,
    selectedArea,
}) => {

    if (!isOpen) return null;

    return (

        <div className="modal-overlay">

            <div className="delete-modal">

                <h2>Delete Area</h2>

                <p>

                    Are you sure you want to delete

                    <strong>{selectedArea?.area_name}</strong> ?

                </p>

                <div className="delete-buttons">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="delete-btn"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

};

export default DeleteAreaModal;