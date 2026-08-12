/**
 * ============================================================================
 * File:
 * src/components/dashboard/wapda-bill/WapdaBillTable.jsx
 *
 * Description:
 * WAPDA Bill Table
 * ============================================================================
 */

import "./WapdaBillTable.css";

function WapdaBillTable({

    bills,

    onEdit,

    onDelete,

    onAnalysis,

}) {

    const getDifference = (bill) => {

    const billUnits =
        Number(bill.units_consumed || 0);

    const generatedUnits =
        Number(bill.generated_units || 0);

    const difference =
        Math.abs(
            generatedUnits - billUnits
        );

    return {

        value: difference.toFixed(2),

        status:
            generatedUnits > billUnits
                ? "positive"
                : "negative",

        text:
            generatedUnits > billUnits
                ? `+${difference.toFixed(2)}`
                : difference.toFixed(2),

    };

};

    return (

        <div className="bill-table-container">

            <table className="bill-table">

                <thead>

                    <tr>

                        <th>#</th>

                        <th>Consumer</th>

                        <th>Reference No</th>

                        <th>Month</th>

                        <th>Year</th>

                        <th>Bill Address</th>

                        <th>Bill Units</th>

                        <th>Inverter Generated Units</th>

                        <th>Difference Units</th>

                        <th>Bill Amount</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        bills.length > 0 ? (

                            bills.map((bill, index) => {

                                const difference =
                                    getDifference(bill);

                                return (

                                    <tr key={bill.id}>

                                        <td>

                                            {index + 1}

                                        </td>

                                        <td>

                                            {bill.consumer_name}

                                        </td>

                                        <td>

                                            {bill.reference_number}

                                        </td>

                                        <td>

                                            {bill.bill_month}

                                        </td>

                                        <td>

                                            {bill.bill_year}

                                        </td>

                                        <td>

    {

        bill.bill_address ||

        "-"

    }

</td>

                                        <td>

                                            {bill.units_consumed}

                                        </td>

                                        <td>

                                            {

                                                bill.generated_units ??

                                                "-"

                                            }

                                        </td>

                                        <td>

                                            <span
    className={`difference-badge ${difference.status}`}
>

    {difference.text}

</span>

                                        </td>

                                        <td>

                                            Rs. {bill.bill_amount}

                                        </td>

                                        <td>

                                            <span
                                                className={`status ${bill.status.toLowerCase()}`}
                                            >

                                                {bill.status}

                                            </span>

                                        </td>
                                                                                <td>

                                            <div className="bill-actions">

                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        onEdit(bill)
                                                    }
                                                >

                                                    Edit

                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        onDelete(bill)
                                                    }
                                                >

                                                    Delete

                                                </button>

                                                <button
                                                    className="analysis-btn"
                                                    onClick={() =>
                                                        onAnalysis(bill)
                                                    }
                                                >

                                                    Analysis

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                );

                            })

                        ) : (

                            <tr>

                                <td
                                    colSpan="12"
                                    style={{
                                        textAlign: "center",
                                        padding: "30px",
                                    }}
                                >

                                    No Bills Found.

                                </td>

                            </tr>

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}

export default WapdaBillTable;