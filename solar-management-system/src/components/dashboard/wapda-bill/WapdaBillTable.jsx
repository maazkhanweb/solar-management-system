/**
 * ============================================================================
 * File:
 * src/components/dashboard/wapda-bill/WapdaBillTable.jsx
 *
 * Description:
 * Displays all WAPDA bills in table format.
 * Shows bill area, consumption, amount, status and actions.
 * ============================================================================
 */

import "./WapdaBillTable.css";

import ActionButtons
    from "../../common/ActionButtons/ActionButtons";


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


/* ==========================================================================
   FORMAT MONTH
========================================================================== */

const formatMonth = (
    month
) => {

    if (

        month === null ||

        month === undefined ||

        month === ""

    ) {

        return "-";

    }


    const monthNumber =
        Number(month);


    if (

        !Number.isNaN(
            monthNumber
        ) &&

        monthNumber >= 1 &&

        monthNumber <= 12

    ) {

        return months[
            monthNumber - 1
        ];

    }


    const matchedMonth =
        months.find(

            (item) =>

                item.toLowerCase() ===

                String(month)
                    .trim()
                    .toLowerCase()

        );


    return (

        matchedMonth ||

        String(month)

    );

};


/* ==========================================================================
   FORMAT NUMBER
========================================================================== */

const formatNumber = (
    value
) => {

    if (

        value === null ||

        value === undefined ||

        value === ""

    ) {

        return "-";

    }


    const number =
        Number(value);


    if (
        Number.isNaN(number)
    ) {

        return value;

    }


    return number.toFixed(2);

};


/* ==========================================================================
   GET DIFFERENCE
========================================================================== */

const getDifference = (
    bill
) => {

    const consumedUnits =
        Number(
            bill.units_consumed
        ) || 0;


    const generatedUnits =
        Number(
            bill.generated_units
        ) || 0;


    const difference =
        generatedUnits -
        consumedUnits;


    if (
        difference > 0
    ) {

        return {

            status: "positive",

            text:
                `+${difference.toFixed(2)}`,

        };

    }


    if (
        difference < 0
    ) {

        return {

            status: "negative",

            text:
                difference.toFixed(2),

        };

    }


    return {

        status: "positive",

        text: "0.00",

    };

};


/* ==========================================================================
   GET AREA NAME
========================================================================== */

const getAreaName = (
    bill
) => {

    return (

        bill?.area?.area_name ||

        bill?.area_name ||

        bill?.area?.name ||

        "-"

    );

};


/* ==========================================================================
   WAPDA BILL TABLE
========================================================================== */

function WapdaBillTable({

    bills = [],

    onEdit,

    onDelete,

    onViewAnalysis,

}) {

    return (

        <div className="bill-table-container">

            <table className="bill-table">


                <thead>

                    <tr>

                        <th>
                            #
                        </th>

                        <th>
                            Consumer
                        </th>

                        <th>
                            Reference No
                        </th>

                        <th>
                            Month
                        </th>

                        <th>
                            Year
                        </th>

                        <th>
                            Bill Address
                        </th>

                        <th>
                            Area
                        </th>

                        <th>
                            Bill Units
                        </th>

                        <th>
                            Solar Units
                        </th>

                        <th>
                            Difference
                        </th>

                        <th>
                            Bill Amount
                        </th>

                        <th>
                            Status
                        </th>

                        <th>
                            Actions
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {

                        bills.length > 0

                            ? (

                                bills.map(

                                    (
                                        bill,
                                        index
                                    ) => {

                                        const difference =
                                            getDifference(
                                                bill
                                            );


                                        const areaName =
                                            getAreaName(
                                                bill
                                            );


                                        return (

                                            <tr
                                                key={
                                                    bill.id
                                                }
                                            >

                                                <td>

                                                    {
                                                        index + 1
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        bill.consumer_name ||
                                                        "-"
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        bill.reference_number ||
                                                        "-"
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        formatMonth(
                                                            bill.bill_month
                                                        )
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        bill.bill_year ||
                                                        "-"
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        bill.bill_address ||
                                                        "-"
                                                    }

                                                </td>


                                                {/* AREA */}

                                                <td>

                                                    {
                                                        areaName
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        formatNumber(
                                                            bill.units_consumed
                                                        )
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        formatNumber(
                                                            bill.generated_units
                                                        )
                                                    }

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            `difference-badge ${difference.status}`
                                                        }
                                                    >

                                                        {
                                                            difference.text
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    Rs.{" "}

                                                    {
                                                        formatNumber(
                                                            bill.bill_amount
                                                        )
                                                    }

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            `status ${
                                                                String(
                                                                    bill.status ||
                                                                    ""
                                                                )
                                                                    .toLowerCase()
                                                            }`
                                                        }
                                                    >

                                                        {
                                                            bill.status ||
                                                            "-"
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    <ActionButtons

                                                        onEdit={() =>

                                                            onEdit(
                                                                bill
                                                            )

                                                        }

                                                        onDelete={() =>

                                                            onDelete(
                                                                bill
                                                            )

                                                        }

                                                        onAnalysis={() =>

                                                            onViewAnalysis(
                                                                bill
                                                            )

                                                        }

                                                    />

                                                </td>

                                            </tr>

                                        );

                                    }

                                )

                            )

                            : (

                                <tr>

                                    <td
                                        colSpan="13"
                                        style={{

                                            textAlign:
                                                "center",

                                            padding:
                                                "30px",

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