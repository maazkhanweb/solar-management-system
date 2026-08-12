/**
 * ===========================================================
 * File:
 * src/components/dashboard/wapda-bill/BillAnalysisModal.jsx
 *
 * Description:
 * Bill Analysis Popup Modal
 * ===========================================================
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

    }, [onClose]);

    if (!isOpen) {

        return null;

    }

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

                {/* ===========================
                    Header
                ============================ */}

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
                    >

                        <RiCloseLine />

                    </button>

                </div>

                {/* ===========================
                    Bill Info
                ============================ */}

                <div className="bill-info-grid">

                    <div>

                        <span>

                            Consumer

                        </span>

                        <strong>

                            {bill?.consumer_name}

                        </strong>

                    </div>

                    <div>

                        <span>

                            Reference No

                        </span>

                        <strong>

                            {bill?.reference_number}

                        </strong>

                    </div>

                    <div>

                        <span>

                            Area

                        </span>

                        <strong>

                            {bill?.area?.area_name ?? "-"}

                        </strong>

                    </div>

                    <div>

                        <span>

                            Bill Amount

                        </span>

                        <strong>

                            Rs. {bill?.bill_amount}

                        </strong>

                    </div>

                </div>

                {/* ===========================
                    Analysis Card
                ============================ */}

                <BillAnalysisCard
                    analysis={analysis}
                />

            </div>

        </div>

    );

}

export default BillAnalysisModal;
