import { useEffect } from "react";

import {
    RiCloseLine,
    RiBarChartBoxLine,
    RiFlashlightLine,
    RiBattery2ChargeLine,
    RiLightbulbFlashLine,
} from "react-icons/ri";

import "./ReportPreviewModal.css";

const ReportPreviewModal = ({
    isOpen,
    report,
    onClose,
}) => {

    /**
     * Close Modal on ESC
     */

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

    /**
     * No Data
     */

    if (!isOpen || !report) {

        return null;

    }

    /**
     * Live Report Values
     */

    const solarProduction =
        report.solarProduction ??
        report.total_units_generated ??
        report.totalGeneration ??
        "N/A";

    const inverterEfficiency =
        report.inverterEfficiency ??
        report.inverter_efficiency ??
        report.efficiency ??
        "N/A";

    const batteryHealth =
        report.batteryHealth ??
        report.battery_health ??
        "N/A";

    const aiRecommendation =
        report.aiRecommendation ??
        report.ai_recommendation ??
        report.recommendation ??
        "No Recommendation";

    return (

        <div
            className="report-modal-overlay"
            onClick={onClose}
        >

            <div
                className="report-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* ===========================
                    Header
                ============================ */}

                <div className="report-modal-header">

                    <h2>

                        Report Preview

                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                    >

                        <RiCloseLine />

                    </button>

                </div>

                {/* ===========================
                    Body
                ============================ */}

                <div className="report-modal-body">

                    <div className="report-info">

                        <h3>

                            {report.reportName}

                        </h3>

                        <p>

                            <strong>
                                Report ID:
                            </strong>

                            {" "}

                            {report.id}

                        </p>

                        <p>

                            <strong>
                                Area:
                            </strong>

                            {" "}

                            {report.area || "-"}

                        </p>

                        <p>

                            <strong>
                                Date:
                            </strong>

                            {" "}

                            {report.generatedDate}

                        </p>

                        <p>

                            <strong>
                                Type:
                            </strong>

                            {" "}

                            {report.reportType}

                        </p>

                        <p>

                            <strong>
                                Status:
                            </strong>

                            {" "}

                            {report.status}

                        </p>

                    </div>

                    {/* ===========================
                        Summary Cards
                    ============================ */}

                    <div className="report-summary-grid">

                        <div className="summary-card">

                            <RiBarChartBoxLine />

                            <h4>

                                Solar Production

                            </h4>

                            <span>

                                {solarProduction}

                            </span>

                        </div>

                        <div className="summary-card">

                            <RiFlashlightLine />

                            <h4>

                                Inverter Efficiency

                            </h4>

                            <span>

                                {inverterEfficiency}

                            </span>

                        </div>
                                                <div className="summary-card">

                            <RiBattery2ChargeLine />

                            <h4>

                                Battery Health

                            </h4>

                            <span>

                                {batteryHealth}

                            </span>

                        </div>

                        <div className="summary-card">

                            <RiLightbulbFlashLine />

                            <h4>

                                AI Recommendation

                            </h4>

                            <span>

                                {aiRecommendation}

                            </span>

                        </div>

                    </div>

                </div>

                {/* ==========================================
                    Footer Removed
                ========================================== */}

            </div>

        </div>

    );

};

export default ReportPreviewModal;