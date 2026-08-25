/**
 * ============================================================================
 * File:
 * src/components/dashboard/wapda-bill/BillAnalysisCard.jsx
 *
 * Description:
 * Displays complete WAPDA Bill and Solar Performance Analysis.
 *
 * Features:
 * - Centered analysis modal
 * - No internal scrolling
 * - Background overlay
 * - WAPDA bill details
 * - Solar generation details
 * - WAPDA vs Solar comparison
 * - Consumer information
 * - Area information
 * - Bill period
 * - Billing information
 * - Solar performance calculations
 * - Close button
 * - Uses original bill data as fallback when analysis API does not return
 *   complete bill information
 * ============================================================================
 */

import "./BillAnalysisCard.css";


/* ==========================================================================
   FORMAT VALUE
========================================================================== */

const formatValue = (
    value,
    suffix = ""
) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }

    const numericValue =
        Number(value);

    if (
        Number.isNaN(
            numericValue
        )
    ) {
        return `${value}${suffix}`;
    }

    return `${numericValue.toFixed(2)}${suffix}`;
};


/* ==========================================================================
   FORMAT MONTH
========================================================================== */

const formatMonth = (
    month
) => {

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

    return String(month);
};


/* ==========================================================================
   GET FIRST AVAILABLE VALUE
========================================================================== */

const firstValue = (
    ...values
) => {

    for (const value of values) {

        if (
            value !== null &&
            value !== undefined &&
            value !== ""
        ) {
            return value;
        }

    }

    return "-";
};


/* ==========================================================================
   COMPONENT
========================================================================== */

const BillAnalysisCard = ({
    analysis,
    bill,
    onClose,
}) => {


    /* ======================================================================
       EMPTY STATE
    ====================================================================== */

    if (!analysis) {

        return (

            <div className="bill-analysis-overlay">

                <div
                    className="bill-analysis-card"
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >

                    <div className="analysis-header">

                        <div>

                            <h3 className="analysis-title">
                                Bill Analysis
                            </h3>

                            <p className="analysis-subtitle">
                                AI Generated Solar Performance Report
                            </p>

                        </div>

                        {onClose && (

                            <button
                                type="button"
                                className="analysis-close-button"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                ×
                            </button>

                        )}

                    </div>

                    <div className="analysis-empty">

                        Select a bill and click Analysis
                        to view the complete report.

                    </div>

                </div>

            </div>

        );

    }


    /* ======================================================================
       BILL DATA
       ----------------------------------------------------------------------
       Analysis API may return bill data in different locations.
       Original selected bill is also used as fallback.
    ====================================================================== */

    const billData =

        analysis.bill ||

        analysis.bill_data ||

        analysis.bill_details ||

        bill ||

        {};


    /* ======================================================================
       BASIC BILL INFORMATION
    ====================================================================== */

    const consumerName = firstValue(

        analysis.consumer_name,

        analysis.consumerName,

        billData.consumer_name,

        billData.consumerName,

        billData.consumer?.name,

        billData.customer_name,

        billData.customerName

    );


    const referenceNumber = firstValue(

        analysis.reference_number,

        analysis.referenceNumber,

        analysis.reference_no,

        billData.reference_number,

        billData.referenceNumber,

        billData.reference_no

    );


    const areaName = firstValue(

        analysis.area_name,

        analysis.areaName,

        analysis.area?.area_name,

        analysis.area?.name,

        billData.area_name,

        billData.areaName,

        billData.area?.area_name,

        billData.area?.name

    );


    const billMonth = firstValue(

        analysis.bill_month,

        analysis.billMonth,

        billData.bill_month,

        billData.billMonth

    );


    const billYear = firstValue(

        analysis.bill_year,

        analysis.billYear,

        billData.bill_year,

        billData.billYear

    );


    const billAddress = firstValue(

        analysis.bill_address,

        analysis.billAddress,

        billData.bill_address,

        billData.billAddress

    );


    /* ======================================================================
       ELECTRICITY VALUES
    ====================================================================== */

    const consumedUnits =
        Number(
            analysis.units_consumed ??
            billData.units_consumed ??
            0
        ) || 0;


    const generatedUnits =
        Number(
            analysis.generated_units ??
            analysis.solar_units ??
            billData.solar_units ??
            billData.solar_generated_units ??
            0
        ) || 0;


    const billAmount =
        Number(
            analysis.bill_amount ??
            billData.bill_amount ??
            0
        ) || 0;


    /* ======================================================================
       DIFFERENCE
    ====================================================================== */

    const calculatedDifference =
        generatedUnits -
        consumedUnits;


    const differenceUnits =

        analysis.difference_units !== null &&

        analysis.difference_units !== undefined &&

        analysis.difference_units !== ""

            ? Number(
                analysis.difference_units
            )

            : calculatedDifference;


    const differenceClass =

        differenceUnits < 0

            ? "difference-negative"

            : differenceUnits > 0

                ? "difference-positive"

                : "";


    /* ======================================================================
       SOLAR COVERAGE
    ====================================================================== */

    const solarCoverage =

        analysis.solar_coverage !== null &&

        analysis.solar_coverage !== undefined

            ? analysis.solar_coverage

            : consumedUnits > 0

                ? (
                    generatedUnits /
                    consumedUnits
                ) * 100

                : 0;


    /* ======================================================================
       WAPDA DEPENDENCY
    ====================================================================== */

    const wapdaDependency =

        analysis.wapda_dependency !== null &&

        analysis.wapda_dependency !== undefined

            ? analysis.wapda_dependency

            : consumedUnits > 0

                ? Math.max(

                    0,

                    (
                        (
                            consumedUnits -
                            generatedUnits
                        ) /
                        consumedUnits
                    ) * 100

                )

                : 0;


    /* ======================================================================
       UNIT RATE
    ====================================================================== */

    const unitRate =

        analysis.unit_rate !== null &&

        analysis.unit_rate !== undefined

            ? analysis.unit_rate

            : consumedUnits > 0

                ? billAmount /
                  consumedUnits

                : 0;


    /* ======================================================================
       ESTIMATED SAVING
    ====================================================================== */

    const estimatedSaving =

        analysis.estimated_saving !== null &&

        analysis.estimated_saving !== undefined

            ? analysis.estimated_saving

            : generatedUnits *
              unitRate;


    /* ======================================================================
       PERFORMANCE REASON
    ====================================================================== */

    const performanceReason =

        analysis.generation_loss_reason &&

        analysis.generation_loss_reason !== "-"

            ? analysis.generation_loss_reason

            : generatedUnits >= consumedUnits

                ? "Excellent"

                : "Solar generation is lower than electricity consumption.";


    const reasonClass =

        generatedUnits >= consumedUnits

            ? "reason-success"

            : "reason-danger";


    /* ======================================================================
       BILL PERIOD
    ====================================================================== */

    const formattedMonth =
        billMonth !== "-"
            ? formatMonth(billMonth)
            : "-";


    const formattedBillPeriod =

        formattedMonth === "-" &&
        billYear === "-"

            ? "-"

            : `${formattedMonth} ${billYear}`;


    /* ======================================================================
       RENDER
    ====================================================================== */

    return (

        <div
            className="bill-analysis-overlay"
            onClick={onClose}
        >

            <div
                className="bill-analysis-card"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >


                {/* ==========================================================
                   HEADER
                ========================================================== */}

                <div className="analysis-header">

                    <div>

                        <h3 className="analysis-title">
                            Bill Analysis
                        </h3>

                        <p className="analysis-subtitle">
                            WAPDA Bill and Solar Performance Comparison
                        </p>

                    </div>


                    {onClose && (

                        <button
                            type="button"
                            className="analysis-close-button"
                            onClick={onClose}
                            aria-label="Close analysis"
                        >

                            ×

                        </button>

                    )}

                </div>


                {/* ==========================================================
                   CONTENT
                ========================================================== */}

                <div className="analysis-content">


                    {/* ======================================================
                       WAPDA BILL DETAILS
                    ====================================================== */}

                    <div className="analysis-section">

                        <div className="analysis-section-heading">

                            <h4>
                                WAPDA Bill Details
                            </h4>

                            <p>
                                Electricity consumption and billing information.
                            </p>

                        </div>


                        <div className="analysis-grid">


                            <div className="analysis-item">

                                <span>
                                    Consumer Name
                                </span>

                                <strong>
                                    {consumerName}
                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    Reference Number
                                </span>

                                <strong>
                                    {referenceNumber}
                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    Area
                                </span>

                                <strong>
                                    {areaName}
                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    Bill Period
                                </span>

                                <strong>
                                    {formattedBillPeriod}
                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    Bill Address
                                </span>

                                <strong>
                                    {billAddress}
                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    Units Consumed
                                </span>

                                <strong>

                                    {formatValue(
                                        consumedUnits
                                    )}

                                    {" Units"}

                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    Bill Amount
                                </span>

                                <strong>

                                    Rs.{" "}

                                    {formatValue(
                                        billAmount
                                    )}

                                </strong>

                            </div>


                        </div>

                    </div>


                    {/* ======================================================
                       SOLAR GENERATION DETAILS
                    ====================================================== */}

                    <div className="analysis-section">

                        <div className="analysis-section-heading">

                            <h4>
                                Solar Generation Details
                            </h4>

                            <p>
                                Solar system generation and performance information.
                            </p>

                        </div>


                        <div className="analysis-grid">


                            <div className="analysis-item">

                                <span>
                                    Generated Units
                                </span>

                                <strong>

                                    {formatValue(
                                        generatedUnits
                                    )}

                                    {" Units"}

                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    Solar Coverage
                                </span>

                                <strong>

                                    {formatValue(
                                        solarCoverage,
                                        "%"
                                    )}

                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    Estimated Saving
                                </span>

                                <strong className="saving">

                                    Rs.{" "}

                                    {formatValue(
                                        estimatedSaving
                                    )}

                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    Efficiency
                                </span>

                                <strong className="efficiency">

                                    {
                                        analysis.efficiency ||
                                        "-"
                                    }

                                </strong>

                            </div>


                        </div>

                    </div>


                    {/* ======================================================
                       WAPDA VS SOLAR COMPARISON
                    ====================================================== */}

                    <div className="analysis-section">

                        <div className="analysis-section-heading">

                            <h4>
                                WAPDA vs Solar Comparison
                            </h4>

                            <p>
                                Comparison between electricity consumption
                                and solar generation.
                            </p>

                        </div>


                        <div className="analysis-grid">


                            <div className="analysis-item">

                                <span>
                                    WAPDA Units
                                </span>

                                <strong>

                                    {formatValue(
                                        consumedUnits
                                    )}

                                    {" Units"}

                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    Solar Generated Units
                                </span>

                                <strong>

                                    {formatValue(
                                        generatedUnits
                                    )}

                                    {" Units"}

                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    Difference Units
                                </span>

                                <strong
                                    className={
                                        differenceClass
                                    }
                                >

                                    {differenceUnits > 0
                                        ? "+"
                                        : ""}

                                    {formatValue(
                                        differenceUnits
                                    )}

                                    {" Units"}

                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    WAPDA Dependency
                                </span>

                                <strong>

                                    {formatValue(
                                        wapdaDependency,
                                        "%"
                                    )}

                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    Unit Rate
                                </span>

                                <strong>

                                    Rs.{" "}

                                    {formatValue(
                                        unitRate
                                    )}

                                </strong>

                            </div>


                            <div className="analysis-item">

                                <span>
                                    Performance Result
                                </span>

                                <strong
                                    className={
                                        reasonClass
                                    }
                                >

                                    {performanceReason}

                                </strong>

                            </div>


                        </div>

                    </div>


                </div>


                {/* ==========================================================
                   FOOTER
                ========================================================== */}

                <div className="analysis-footer">

                    <button
                        type="button"
                        className="analysis-footer-close-button"
                        onClick={onClose}
                    >

                        Close

                    </button>

                </div>


            </div>

        </div>

    );

};


export default BillAnalysisCard;