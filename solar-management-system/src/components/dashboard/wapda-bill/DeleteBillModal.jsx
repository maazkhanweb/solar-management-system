/**
 * ============================================================================
 * File:
 * src/components/dashboard/wapda-bill/DeleteBillModal.jsx
 *
 * Description:
 * Delete confirmation modal for WAPDA Bills.
 * Displays bill details including formatted month.
 * ============================================================================
 */

import "./DeleteBillModal.css";


const months = [
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


const formatMonth = (month) => {

    if (
        month === null ||
        month === undefined ||
        month === ""
    ) {
        return "-";
    }


    const monthNumber = Number(month);


    if (
        !Number.isNaN(monthNumber) &&
        monthNumber >= 1 &&
        monthNumber <= 12
    ) {
        return months[monthNumber - 1];
    }


    const matchedMonth = months.find(
        (item) =>
            item.toLowerCase() ===
            String(month).trim().toLowerCase()
    );


    return matchedMonth || String(month);

};


function DeleteBillModal({
    isOpen,
    selectedBill,
    onClose,
    onConfirm,
}) {

    if (!isOpen) {
        return null;
    }


    const billMonth = selectedBill
        ? formatMonth(selectedBill.bill_month)
        : "-";


    const billYear = selectedBill?.bill_year || "";


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

                        <strong>
                            Consumer:
                        </strong>

                        {" "}

                        {selectedBill?.consumer_name || "-"}

                    </p>


                    <p>

                        <strong>
                            Reference No:
                        </strong>

                        {" "}

                        {selectedBill?.reference_number || "-"}

                    </p>


                    <p>

                        <strong>
                            Bill Month:
                        </strong>

                        {" "}

                        {selectedBill
                            ? `${billMonth} ${billYear}`
                            : "-"
                        }

                    </p>


                    <p>

                        <strong>
                            Area:
                        </strong>

                        {" "}

                        {
                            selectedBill?.area?.area_name ||
                            selectedBill?.area_name ||
                            selectedBill?.bill_address ||
                            "-"
                        }

                    </p>

                </div>


                <div className="delete-actions">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
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