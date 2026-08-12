/**
 * ===========================================================
 * File:
 * src/components/dashboard/wapda-bill/BillAnalysisCard.jsx
 *
 * Description:
 * WAPDA Bill Analysis Card
 * ===========================================================
 */

import "./BillAnalysisCard.css";

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

    return `${Number(value).toFixed(2)}${suffix}`;

};

function BillAnalysisCard({

    analysis,

}) {

    console.log(analysis);

    if (!analysis) {

        return (

            <div className="bill-analysis-card empty-analysis">

                <div className="analysis-header">

                    <h3>

                        Bill Analysis

                    </h3>

                </div>

                <div className="analysis-empty">

                    <h4>

                        No Analysis Available

                    </h4>

                    <p>

                        Click the
                        <strong> Analysis </strong>
                        button from the bill table to view
                        AI powered bill analysis.

                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="bill-analysis-card">

            {/* ==========================================
                Header
            ========================================== */}

            <div className="analysis-header">

                <div>

                    <h3>

                        Bill Analysis

                    </h3>

                    <p>

                        AI Generated Solar Performance Report

                    </p>

                </div>

            </div>

            {/* ==========================================
                Body
            ========================================== */}

            <div className="analysis-grid">

                <div className="analysis-item">

                    <span>

                        Units Consumed

                    </span>

                    <strong>

                        {formatValue(
                            analysis.units_consumed
                        )} Units

                    </strong>

                </div>

                <div className="analysis-item">

                    <span>

                        Generated Units

                    </span>

                    <strong>

                        {formatValue(
                            analysis.generated_units
                        )} Units

                    </strong>

                </div>

                <div className="analysis-item">

                    <span>

                        Difference

                    </span>

                    <strong>

                        {formatValue(
                            analysis.difference_units
                        )} Units

                    </strong>

                </div>

                <div className="analysis-item">

                    <span>

                        Solar Coverage

                    </span>

                    <strong>

                        {formatValue(
                            analysis.solar_coverage,
                            "%"
                        )}

                    </strong>

                </div>
                                <div className="analysis-item">

                    <span>

                        WAPDA Dependency

                    </span>

                    <strong>

                        {formatValue(
                            analysis.wapda_dependency,
                            "%"
                        )}

                    </strong>

                </div>

                <div className="analysis-item">

                    <span>

                        Unit Rate

                    </span>

                    <strong>

                        Rs. {formatValue(
                            analysis.unit_rate
                        )}

                    </strong>

                </div>

                <div className="analysis-item saving-card">

                    <span>

                        Estimated Saving

                    </span>

                    <strong className="saving">

                        Rs. {formatValue(
                            analysis.estimated_saving
                        )}

                    </strong>

                </div>

                <div className="analysis-item">

    <span>

        Reason

    </span>

    <strong
    className={
        Number(analysis.generated_units) >=
        Number(analysis.units_consumed)
            ? "reason-success"
            : "reason-danger"
    }
>

    {

        Number(analysis.generated_units) >=
        Number(analysis.units_consumed)

            ? "Excellent"

            : (
                analysis.generation_loss_reason ||
                "No Reason"
            )

    }

</strong>

</div>

            </div>

        </div>

    );

}

export default BillAnalysisCard;