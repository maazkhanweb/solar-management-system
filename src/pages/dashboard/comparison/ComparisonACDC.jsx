import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    RiArrowLeftLine,
    RiUploadCloud2Line,
    RiLoader4Line,
    RiCloseCircleLine,
    RiRefreshLine,
    RiArrowRightLine,
} from "react-icons/ri";

import "./ComparisonACDC.css";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const BILL_FIELDS = [
    {
        key: "consumer_name",
        label: "Consumer Name",
        urdu: "صارف کا نام",
    },
    {
        key: "reference_number",
        label: "Reference Number",
        urdu: "ریفرنس نمبر",
    },
    {
        key: "consumer_id",
        label: "Consumer ID",
        urdu: "صارف آئی ڈی",
    },
    {
        key: "area_name",
        label: "Area Name",
        urdu: "علاقہ",
    },
    {
        key: "tariff_category",
        label: "Tariff Category",
        urdu: "ٹیرف کیٹیگری",
    },
    {
        key: "bill_month",
        label: "Bill Month",
        urdu: "بل کا مہینہ",
        format: (value, data) =>
            value && data?.bill_year
                ? `${getMonthName(value)} ${data.bill_year}`
                : value
                ? getMonthName(value)
                : null,
    },
    {
        key: "issue_date",
        label: "Issue Date",
        urdu: "جاری کرنے کی تاریخ",
    },
    {
        key: "due_date",
        label: "Due Date",
        urdu: "مقررہ تاریخ",
    },
    {
        key: "payable_before_due",
        label: "Payable Before Due",
        urdu: "مقررہ تاریخ سے پہلے قابل ادائیگی رقم",
        money: true,
    },
    {
        key: "payable_after_due",
        label: "Payable After Due",
        urdu: "مقررہ تاریخ کے بعد قابل ادائیگی رقم",
        money: true,
    },
    {
        key: "current_bill",
        label: "Current Bill",
        urdu: "موجودہ بل",
        money: true,
    },
    {
        key: "arrears",
        label: "Arrears",
        urdu: "بقایا جات",
        money: true,
    },
    {
        key: "previous_reading",
        label: "Previous Reading",
        urdu: "پچھلی ریڈنگ",
        number: true,
    },
    {
        key: "present_reading",
        label: "Present Reading",
        urdu: "موجودہ ریڈنگ",
        number: true,
    },
    {
        key: "units_consumed",
        label: "Units Consumed",
        urdu: "کل استعمال شدہ یونٹس",
        number: true,
    },
];

function getMonthName(month) {
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

    const index = Number(month) - 1;

    return months[index] || String(month);
}

function formatValue(field, value, data) {
    if (value === null || value === undefined || value === "") {
        return "Not available";
    }

    if (field.format) {
        const formatted = field.format(value, data);
        return formatted || "Not available";
    }

    if (field.money) {
        const number = Number(value);

        if (!Number.isNaN(number)) {
            return `Rs. ${number.toLocaleString("en-PK")}`;
        }
    }

    if (field.number) {
        const number = Number(value);

        if (!Number.isNaN(number)) {
            return number.toLocaleString("en-PK");
        }
    }

    return String(value);
}

function ComparisonACDC() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [billData, setBillData] = useState(null);

    const handleUploadClick = () => {
        if (uploading) return;

        setErrorMessage("");
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];

        if (!allowedTypes.includes(file.type)) {
            setErrorMessage(
                "صرف JPG, JPEG, PNG, WEBP یا PDF فائل اپ لوڈ کریں۔"
            );
            setSelectedFile(null);
            event.target.value = "";
            return;
        }

        setSelectedFile(file);
        setBillData(null);
        setErrorMessage("");

        await processBillOCR(file);

        event.target.value = "";
    };

    const processBillOCR = async (file) => {
        try {
            setUploading(true);
            setErrorMessage("");

            const formData = new FormData();
            formData.append("bill_file", file);

            const response = await fetch(
                `${API_BASE_URL}/comparison/process-ocr`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                    },
                    body: formData,
                }
            );

            const responseText = await response.text();

            let result = null;

            try {
                result = responseText
                    ? JSON.parse(responseText)
                    : null;
            } catch {
                result = null;
            }

            console.log("AC/DC OCR Response:", result);

            if (!response.ok || !result?.success) {
                throw new Error(
                    result?.message ||
                    result?.error ||
                    responseText ||
                    `Bill OCR failed with status ${response.status}.`
                );
            }

            const extractedData = result?.data || null;

            if (!extractedData || typeof extractedData !== "object") {
                throw new Error(
                    "OCR complete hua hai, lekin bill data response mein nahi mila."
                );
            }

            console.log("AC/DC Bill OCR Data:", extractedData);

            setBillData(extractedData);
            setErrorMessage("");
        } catch (error) {
            console.error("AC/DC Bill OCR Error:", error);

            setBillData(null);
            setErrorMessage(
                error?.message ||
                "Bill OCR process nahi ho saka. Dobara try karein."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleReset = () => {
        if (uploading) return;

        setBillData(null);
        setSelectedFile(null);
        setErrorMessage("");
    };

    const handleBack = () => {
        if (uploading) return;
        navigate("/dashboard");
    };

    const handleContinueSavingsAnalysis = () => {
        if (uploading || !billData) return;

        navigate("/comparison-ac-dc/savings-analysis", {
            state: {
                billData,
                selectedFileName: selectedFile?.name || "",
            },
        });
    };

    return (
        <section className="comparison-acdc-page">
            <div className="comparison-acdc-header">
                <button
                    type="button"
                    className="comparison-back-button"
                    onClick={handleBack}
                    disabled={uploading}
                >
                    <RiArrowLeftLine />
                    Back to Dashboard
                </button>

                <h1>Comparison AC &amp; DC</h1>
            </div>

            {!billData && (
                <div className="comparison-upload-card">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf"
                        className="comparison-hidden-file-input"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />

                    <button
                        type="button"
                        className="comparison-upload-button"
                        onClick={handleUploadClick}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>
                                <RiLoader4Line className="comparison-upload-spinner" />
                                <span>بل کا تجزیہ ہو رہا ہے...</span>
                            </>
                        ) : (
                            <>
                                <RiUploadCloud2Line />
                                <span>بل اپ لوڈ کریں</span>
                            </>
                        )}
                    </button>

                    {selectedFile && !uploading && !errorMessage && (
                        <div className="comparison-selected-file">
                            {selectedFile.name}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="comparison-upload-error">
                            <RiCloseCircleLine />
                            <span>{errorMessage}</span>
                        </div>
                    )}
                </div>
            )}

            {billData && (
                <div className="comparison-results-section">
                    <div className="comparison-results-topbar">
                        <div>
                            <span className="comparison-results-eyebrow">
                                OCR RESULT
                            </span>
                            <h2>Electricity Bill Details</h2>
                            <p>
                                Bill information successfully extracted from the uploaded document.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="comparison-reset-button"
                            onClick={handleReset}
                        >
                            <RiRefreshLine />
                            Upload Another Bill
                        </button>
                    </div>

                    {selectedFile && (
                        <div className="comparison-file-badge">
                            <span>Uploaded File</span>
                            <strong>{selectedFile.name}</strong>
                        </div>
                    )}

                    <div className="comparison-results-grid">
                        {BILL_FIELDS.map((field) => (
                            <article
                                className="comparison-data-card"
                                key={field.key}
                            >
                                <div className="comparison-data-label">
                                    {field.label}
                                </div>
                                <div className="comparison-data-urdu">
                                    {field.urdu}
                                </div>
                                <div className="comparison-data-value">
                                    {formatValue(
                                        field,
                                        billData[field.key],
                                        billData
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="comparison-ocr-status-card">
                        <div>
                            <span>OCR Status</span>
                            <strong>
                                {billData.ocr_status ? "Completed" : "Not completed"}
                            </strong>
                        </div>

                        <div>
                            <span>OCR Confidence</span>
                            <strong>
                                {billData.ocr_confidence !== null &&
                                billData.ocr_confidence !== undefined
                                    ? `${billData.ocr_confidence}%`
                                    : "Not available"}
                            </strong>
                        </div>
                    </div>

                    <div className="comparison-savings-action">
                        <button
                            type="button"
                            className="comparison-savings-button"
                            onClick={handleContinueSavingsAnalysis}
                            disabled={uploading}
                        >
                            <span>Continue to Savings Analysis</span>
                            <RiArrowRightLine />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ComparisonACDC;
