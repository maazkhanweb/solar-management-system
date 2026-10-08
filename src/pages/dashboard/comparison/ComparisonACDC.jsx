import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    RiArrowLeftLine,
    RiBarChartBoxLine,
    RiCheckLine,
    RiCloseLine,
    RiDeleteBinLine,
    RiEditLine,
    RiEyeLine,
    RiFileList3Line,
    RiFileUploadLine,
    RiHome4Line,
    RiLoader4Line,
    RiRefreshLine,
    RiSaveLine,
    RiSearchLine,
} from "react-icons/ri";

import comparisonBillService from "../../../services/comparisonBillService";

import "./ComparisonACDC.css";


/* ============================================================================
   HELPERS
============================================================================ */

const getNumber = (value, fallback = 0) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    const parsed = Number(
        String(value).replace(/,/g, "")
    );

    return Number.isFinite(parsed)
        ? parsed
        : fallback;
};


const formatNumber = (value, decimals = 0) => {
    const number = getNumber(value, 0);

    return number.toLocaleString(
        "en-US",
        {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }
    );
};


const displayValue = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    if (
        typeof value === "number"
    ) {
        return formatNumber(value, 2);
    }

    return String(value);
};


const getUser = () => {
    try {
        const raw =
            localStorage.getItem("user") ||
            sessionStorage.getItem("user");

        if (!raw) {
            return null;
        }

        return JSON.parse(raw);
    } catch {
        return null;
    }
};


const isAdminUser = () => {
    const user = getUser();

    if (!user) {
        return false;
    }

    const role = String(
        user.role ||
        user.user_role ||
        user.type ||
        ""
    ).toLowerCase();

    return [
        "admin",
        "administrator",
        "superadmin",
        "super_admin",
    ].includes(role);
};


const unwrapResponseData = (response) => {
    if (!response) {
        return null;
    }

    if (
        response.data &&
        typeof response.data === "object" &&
        !Array.isArray(response.data)
    ) {
        return response.data;
    }

    return response;
};


const extractBillList = (response) => {
    const payload = unwrapResponseData(response);

    if (!payload) {
        return [];
    }

    if (Array.isArray(payload)) {
        return payload;
    }

    if (
        payload.data &&
        Array.isArray(payload.data)
    ) {
        return payload.data;
    }

    if (
        payload.data?.data &&
        Array.isArray(payload.data.data)
    ) {
        return payload.data.data;
    }

    if (
        payload.comparison_bills &&
        Array.isArray(payload.comparison_bills)
    ) {
        return payload.comparison_bills;
    }

    if (
        payload.bills &&
        Array.isArray(payload.bills)
    ) {
        return payload.bills;
    }

    return [];
};


const extractSingleBill = (response) => {
    const payload = unwrapResponseData(response);

    if (!payload) {
        return null;
    }

    if (
        payload.data &&
        !Array.isArray(payload.data)
    ) {
        return payload.data;
    }

    if (payload.bill) {
        return payload.bill;
    }

    return payload;
};


const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong."
    );
};


/* ============================================================================
   COMPLETE OCR FIELD DEFINITIONS

   These are intentionally broad so the frontend can display fields that
   Gemini extracted without destroying existing OCR data.
============================================================================ */

const standardOCRFields = [
    ["utility_provider", "Utility Provider"],
    ["bill_type", "Bill Type"],

    // Summary cards mein already shown:
    // consumer_name
    // reference_number

    ["father_or_husband_name", "Father / Husband Name"],
    ["consumer_id", "Consumer ID"],
    ["account_number", "Account Number"],
    ["bill_number", "Bill Number"],
    ["meter_number", "Meter Number"],

    // area_name summary mein Area ke naam se already shown
    ["bill_address", "Bill Address"],
    ["tariff_category", "Tariff Category"],
    ["connection_type", "Connection Type"],
    ["phase", "Phase"],
    ["feeder", "Feeder"],
    ["subdivision", "Subdivision"],
    ["division", "Division"],
    ["circle", "Circle"],

    // bill_month summary mein already shown
    ["bill_year", "Bill Year"],
    ["billing_period", "Billing Period"],
    ["billing_days", "Billing Days"],
    ["connection_date", "Connection Date"],
    ["issue_date", "Issue Date"],
    ["reading_date", "Reading Date"],
    ["due_date", "Due Date"],

    ["payable_before_due", "Payable Before Due"],
    ["payable_after_due", "Payable After Due"],

    // current_bill summary mein Bill Amount ke naam se already shown
    ["arrears", "Arrears"],

    // units_consumed summary mein Units ke naam se already shown
    ["previous_reading", "Previous Reading"],
    ["present_reading", "Present Reading"],

    ["sanctioned_load", "Sanctioned Load"],
    ["meter_status", "Meter Status"],
    ["reading_status", "Reading Status"],
    ["load", "Load"],
    ["multiplying_factor", "Multiplying Factor"],
];

/* ============================================================================
   COMPONENT
============================================================================ */

function ComparisonACDC() {

    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    const [language, setLanguage] =
        useState("en");

    const [activeSection, setActiveSection] =
        useState("bills");

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [ocrResult, setOCRResult] =
        useState(null);

    const [bills, setBills] =
        useState([]);

    const [selectedBill, setSelectedBill] =
        useState(null);

    const [viewBill, setViewBill] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [ocrLoading, setOCRLoading] =
        useState(false);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [showEditModal, setShowEditModal] =
        useState(false);

    const [editForm, setEditForm] =
        useState({});


    const admin =
        useMemo(
            () => isAdminUser(),
            []
        );


    /* =========================================================================
       TEXT
    ========================================================================= */

    const t = {
        title:
            language === "ur"
                ? "AC اور DC موازنہ"
                : "Comparison AC & DC",

        subtitle:
            language === "ur"
                ? "بجلی کے بل اور گھریلو توانائی کا تجزیہ"
                : "Electricity bill storage and home energy analysis",

        back:
            language === "ur"
                ? "ڈیش بورڈ پر واپس"
                : "Back to Dashboard",

        billUpload:
            language === "ur"
                ? "بل اپ لوڈ"
                : "Bill Upload",

        billUploadSub:
            language === "ur"
                ? "OCR بل اپ لوڈ اور محفوظ کریں"
                : "Upload and save OCR bill",

        homeAnalysis:
            language === "ur"
                ? "گھر کا تجزیہ"
                : "Home Analysis",

        homeAnalysisSub:
            language === "ur"
                ? "آلات کے لوڈ کا تجزیہ"
                : "Analyze appliance load",

        refresh:
            language === "ur"
                ? "ریفریش"
                : "Refresh",

        history:
            language === "ur"
                ? "بل اپ لوڈ ہسٹری"
                : "Bill Upload History",

        upload:
            language === "ur"
                ? "بل اپ لوڈ کریں"
                : "Upload Bill",

        choose:
            language === "ur"
                ? "بجلی کے بل کی تصویر منتخب کریں"
                : "Select electricity bill image",

        noRecords:
            language === "ur"
                ? "کوئی موازنہ بل موجود نہیں"
                : "No comparison bills found",

        noRecordsSub:
            language === "ur"
                ? "پہلا ریکارڈ بنانے کے لیے بل اپ لوڈ کریں۔"
                : "Upload a bill to create the first saved record.",

        account:
            language === "ur"
                ? "اکاؤنٹ / Gmail"
                : "Gmail / Account",

        consumer:
            language === "ur"
                ? "صارف"
                : "Consumer",

        reference:
            language === "ur"
                ? "ریفرنس"
                : "Reference",

        area:
            language === "ur"
                ? "علاقہ"
                : "Area",

        month:
            language === "ur"
                ? "مہینہ"
                : "Month",

        units:
            language === "ur"
                ? "یونٹس"
                : "Units",

        bill:
            language === "ur"
                ? "بل"
                : "Bill",

        homeSaved:
            language === "ur"
                ? "گھر کا تجزیہ محفوظ"
                : "Home Analysis",

        actions:
            language === "ur"
                ? "ایکشنز"
                : "Actions",

        view:
            language === "ur"
                ? "دیکھیں"
                : "View",

        edit:
            language === "ur"
                ? "ترمیم"
                : "Edit",

        delete:
            language === "ur"
                ? "حذف"
                : "Delete",

        uploadResult:
            language === "ur"
                ? "بجلی کے بل کی تفصیلات"
                : "Electricity Bill Details",

        home:
            language === "ur"
                ? "گھر کا تجزیہ"
                : "Home Analysis",

        completeOCR:
            language === "ur"
                ? "مکمل OCR ڈیٹا"
                : "Complete OCR Data",

        close:
            language === "ur"
                ? "بند کریں"
                : "Close",

        save:
            language === "ur"
                ? "محفوظ کریں"
                : "Save",

        cancel:
            language === "ur"
                ? "منسوخ"
                : "Cancel",

        search:
            language === "ur"
                ? "تلاش کریں..."
                : "Search...",

        loading:
            language === "ur"
                ? "لوڈ ہو رہا ہے..."
                : "Loading...",

        processing:
            language === "ur"
                ? "OCR پراسیس ہو رہا ہے..."
                : "Processing OCR...",

        homeNotAdded:
            language === "ur"
                ? "شامل نہیں"
                : "Not added",

        openHome:
            language === "ur"
                ? "گھر کا تجزیہ کھولیں"
                : "Open Home Analysis",
    };


    /* =========================================================================
       LOAD SAVED BILLS
    ========================================================================= */

    const loadBills = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await comparisonBillService.getBills();

            const list =
                extractBillList(response);

            setBills(list);
            return list;

        } catch (err) {

            console.error(
                "Comparison bills loading error:",
                err
            );

            setError(
                getErrorMessage(err)
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadBills();

    }, []);


    /* =========================================================================
       FILE SELECT
    ========================================================================= */

    const handleFileChange = (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setSelectedFile(file);
        setError("");
        setSuccess("");
        setOCRResult(null);

    };


    /* =========================================================================
       OCR
    ========================================================================= */

    const processBillOCR = async () => {

        if (!selectedFile) {

            setError(
                language === "ur"
                    ? "براہ کرم پہلے بل منتخب کریں۔"
                    : "Please select an electricity bill."
            );

            return;

        }

        try {

            setOCRLoading(true);
            setError("");
            setSuccess("");

            const response =
                await comparisonBillService.processOCR(
                    selectedFile
                );

            const result =
                response?.data ||
                response?.bill ||
                response;

            setOCRResult(result);

            setSuccess(
                language === "ur"
                    ? "بل کا OCR کامیابی سے مکمل ہوگیا اور ریکارڈ محفوظ ہوگیا۔"
                    : "Bill OCR completed and the record was saved successfully."
            );

            await loadBills();

        } catch (err) {

            console.error(
                "AC/DC OCR error:",
                err
            );

            setError(
                getErrorMessage(err)
            );

        } finally {

            setOCRLoading(false);

        }
    };


    /* =========================================================================
       VIEW BILL
    ========================================================================= */

    const handleViewBill = async (bill) => {

        try {

            setActionLoading(true);
            setError("");

            const response =
                await comparisonBillService.getBill(
                    bill.id
                );

            const completeBill =
                extractSingleBill(response);

            setViewBill(
                completeBill || bill
            );

        } catch (err) {

            console.error(
                "View comparison bill error:",
                err
            );

            setError(
                getErrorMessage(err)
            );

        } finally {

            setActionLoading(false);

        }
    };


    /* =========================================================================
       EDIT BILL
    ========================================================================= */

    const handleEditBill = async (bill) => {

        if (!admin) {
            return;
        }

        try {

            setActionLoading(true);
            setError("");

            const response =
                await comparisonBillService.getBill(
                    bill.id
                );

            const completeBill =
                extractSingleBill(response);

            setSelectedBill(
                completeBill || bill
            );

            setEditForm(
                completeBill || bill
            );

            setShowEditModal(true);

        } catch (err) {

            console.error(
                "Edit comparison bill error:",
                err
            );

            setError(
                getErrorMessage(err)
            );

        } finally {

            setActionLoading(false);

        }
    };


    /* =========================================================================
       EDIT FORM CHANGE
    ========================================================================= */

    const handleEditChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setEditForm(
            previous => ({
                ...previous,
                [name]: value,
            })
        );

    };


    /* =========================================================================
       SAVE EDIT
    ========================================================================= */

    const handleSaveEdit = async () => {

        if (!selectedBill?.id) {
            return;
        }

        try {

            setActionLoading(true);
            setError("");

            await comparisonBillService.updateBill(
                selectedBill.id,
                editForm
            );

            setSuccess(
                language === "ur"
                    ? "بل کامیابی سے اپڈیٹ ہوگیا۔"
                    : "Bill updated successfully."
            );

            setShowEditModal(false);
            setSelectedBill(null);

            await loadBills();

        } catch (err) {

            console.error(
                "Update comparison bill error:",
                err
            );

            setError(
                getErrorMessage(err)
            );

        } finally {

            setActionLoading(false);

        }
    };


    /* =========================================================================
       DELETE
    ========================================================================= */

    const handleDeleteBill = async (bill) => {

        if (!admin) {
            return;
        }

        const confirmed =
            window.confirm(
                language === "ur"
                    ? "کیا آپ واقعی اس بل کو حذف کرنا چاہتے ہیں؟"
                    : "Are you sure you want to delete this bill?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);
            setError("");

            await comparisonBillService.deleteBill(
                bill.id
            );

            setSuccess(
                language === "ur"
                    ? "بل کامیابی سے حذف ہوگیا۔"
                    : "Bill deleted successfully."
            );

            if (
                viewBill?.id === bill.id
            ) {
                setViewBill(null);
            }

            await loadBills();

        } catch (err) {

            console.error(
                "Delete comparison bill error:",
                err
            );

            setError(
                getErrorMessage(err)
            );

        } finally {

            setActionLoading(false);

        }
    };


    /* =========================================================================
       OPEN HOME ANALYSIS
    ========================================================================= */

    const openHomeAnalysis = (
        bill = null
    ) => {

        navigate(
            "/savings-analysis",
            {
                state: {
                    comparisonBill:
                        bill,

                    billData:
                        bill?.ocr_data ||
                        bill ||
                        ocrResult ||
                        null,

                    comparisonBillId:
                        bill?.id ||
                        null,
                },
            }
        );

    };


    /* =========================================================================
       OCR RESULT HOME ANALYSIS
    ========================================================================= */

    const handleOCRHomeAnalysis = async () => {

        if (!ocrResult) {
            openHomeAnalysis();
            return;
        }

        /*
         * OCR endpoint already creates/saves the comparison bill.
         * Refresh list and use the newest matching record.
         */

        try {

            const latestBills = await loadBills();

            const reference =
                ocrResult?.reference_number ||
                ocrResult?.data?.reference_number ||
                ocrResult?.ocr_data?.reference_number;

            const matching =
                latestBills?.find(
                    item =>
                        String(
                            item.reference_number
                        ) === String(reference)
                );

            openHomeAnalysis(
                matching || ocrResult
            );

        } catch {

            openHomeAnalysis(
                ocrResult
            );

        }
    };


    /* =========================================================================
       SEARCH
    ========================================================================= */

    const filteredBills =
        useMemo(() => {

            const term =
                search
                    .trim()
                    .toLowerCase();

            if (!term) {
                return bills;
            }

            return bills.filter(
                bill => {

                    const searchable = [
                        bill.account_email,
                        bill.email,
                        bill.user_email,
                        bill.consumer_name,
                        bill.reference_number,
                        bill.area_name,
                        bill.area,
                        bill.bill_month,
                        bill.bill_year,
                        bill.units_consumed,
                        bill.units,
                    ]
                        .filter(
                            value =>
                                value !==
                                    null &&
                                value !==
                                    undefined
                        )
                        .join(" ")
                        .toLowerCase();

                    return searchable.includes(
                        term
                    );
                }
            );

        }, [bills, search]);


    /* =========================================================================
       BILL DATA NORMALIZATION
    ========================================================================= */

    const getBillEmail = (bill) => {

        return (
            bill?.account_email ||
            bill?.user_email ||
            bill?.email ||
            bill?.user?.email ||
            "—"
        );
    };


    const getBillArea = (bill) => {

        return (
            bill?.area_name ||
            bill?.area ||
            "—"
        );
    };


    const getBillMonth = (bill) => {

        return (
            bill?.bill_month ||
            bill?.month ||
            "—"
        );
    };


    const getBillUnits = (bill) => {

        return (
            bill?.units_consumed ??
            bill?.units ??
            0
        );
    };


    const getBillAmount = (bill) => {

        return (
            bill?.current_bill ??
            bill?.bill_amount ??
            bill?.payable_before_due ??
            0
        );
    };


    const hasHomeAnalysis = (bill) => {

        return Boolean(
            bill?.home_analysis_data ||
            bill?.home_analysis_result ||
            bill?.home_analysis
        );

    };


    /* =========================================================================
       OCR DATA
    ========================================================================= */

    const currentOCR =
        viewBill?.ocr_data ||
        viewBill ||
        ocrResult?.ocr_data ||
        ocrResult ||
        null;


    const chargeBreakdown =
        currentOCR?.charge_breakdown;

    const additionalFields =
        currentOCR?.additional_fields;


    /* =========================================================================
       RENDER STANDARD OCR FIELDS
    ========================================================================= */

   const renderOCRFields = (data) => {

    if (!data) {
        return null;
    }

    return (
        <div className="comparison-ocr-grid">

            {standardOCRFields.map(
                ([key, label]) => {

                    const value = data[key];

                    if (
                        value === null ||
                        value === undefined ||
                        value === ""
                    ) {
                        return null;
                    }

                    return (
                        <div
                            className="comparison-ocr-card"
                            key={key}
                        >

                            <span>
                                {label}
                            </span>

                            <strong>
                                {displayValue(value)}
                            </strong>

                        </div>
                    );
                }
            )}

        </div>
    );
};

    /* =========================================================================
       RENDER CHARGE BREAKDOWN
    ========================================================================= */

    const renderChargeBreakdown = () => {

        if (
            !Array.isArray(
                chargeBreakdown
            ) ||
            chargeBreakdown.length === 0
        ) {
            return null;
        }

        return (

            <section className="comparison-detail-section">

                <div className="comparison-section-heading">

                    <div>
                        <small>
                            CHARGES
                        </small>

                        <h3>
                            Charge Breakdown
                        </h3>
                    </div>

                </div>

                <div className="comparison-charge-table-wrap">

                    <table className="comparison-charge-table">

                        <thead>

                            <tr>

                                <th>
                                    Charge
                                </th>

                                <th>
                                    Amount
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {chargeBreakdown.map(
                                (row, index) => (

                                    <tr
                                        key={
                                            `${row?.label || row?.name || "charge"}-${index}`
                                        }
                                    >

                                        <td>
                                            {
                                                row?.label ||
                                                row?.name ||
                                                row?.title ||
                                                "—"
                                            }
                                        </td>

                                        <td>
                                            {
                                                row?.amount ??
                                                row?.value ??
                                                "—"
                                            }
                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </section>

        );
    };


    /* =========================================================================
       RENDER ADDITIONAL FIELDS
    ========================================================================= */

    const renderAdditionalFields = () => {

        if (
            !additionalFields ||
            typeof additionalFields !==
                "object"
        ) {
            return null;
        }

        const entries =
            Object.entries(
                additionalFields
            );

        if (!entries.length) {
            return null;
        }

        return (

            <section className="comparison-detail-section">

                <div className="comparison-section-heading">

                    <div>

                        <small>
                            ADDITIONAL OCR
                        </small>

                        <h3>
                            Additional Bill Information
                        </h3>

                    </div>

                </div>

                <div className="comparison-ocr-grid">

                    {entries.map(
                        ([key, value]) => (

                            <div
                                className="comparison-ocr-card"
                                key={key}
                            >

                                <span>
                                    {key
                                        .replace(
                                            /_/g,
                                            " "
                                        )}
                                </span>

                                <strong>
                                    {typeof value ===
                                        "object"
                                        ? JSON.stringify(
                                            value
                                        )
                                        : displayValue(
                                            value
                                        )}
                                </strong>

                            </div>

                        )
                    )}

                </div>

            </section>

        );
    };


    /* =========================================================================
       BILL RESULT PANEL
    ========================================================================= */

    const renderBillDetails = (
        bill,
        isSavedResult = false
    ) => {

        if (!bill) {
            return null;
        }

        const data =
            bill?.ocr_data ||
            bill?.data ||
            bill;


        return (

            <section className="comparison-result-section">

                <div className="comparison-result-header">

                    <div>

                        <small>
                            {isSavedResult
                                ? "SAVED OCR RESULT"
                                : "OCR RESULT"}
                        </small>

                        <h2>
                            {t.uploadResult}
                        </h2>

                        <p>
                            Bill information extracted from
                            the uploaded document.
                        </p>

                    </div>

                    <div className="comparison-result-actions">

                        <button
                            type="button"
                            className="comparison-secondary-btn"
                            onClick={() =>
                                openHomeAnalysis(
                                    bill
                                )
                            }
                        >
                            <RiHome4Line />

                            {t.home}
                        </button>

                    </div>

                </div>

                <div className="comparison-summary-grid">

                    <div className="comparison-summary-card">

                        <span>
                            Account / Gmail
                        </span>

                        <strong>
                            {getBillEmail(
                                bill
                            )}
                        </strong>

                    </div>

                    <div className="comparison-summary-card">

                        <span>
                            Consumer Name
                        </span>

                        <strong>
                            {displayValue(
                                data?.consumer_name ||
                                bill?.consumer_name
                            )}
                        </strong>

                    </div>

                    <div className="comparison-summary-card">

                        <span>
                            Reference Number
                        </span>

                        <strong>
                            {displayValue(
                                data?.reference_number ||
                                bill?.reference_number
                            )}
                        </strong>

                    </div>

                    <div className="comparison-summary-card">

                        <span>
                            Area
                        </span>

                        <strong>
                            {getBillArea(
                                bill
                            )}
                        </strong>

                    </div>

                    <div className="comparison-summary-card">

                        <span>
                            Bill Month
                        </span>

                        <strong>
                            {getBillMonth(
                                bill
                            )}
                        </strong>

                    </div>

                    <div className="comparison-summary-card">

                        <span>
                            Units
                        </span>

                        <strong>
                            {formatNumber(
                                getBillUnits(
                                    bill
                                ),
                                2
                            )}
                        </strong>

                    </div>

                    <div className="comparison-summary-card">

                        <span>
                            Bill Amount
                        </span>

                        <strong>
                            {formatNumber(
                                getBillAmount(
                                    bill
                                ),
                                2
                            )}
                        </strong>

                    </div>

                </div>

                {renderOCRFields(data)}

                {renderChargeBreakdown()}

                {renderAdditionalFields()}

                <div className="comparison-complete-data">

                    <div>

                        <RiFileList3Line />

                        <div>

                            <strong>
                                {t.completeOCR}
                            </strong>

                            <span>
                                Complete OCR data is stored
                                with this comparison bill.
                            </span>

                        </div>

                    </div>

                </div>

                <div className="comparison-result-footer">

                    <button
                        type="button"
                        className="comparison-primary-btn"
                        onClick={() =>
                            openHomeAnalysis(
                                bill
                            )
                        }
                    >
                        <RiHome4Line />

                        {t.openHome}

                    </button>

                </div>

            </section>

        );

    };


    /* =========================================================================
       UPLOAD SECTION
    ========================================================================= */

    const renderUploadSection = () => {

        return (

            <section className="comparison-upload-section">

                <div className="comparison-section-top">

                    <div>

                        <small>
                            OCR BILL
                        </small>

                        <h2>
                            {t.billUpload}
                        </h2>

                        <p>
                            Upload your electricity bill
                            and extract the complete visible
                            bill information.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="comparison-primary-btn"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                    >
                        <RiFileUploadLine />

                        {t.choose}
                    </button>

                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                    onChange={
                        handleFileChange
                    }
                />

                {selectedFile && (

                    <div className="comparison-selected-file">

                        <div>

                            <RiFileList3Line />

                            <div>

                                <strong>
                                    {selectedFile.name}
                                </strong>

                                <span>
                                    {(
                                        selectedFile.size /
                                        1024
                                    ).toFixed(1)} KB
                                </span>

                            </div>

                        </div>

                        <button
                            type="button"
                            className="comparison-primary-btn"
                            disabled={ocrLoading}
                            onClick={
                                processBillOCR
                            }
                        >

                            {ocrLoading ? (
                                <>
                                    <RiLoader4Line className="comparison-spin" />

                                    {t.processing}
                                </>
                            ) : (
                                <>
                                    <RiFileUploadLine />

                                    {t.upload}
                                </>
                            )}

                        </button>

                    </div>

                )}

                {ocrResult &&
                    renderBillDetails(
                        ocrResult
                    )}

            </section>

        );

    };


    /* =========================================================================
       BILL TABLE
    ========================================================================= */

    const renderBillTable = () => {

        return (

            <section className="comparison-history-section">

                <div className="comparison-history-header">

                    <div>

                        <small>
                            SAVED RECORDS
                        </small>

                        <h2>
                            {t.history}
                        </h2>

                    </div>

                    <div className="comparison-history-tools">

                        <div className="comparison-search">

                            <RiSearchLine />

                            <input
                                type="text"
                                placeholder={
                                    t.search
                                }
                                value={search}
                                onChange={
                                    event =>
                                        setSearch(
                                            event.target.value
                                        )
                                }
                            />

                        </div>

                        <span className="comparison-count">
                            {filteredBills.length}
                        </span>

                    </div>

                </div>

                {loading ? (

                    <div className="comparison-empty-state">

                        <RiLoader4Line className="comparison-spin" />

                        <strong>
                            {t.loading}
                        </strong>

                    </div>

                ) : filteredBills.length === 0 ? (

                    <div className="comparison-empty-state">

                        <RiFileList3Line />

                        <strong>
                            {t.noRecords}
                        </strong>

                        <span>
                            {t.noRecordsSub}
                        </span>

                    </div>

                ) : (

                    <div className="comparison-table-wrapper">

                        <table className="comparison-bill-table">

                            <thead>

                                <tr>

                                    <th>
                                        {t.account}
                                    </th>

                                    <th>
                                        {t.consumer}
                                    </th>

                                    <th>
                                        {t.reference}
                                    </th>

                                    <th>
                                        {t.area}
                                    </th>

                                    <th>
                                        {t.month}
                                    </th>

                                    <th>
                                        {t.units}
                                    </th>

                                    <th>
                                        {t.bill}
                                    </th>

                                    <th>
                                        {t.homeSaved}
                                    </th>

                                    <th>
                                        {t.actions}
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredBills.map(
                                    bill => (

                                        <tr
                                            key={
                                                bill.id
                                            }
                                        >

                                            <td>
                                                {
                                                    getBillEmail(
                                                        bill
                                                    )
                                                }
                                            </td>

                                            <td>
                                                {
                                                    bill.consumer_name ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    bill.reference_number ||
                                                    "—"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    getBillArea(
                                                        bill
                                                    )
                                                }
                                            </td>

                                            <td>
                                                {
                                                    getBillMonth(
                                                        bill
                                                    )
                                                }
                                            </td>

                                            <td>
                                                {formatNumber(
                                                    getBillUnits(
                                                        bill
                                                    ),
                                                    2
                                                )}
                                            </td>

                                            <td>
                                                {formatNumber(
                                                    getBillAmount(
                                                        bill
                                                    ),
                                                    2
                                                )}
                                            </td>

                                            <td>

                                                {hasHomeAnalysis(
                                                    bill
                                                ) ? (

                                                    <button
                                                        type="button"
                                                        className="comparison-home-status saved"
                                                        onClick={() =>
                                                            openHomeAnalysis(
                                                                bill
                                                            )
                                                        }
                                                    >
                                                        <RiCheckLine />

                                                        Saved
                                                    </button>

                                                ) : (

                                                    <button
                                                        type="button"
                                                        className="comparison-home-status"
                                                        onClick={() =>
                                                            openHomeAnalysis(
                                                                bill
                                                            )
                                                        }
                                                    >
                                                        {t.homeSaved}
                                                    </button>

                                                )}

                                            </td>

                                            <td>

                                                <div className="comparison-actions">

                                                    <button
                                                        type="button"
                                                        title={
                                                            t.view
                                                        }
                                                        onClick={() =>
                                                            handleViewBill(
                                                                bill
                                                            )
                                                        }
                                                    >
                                                        <RiEyeLine />
                                                    </button>

                                                    {admin && (

                                                        <>

                                                            <button
                                                                type="button"
                                                                title={
                                                                    t.edit
                                                                }
                                                                onClick={() =>
                                                                    handleEditBill(
                                                                        bill
                                                                    )
                                                                }
                                                            >
                                                                <RiEditLine />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                title={
                                                                    t.delete
                                                                }
                                                                className="danger"
                                                                onClick={() =>
                                                                    handleDeleteBill(
                                                                        bill
                                                                    )
                                                                }
                                                            >
                                                                <RiDeleteBinLine />
                                                            </button>

                                                        </>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        );

    };


    /* =========================================================================
       EDIT MODAL
    ========================================================================= */

    const renderEditModal = () => {

        if (!showEditModal) {
            return null;
        }

        return (

            <div className="comparison-modal-overlay">

                <div className="comparison-modal">

                    <div className="comparison-modal-header">

                        <div>

                            <small>
                                ADMIN
                            </small>

                            <h2>
                                Edit Comparison Bill
                            </h2>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setShowEditModal(
                                    false
                                )
                            }
                        >
                            <RiCloseLine />
                        </button>

                    </div>

                    <div className="comparison-edit-grid">

                        {[
                            [
                                "consumer_name",
                                "Consumer Name",
                            ],
                            [
                                "reference_number",
                                "Reference Number",
                            ],
                            [
                                "consumer_id",
                                "Consumer ID",
                            ],
                            [
                                "account_number",
                                "Account Number",
                            ],
                            [
                                "bill_number",
                                "Bill Number",
                            ],
                            [
                                "meter_number",
                                "Meter Number",
                            ],
                            [
                                "area_name",
                                "Area Name",
                            ],
                            [
                                "tariff_category",
                                "Tariff Category",
                            ],
                            [
                                "bill_month",
                                "Bill Month",
                            ],
                            [
                                "bill_year",
                                "Bill Year",
                            ],
                            [
                                "issue_date",
                                "Issue Date",
                            ],
                            [
                                "due_date",
                                "Due Date",
                            ],
                            [
                                "payable_before_due",
                                "Payable Before Due",
                            ],
                            [
                                "payable_after_due",
                                "Payable After Due",
                            ],
                            [
                                "current_bill",
                                "Current Bill",
                            ],
                            [
                                "arrears",
                                "Arrears",
                            ],
                            [
                                "previous_reading",
                                "Previous Reading",
                            ],
                            [
                                "present_reading",
                                "Present Reading",
                            ],
                            [
                                "units_consumed",
                                "Units Consumed",
                            ],
                        ].map(
                            ([name, label]) => (

                                <label
                                    className="comparison-edit-field"
                                    key={name}
                                >

                                    <span>
                                        {label}
                                    </span>

                                    <input
                                        name={name}
                                        value={
                                            editForm?.[
                                                name
                                            ] ??
                                            ""
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />

                                </label>

                            )
                        )}

                    </div>

                    <div className="comparison-modal-footer">

                        <button
                            type="button"
                            className="comparison-cancel-btn"
                            onClick={() =>
                                setShowEditModal(
                                    false
                                )
                            }
                        >
                            {t.cancel}
                        </button>

                        <button
                            type="button"
                            className="comparison-primary-btn"
                            disabled={
                                actionLoading
                            }
                            onClick={
                                handleSaveEdit
                            }
                        >

                            {actionLoading ? (
                                <RiLoader4Line className="comparison-spin" />
                            ) : (
                                <RiSaveLine />
                            )}

                            {t.save}

                        </button>

                    </div>

                </div>

            </div>

        );
    };


    /* =========================================================================
       VIEW MODAL
    ========================================================================= */

    const renderViewModal = () => {

        if (!viewBill) {
            return null;
        }

        return (

            <div className="comparison-modal-overlay">

                <div className="comparison-view-modal">

                    <div className="comparison-modal-header">

                        <div>

                            <small>
                                SAVED OCR RESULT
                            </small>

                            <h2>
                                {t.completeOCR}
                            </h2>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setViewBill(
                                    null
                                )
                            }
                        >
                            <RiCloseLine />
                        </button>

                    </div>

                    <div className="comparison-view-content">

                        {renderBillDetails(
                            viewBill,
                            true
                        )}

                        {(viewBill.home_analysis_data ||
                            viewBill.home_analysis_result) && (

                            <section className="comparison-detail-section">

                                <div className="comparison-section-heading">

                                    <div>

                                        <small>
                                            HOME ANALYSIS
                                        </small>

                                        <h3>
                                            Saved Home Analysis
                                        </h3>

                                    </div>

                                    <button
                                        type="button"
                                        className="comparison-secondary-btn"
                                        onClick={() =>
                                            openHomeAnalysis(
                                                viewBill
                                            )
                                        }
                                    >
                                        <RiHome4Line />

                                        {t.home}
                                    </button>

                                </div>

                                <div className="comparison-home-json">

                                    <pre>
                                        {JSON.stringify(
                                            {
                                                home_data:
                                                    viewBill.home_analysis_data,

                                                home_result:
                                                    viewBill.home_analysis_result,
                                            },
                                            null,
                                            2
                                        )}
                                    </pre>

                                </div>

                            </section>

                        )}

                    </div>

                    <div className="comparison-modal-footer">

                        <button
                            type="button"
                            className="comparison-primary-btn"
                            onClick={() =>
                                setViewBill(
                                    null
                                )
                            }
                        >
                            {t.close}
                        </button>

                    </div>

                </div>

            </div>

        );
    };


    /* =========================================================================
       MAIN RENDER
    ========================================================================= */

    return (

        <div
            className={`comparison-acdc-page ${
                language === "ur"
                    ? "comparison-urdu"
                    : ""
            }`}
        >

            {/* HEADER */}

            <div className="comparison-page-header">

                <button
                    type="button"
                    className="comparison-back-btn"
                    onClick={() =>
                        navigate(
                            "/dashboard"
                        )
                    }
                >
                    <RiArrowLeftLine />

                    {t.back}
                </button>

                <div className="comparison-title-wrap">

                    <div className="comparison-title-icon">

                        <RiBarChartBoxLine />

                    </div>

                    <div>

                        <h1>
                            {t.title}
                        </h1>

                        <p>
                            {t.subtitle}
                        </p>

                    </div>

                </div>

                <div className="comparison-language">

                    <button
                        type="button"
                        className={
                            language === "en"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setLanguage(
                                "en"
                            )
                        }
                    >
                        English
                    </button>

                    <span>
                        |
                    </span>

                    <button
                        type="button"
                        className={
                            language === "ur"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setLanguage(
                                "ur"
                            )
                        }
                    >
                        اردو
                    </button>

                </div>

            </div>


            {/* TOP ACTIONS */}

            <div className="comparison-top-actions">

                <button
                    type="button"
                    className={
                        activeSection ===
                            "upload"
                            ? "comparison-top-card active"
                            : "comparison-top-card"
                    }
                    onClick={() => {
                        setActiveSection(
                            "upload"
                        );
                        setError("");
                    }}
                >

                    <RiFileUploadLine />

                    <div>

                        <strong>
                            {t.billUpload}
                        </strong>

                        <span>
                            {t.billUploadSub}
                        </span>

                    </div>

                </button>


                <button
                    type="button"
                    className="comparison-top-card"
                    onClick={() =>
                        openHomeAnalysis()
                    }
                >

                    <RiHome4Line />

                    <div>

                        <strong>
                            {t.homeAnalysis}
                        </strong>

                        <span>
                            {t.homeAnalysisSub}
                        </span>

                    </div>

                </button>


                <button
                    type="button"
                    className="comparison-top-card"
                    onClick={() =>
                        loadBills()
                    }
                    disabled={
                        loading
                    }
                >

                    {loading ? (
                        <RiLoader4Line className="comparison-spin" />
                    ) : (
                        <RiRefreshLine />
                    )}

                    <div>

                        <strong>
                            {t.refresh}
                        </strong>

                        <span>
                            Reload saved records
                        </span>

                    </div>

                </button>

            </div>


            {/* ALERT */}

            {error && (

                <div className="comparison-alert error">

                    <RiCloseLine />

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {success && (

                <div className="comparison-alert success">

                    <RiCheckLine />

                    <span>
                        {success}
                    </span>

                </div>

            )}


            {/* UPLOAD */}

            {activeSection ===
                "upload" && (

                renderUploadSection()

            )}


            {/* HISTORY */}

            {renderBillTable()}


            {/* MODALS */}

            {renderEditModal()}

            {renderViewModal()}


            {/* ACTION LOADING */}

            {actionLoading && (

                <div className="comparison-action-loading">

                    <RiLoader4Line className="comparison-spin" />

                </div>

            )}

        </div>

    );
}

export default ComparisonACDC;