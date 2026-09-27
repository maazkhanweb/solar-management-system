/**
 * ============================================================================
 * File:
 * src/components/dashboard/wapda-bill/BillAnalysisModal.jsx
 *
 * Description:
 * Bill Analysis popup modal.
 * Displays bill information and solar performance analysis.
 * ============================================================================
 */

import { useEffect } from "react";

import { RiCloseLine } from "react-icons/ri";

import BillAnalysisCard from "./BillAnalysisCard";

import "./BillAnalysisModal.css";


function BillAnalysisModal({
    isOpen,
    bill,
    analysis,
    onClose,
}) {

    useEffect(() => {

        if (!isOpen) {
            return;
        }


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

    }, [isOpen, onClose]);


    if (!isOpen) {
        return null;
    }


    const areaName =
        bill?.area_name ||
        bill?.area?.area_name ||
        bill?.bill_address ||
        bill?.address ||
        "-";


    const billAmount =
        bill?.bill_amount ??
        "-";


    return (

        <div
            className="bill-analysis-modal-overlay"
            onClick={onClose}
        >

            <div
                className="bill-analysis-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                <div className="bill-analysis-modal-header">

                    <div>

                        <h2>
                            Bill Analysis
                        </h2>

                        <p>
                            AI Generated Solar Performance Report
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close analysis"
                    >

                        <RiCloseLine />

                    </button>

                </div>


                <div className="bill-info-grid">

                    <div>

                        <span>
                            Consumer
                        </span>

                        <strong>
                            {bill?.consumer_name || "-"}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Reference No
                        </span>

                        <strong>
                            {bill?.reference_number || "-"}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Area
                        </span>

                        <strong>
                            {areaName}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Bill Amount
                        </span>

                        <strong>
                            {billAmount === "-"
                                ? "-"
                                : `Rs. ${billAmount}`
                            }
                        </strong>

                    </div>

                </div>


                <BillAnalysisCard
                    analysis={analysis}
                />

            </div>

        </div>

    );

}


export default BillAnalysisModal;