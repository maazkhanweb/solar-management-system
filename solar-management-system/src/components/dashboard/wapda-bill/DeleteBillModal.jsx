import "./DeleteBillModal.css";

function DeleteBillModal({
    isOpen,
    selectedBill,
    onClose,
    onConfirm,
}) {

    if (!isOpen) return null;

    const months = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    return (

        <div className="modal-overlay">

            <div className="delete-modal">

                <h2>

                    Delete Bill

                </h2>

                <p>

                    Are you sure you want to delete this bill?

                </p>

                <div className="bill-details">

                    <p>

                        <strong>Consumer:</strong>{" "}

                        {selectedBill?.consumer_name}

                    </p>

                    <p>

                        <strong>Reference No:</strong>{" "}

                        {selectedBill?.reference_number}

                    </p>

                    <p>

                        <strong>Bill Month:</strong>{" "}

                        {
                            selectedBill
                                ? `${months[selectedBill.bill_month]} ${selectedBill.bill_year}`
                                : "-"
                        }

                    </p>

                    <p>

                        <strong>Area:</strong>{" "}

                        {
                            selectedBill?.area?.area_name ?? "-"
                        }

                    </p>

                </div>

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
                    >

                        Delete

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteBillModal;