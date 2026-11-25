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

    const [openPickerAfterSectionChange, setOpenPickerAfterSectionChange] =
        useState(false);

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

    const [reportBill, setReportBill] =
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

    useEffect(() => {
        if (
            activeSection === "upload" &&
            openPickerAfterSectionChange &&
            fileInputRef.current
        ) {
            fileInputRef.current.click();
            setOpenPickerAfterSectionChange(false);
        }
    }, [activeSection, openPickerAfterSectionChange]);


    /* =========================================================================
       FILE SELECT
    ========================================================================= */

    const handleFileChange = async (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setSelectedFile(file);
        setError("");
        setSuccess("");
        setOCRResult(null);

        // Start upload/OCR immediately after the user selects a file.
        await processBillOCR(file);

        // Allow selecting the same file again later.
        event.target.value = "";

    };


    /* =========================================================================
       OCR
    ========================================================================= */

    const processBillOCR = async (fileToUpload = selectedFile) => {

        if (!fileToUpload) {

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
                    fileToUpload
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
       URDU BILL REPORT + PDF
       Uses only values returned by OCR / saved bill data. Missing values are
       shown as unavailable; no tariff, generation or savings values guessed.
    ========================================================================= */

    const getReportOCR = (bill) => {
        let data = bill?.ocr_data || bill?.data || bill || {};
        if (typeof data === "string") {
            try { data = JSON.parse(data); } catch { data = {}; }
        }
        return data && typeof data === "object" ? data : {};
    };

    const firstReportValue = (data, keys) => {
        for (const key of keys) {
            const value = data?.[key];
            if (value !== null && value !== undefined && value !== "") return value;
        }
        return null;
    };

    // OCR providers may return the same bill fields nested inside bill_details,
    // readings, net_metering, or other objects. Match exact normalized keys
    // recursively rather than treating a generic "units" field as total import.
    const deepReportValue = (data, keys) => {
        const wanted = new Set(keys.map(key =>
            String(key).toLowerCase().replace(/[^a-z0-9]/g, "")
        ));
        const visited = new Set();
        const walk = (node) => {
            if (!node || typeof node !== "object" || visited.has(node)) return null;
            visited.add(node);
            if (Array.isArray(node)) {
                for (const item of node) {
                    const found = walk(item);
                    if (found !== null && found !== undefined && found !== "") return found;
                }
                return null;
            }
            for (const [key, value] of Object.entries(node)) {
                const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
                if (wanted.has(normalized) && value !== null && value !== undefined && value !== "") {
                    return value;
                }
            }
            for (const value of Object.values(node)) {
                const found = walk(value);
                if (found !== null && found !== undefined && found !== "") return found;
            }
            return null;
        };
        return walk(data);
    };

    const reportNumber = (value) => {
        if (value === null || value === undefined || value === "") return null;
        const n = Number(String(value).replace(/,/g, "").replace(/[^0-9.-]/g, ""));
        return Number.isFinite(n) ? n : null;
    };

    const reportMoney = (value) => value === null || value === undefined
        ? "بل میں معلومات دستیاب نہیں"
        : `${formatNumber(value, 0)} روپے`;

    const reportUnits = (value) => value === null || value === undefined
        ? "بل میں معلومات دستیاب نہیں"
        : `${formatNumber(value, 0)} یونٹ`;

    const escapeReportHTML = (value) => String(value ?? "—")
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const buildUrduReport = (bill) => {
        const ocr = getReportOCR(bill);
        const peak = reportNumber(deepReportValue(ocr, [
            "peak_units", "peak_consumption_units", "peak_units_consumed",
            "peak_time_units", "peak_units_imported", "peak_consumption",
            "peak_unit", "peak_units_purchased", "peak_import_units",
            "peak_kwh", "peak_reading_units"
        ]));
        const offPeak = reportNumber(deepReportValue(ocr, [
            "off_peak_units", "offpeak_units", "off_peak_consumption_units",
            "off_peak", "offpeak", "off_peak_kwh", "offpeak_consumption",
            "off_peak_units_consumed", "off_peak_import_units",
            "off_peak_reading_units"
        ]));
        const explicitImportTotal = reportNumber(deepReportValue(ocr, [
            "total_import_units", "total_units_imported", "units_imported",
            "total_imported_units", "total_grid_import_units", "grid_import_units",
            "units_purchased", "units_from_grid", "total_consumption_units",
            "imported_units", "total_units_consumed", "total_kwh_consumed",
            "total_energy_consumed"
        ]));
        // When OCR supplies separate peak and off-peak readings, their sum is
        // the WAPDA import total. Never use an ambiguous generic "units" field.
        const importTotal = explicitImportTotal ??
            (peak !== null && offPeak !== null ? peak + offPeak : null);
        const exportUnits = reportNumber(deepReportValue(ocr, [
            "solar_export_units", "export_units", "units_exported",
            "net_metering_export_units", "exported_units", "offered_units",
            "units_returned", "solar_units_exported", "units_exported_to_grid",
            "grid_export_units", "export_to_grid_units", "units_sent_to_grid",
            "units_delivered_to_grid", "units_exported_to_wapda",
            "exported_to_grid_units", "net_export_units",
            "net_metering_units_exported", "solar_energy_exported",
            "reverse_meter_units", "bi_directional_export_units"
        ]));
        const netUnits = reportNumber(firstReportValue(ocr, ["net_billable_units", "net_units", "adjusted_units"])) ?? (importTotal !== null && exportUnits !== null ? importTotal - exportUnits : null);
        const amount = reportNumber(firstReportValue(ocr, ["total_payable", "payable_before_due", "current_bill", "bill_amount", "total_amount"])) ?? reportNumber(bill?.bill_amount);
        const electricity = reportNumber(firstReportValue(ocr, ["electricity_charges", "current_charges", "net_electricity_charges"]));
        const taxes = reportNumber(deepReportValue(ocr, ["total_taxes", "tax_total", "government_taxes", "total_tax", "taxes", "gst", "electricity_duty", "income_tax", "tax_amount"]));
        const fpa = reportNumber(deepReportValue(ocr, ["fpa", "fuel_price_adjustment", "fuel_adjustment", "total_fpa", "fpa_amount", "fuel_price_adj"]));
        const monthRaw = firstReportValue(ocr, ["billing_period", "bill_month_name"]) || billMonthLabel(bill, ocr);
        const due = firstReportValue(ocr, ["due_date"]);
        const provider = firstReportValue(ocr, ["utility_provider"]) || "واپڈا";
        const area = firstReportValue(ocr, ["area_name", "bill_address", "division"]);
        const charges = Array.isArray(ocr.charge_breakdown) ? ocr.charge_breakdown : [];
        const history = Array.isArray(ocr.consumption_history) ? ocr.consumption_history : (Array.isArray(ocr.reading_history) ? ocr.reading_history : []);
        // Never mix another customer's bill into this report.
        // Use the strongest available account identifier for matching.
        const billReference = String(bill?.reference_number || ocr?.reference_number || "").trim().toLowerCase();
        const billEmail = String(bill?.account_email || bill?.email || "").trim().toLowerCase();
        const billConsumer = String(bill?.consumer_name || ocr?.consumer_name || "").trim().toLowerCase();
        const sameAccountPrevious = (Array.isArray(bills) ? bills : [])
            .filter(item => {
                if (!item || item?.id === bill?.id) return false;
                const itemOcr = getReportOCR(item);
                const itemReference = String(item?.reference_number || itemOcr?.reference_number || "").trim().toLowerCase();
                const itemEmail = String(item?.account_email || item?.email || "").trim().toLowerCase();
                const itemConsumer = String(item?.consumer_name || itemOcr?.consumer_name || "").trim().toLowerCase();
                if (billReference) return itemReference === billReference;
                if (billEmail) return itemEmail === billEmail;
                return Boolean(billConsumer && itemConsumer === billConsumer &&
                    String(item?.area_name || itemOcr?.area_name || "").trim().toLowerCase() ===
                    String(bill?.area_name || ocr?.area_name || "").trim().toLowerCase());
            })
            .sort((a, b) => {
                const ay = getNumber(a.bill_year, 0) * 100 + getNumber(a.bill_month, 0);
                const by = getNumber(b.bill_year, 0) * 100 + getNumber(b.bill_month, 0);
                return by - ay;
            });
        const previous = sameAccountPrevious[0] || (history.length ? history[history.length - 1] : null);
        const previousAmount = reportNumber(previous?.bill_amount ?? previous?.current_bill ?? previous?.total_payable ?? previous?.amount ?? previous?.payable);
        const billMonthAmount = amount;
        const monthDifference = previousAmount !== null && billMonthAmount !== null ? previousAmount - billMonthAmount : null;
        const consumer = firstReportValue(ocr, ["consumer_name"]) || bill?.consumer_name || "—";
        const systemCapacity = firstReportValue(ocr, ["solar_system_capacity_kw", "solar_capacity_kw", "installed_solar_capacity_kw"]);
        const rows = [
            ["واپڈا سے حاصل کردہ کل بجلی", reportUnits(importTotal)],
            ["پیک ٹائم کے یونٹس", reportUnits(peak)],
            ["آف پیک یونٹس", reportUnits(offPeak)],
            ["سولر سے واپڈا کو واپس دیے گئے یونٹس", exportUnits === null ? "بل میں معلومات دستیاب نہیں" : `−${formatNumber(exportUnits)} یونٹ`],
            ["ایڈجسٹمنٹ کے بعد قابلِ بل یونٹس", reportUnits(netUnits)],
        ];
        const amountRows = [
            ["بجلی کے چارجز", reportMoney(electricity)],
            ["حکومتی ٹیکس", reportMoney(taxes)],
            ["فیول پرائس ایڈجسٹمنٹ (FPA)", reportMoney(fpa)],
            ["کل قابلِ ادا رقم", reportMoney(amount)],
        ];
        const table = (items) => items.map(([a,b]) => `<tr><td>${escapeReportHTML(a)}</td><td>${escapeReportHTML(b)}</td></tr>`).join("");
        const chargeRows = charges.map(row => `<tr><td>${escapeReportHTML(row.label || row.description || row.name || "چارج")}</td><td>${escapeReportHTML(row.amount ?? row.total ?? "—")}</td></tr>`).join("");
        // Reasons are generated exclusively from the selected bill's OCR values.
        // Approved four-point explanation. Values always come from this bill's OCR.
        const chargeAmount = (pattern) => {
            const row = charges.find(item => {
                const label = String(item?.label || item?.description || item?.name || "").toLowerCase();
                return pattern.test(label);
            });
            return reportNumber(row?.amount ?? row?.total ?? row?.value);
        };
        const taxAmount = taxes ?? chargeAmount(/tax|gst|income tax|electricity duty|ٹیکس|ڈیوٹی/);
        const fpaAmount = fpa ?? chargeAmount(/fpa|fuel|فیول|ایڈجسٹمنٹ/);
        const reasons = [];
        if (importTotal !== null && exportUnits !== null) {
            reasons.push(`واپڈا سے ${formatNumber(importTotal)} یونٹ لیے جبکہ ${formatNumber(exportUnits)} یونٹ واپس دیے گئے۔`);
        } else if (importTotal !== null) {
            reasons.push(`اس بل میں واپڈا سے حاصل کردہ کل بجلی ${formatNumber(importTotal)} یونٹ درج ہے۔`);
        }
        if (peak !== null && peak > 0) reasons.push(`بل میں پیک ٹائم کے ${formatNumber(peak)} یونٹس درج ہیں۔`);
        if (taxAmount !== null && taxAmount > 0) reasons.push(`بل میں ${formatNumber(taxAmount)} روپے ٹیکس درج ہے۔`);
        if (fpaAmount !== null && fpaAmount > 0) reasons.push(`فیول پرائس ایڈجسٹمنٹ (FPA) ${formatNumber(fpaAmount)} روپے ہے۔`);
        const homeData = bill?.home_analysis_data || bill?.home_analysis || null;
        const homeResult = bill?.home_analysis_result || null;
        return { ocr, consumer, monthRaw, due, provider, area, amount, rows, amountRows, chargeRows, chargeItems: charges, reasons, previousAmount, monthDifference, systemCapacity, homeData, homeResult, history };
    };

    const billMonthLabel = (bill, ocr) => {
        const month = reportNumber(ocr?.bill_month ?? bill?.bill_month);
        const year = ocr?.bill_year ?? bill?.bill_year ?? "";
        if (month && month >= 1 && month <= 12) return `${new Date(2000, month - 1, 1).toLocaleString("ur-PK", { month: "long" })} ${year}`.trim();
        return year ? String(year) : "بجلی کا بل";
    };

    const openBillReport = async (bill) => {
        try {
            setActionLoading(true);
            let complete = bill;
            try {
                const response = await comparisonBillService.getBill(bill.id);
                complete = extractSingleBill(response) || bill;
            } catch (fetchError) {
                console.warn("Using bill list data for report:", fetchError);
            }
            setReportBill(complete);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setActionLoading(false);
        }
    };

    
const printBillReport = (bill) => {
    let frame = null;

    try {
        const r = buildUrduReport(bill);
        const esc = escapeReportHTML;
        const cards = (items, type = "") => items.map(([label, value]) => `
            <article class="metric-card ${type}">
                <div class="metric-label">${esc(label)}</div>
                <div class="metric-value">${esc(value)}</div>
            </article>
        `).join("");

        const chargeRows = Array.isArray(r.chargeItems) ? r.chargeItems : [];
        const charges = chargeRows.length ? `
            <section class="report-section">
                <h2>بل کے تمام چارجز</h2>
                <table class="report-table charges-table">
                    <colgroup><col style="width:68%"><col style="width:32%"></colgroup>
                    <thead><tr><th>چارج کی تفصیل</th><th>رقم</th></tr></thead>
                    <tbody>${chargeRows.map(row => `
                        <tr>
                            <td>${esc(row.label || row.description || row.name || "چارج")}</td>
                            <td class="amount-cell">${esc(row.amount ?? row.total ?? "—")}</td>
                        </tr>`).join("")}</tbody>
                </table>
            </section>` : "";

        const reasons = r.reasons.length
            ? `<ol class="reason-list">${r.reasons.map(x => `<li>${esc(x)}</li>`).join("")}</ol>`
            : `<p class="empty-note">اس بل سے وجوہات اخذ کرنے کے لیے کافی واضح معلومات دستیاب نہیں۔</p>`;

        const historyRows = Array.isArray(r.history) ? r.history : [];
        const history = historyRows.length ? `
            <section class="report-section">
                <h2>بل کی سابقہ کھپت</h2>
                <table class="report-table history-table">
                    <colgroup><col style="width:34%"><col style="width:33%"><col style="width:33%"></colgroup>
                    <thead><tr><th>مہینہ</th><th>یونٹس</th><th>بل کی رقم</th></tr></thead>
                    <tbody>${historyRows.map(item => `
                        <tr>
                            <td>${esc(item.month || item.billing_month || "—")}</td>
                            <td>${esc(item.units ?? item.units_consumed ?? "—")}</td>
                            <td>${esc(item.bill_amount ?? item.amount ?? "—")}</td>
                        </tr>`).join("")}</tbody>
                </table>
            </section>` : "";

        const home = r.homeResult
            ? `<div class="home-summary"><pre>${esc(JSON.stringify(r.homeResult, null, 2))}</pre></div>`
            : `<p class="empty-note">ہوم اینالیسس ابھی محفوظ نہیں کیا گیا۔</p>`;

        const previous = r.previousAmount !== null
            ? `<div class="comparison-highlight"><span>پچھلے بل کی رقم</span><strong>${esc(reportMoney(r.previousAmount))}</strong><span>فرق</span><strong>${r.monthDifference === null ? "موازنہ دستیاب نہیں" : `${formatNumber(Math.abs(r.monthDifference))} روپے ${r.monthDifference >= 0 ? "کم" : "زیادہ"}`}</strong></div>`
            : `<p class="empty-note">پچھلے مہینے کا بل ریکارڈ دستیاب نہیں، اس لیے موازنہ نہیں کیا جا سکا۔</p>`;

        const html = `<!doctype html>
        <html lang="ur" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>بجلی اور سولر نیٹ میٹرنگ رپورٹ</title>
            <style>
                @page { size: A4; margin: 13mm 12mm; }
                @font-face {
                    font-family: "Jameel Noori Nastaleeq";
                    src: url("/fonts/JameelNooriNastaleeq.ttf") format("truetype");
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                }
                * { box-sizing: border-box; }
                html, body { margin:0; padding:0; width:100%; background:#fff; color:#172b45; direction:rtl; font-family:"Jameel Noori Nastaleeq","Noto Nastaliq Urdu",serif; font-size:13px; line-height:2.05; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
                body { max-width:100%; overflow-wrap:anywhere; }
                .report-paper { width:100%; margin:0 auto; padding:8mm; background:#fff; border:1px solid #d5dee7; border-top:6px solid #98445a; border-radius:10px; }
                .report-header { padding:0 0 15px; margin:0 0 18px; border-bottom:3px solid #98445a; }
                .eyebrow { color:#98445a; font-size:9px; font-weight:700; letter-spacing:1px; }
                h1 { color:#123b5b; font-size:21px; line-height:1.5; margin:5px 0 7px; }
                .provider { color:#53677e; font-size:10px; }
                .meta { display:flex; flex-wrap:wrap; gap:5px 18px; margin-top:8px; color:#526174; }
                .payable { margin-top:10px; color:#98445a; font-size:27px; font-weight:800; }
                .intro { background:#f3f7fa; border:1px solid #d4dee8; border-right:4px solid #98445a; border-radius:4px; padding:9px 12px; margin-top:10px; }
                .report-section { margin:17px 0 0; page-break-inside:auto; }
                h2 { color:#fff; background:#98445a; font-size:15px; margin:0 0 9px; padding:8px 11px; border:0; page-break-after:avoid; }
                .metric-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; width:100%; }
                .metric-card { min-width:0; border:1px solid #d4dee8; border-radius:4px; padding:9px 11px; background:#f3f7fa; break-inside:avoid; page-break-inside:avoid; }
                .metric-card.money { background:#f3f7fa; border-color:#d4dee8; }
                .metric-label { color:#53677e; font-size:10px; margin-bottom:4px; }
                .metric-value { color:#163b5c; font-size:13px; font-weight:700; overflow-wrap:anywhere; }
                .money .metric-value { color:#253b53; }
                .report-table { width:100%; max-width:100%; border-collapse:collapse; table-layout:fixed; margin:8px 0 12px; direction:rtl; }
                .report-table th,.report-table td { border:1px solid #d8e2ec; padding:7px 9px; text-align:right; vertical-align:top; overflow-wrap:anywhere; }
                .report-table th { background:#98445a; color:#ffffff; font-weight:700; border-color:#803449; }
                .report-table tbody tr:nth-child(even) { background:#eaf2f7; }
                .report-table td.amount-cell { direction:rtl; font-weight:700; white-space:normal; }
                .reason-list { margin:5px 0; padding-right:23px; }
                .reason-list li { margin:5px 0; padding-right:3px; }
                .comparison-highlight { display:grid; grid-template-columns:1fr 1fr; gap:7px; border:1px solid #d4dee8; border-radius:4px; padding:10px; background:#f3f7fa; }
                .comparison-highlight span { color:#60748a; }
                .comparison-highlight strong { color:#123b5b; }
                .home-summary { border:1px solid #d9e5ef; border-radius:8px; padding:9px; background:#f8fbfd; }
                pre { margin:0; white-space:pre-wrap; word-break:break-word; direction:ltr; text-align:left; font-size:9px; }
                .empty-note { color:#68788c; background:#f7f9fb; border:1px dashed #ccd8e3; border-radius:7px; padding:9px; }
                .footer-note { color:#68788c; font-size:9px; border-top:1px solid #e1e8ef; margin-top:18px; padding-top:8px; }
                tr, .metric-card { break-inside:avoid; page-break-inside:avoid; }
                @media print { html,body { width:100%; } .report-section { break-inside:auto; } h2 { break-after:avoid; } }
            </style>
        </head>
        <body>
            <main class="report-paper">
            <header class="report-header">
                <div class="eyebrow">URDU BILL REPORT</div>
                <h1>${esc(r.monthRaw)} کا بجلی اور سولر نیٹ میٹرنگ بل</h1>
                <div class="provider">${esc(r.provider)}${r.area ? `، ${esc(r.area)}` : ""}</div>
                <div class="meta"><span>صارف: ${esc(r.consumer)}</span><span>آخری تاریخ: ${esc(r.due || "بل میں درج نہیں")}</span></div>
                <div class="payable">${esc(reportMoney(r.amount))}</div>
                <div class="intro">یہ رپورٹ اپ لوڈ کیے گئے بجلی کے بل میں موجود OCR معلومات کی بنیاد پر تیار کی گئی ہے۔</div>
            </header>

            <section class="report-section">
                <h2>1۔ بجلی کی کھپت اور سولر ایکسپورٹ</h2>
                <div class="metric-grid">${cards(r.rows)}</div>
                <p>واپڈا کو واپس دیے گئے یونٹس سولر کی کل پیداوار نہیں ہوتے۔ گھر میں براہِ راست استعمال ہونے والی سولر بجلی کی مقدار بل میں موجود نہ بھی ہو سکتی ہے۔</p>
                <p><strong>سولر سسٹم کی صلاحیت:</strong> ${r.systemCapacity ? `${esc(r.systemCapacity)} کلوواٹ` : "بل میں معلومات دستیاب نہیں۔"}</p>
            </section>

            <section class="report-section">
                <h2>2۔ سولر ہونے کے باوجود بل زیادہ کیوں آیا؟</h2>
                ${reasons}
            </section>

            <section class="report-section">
                <h2>3۔ بل کی رقم کی تفصیل</h2>
                <div class="metric-grid">${cards(r.amountRows, "money")}</div>
            </section>
            ${charges}

            <section class="report-section">
                <h2>4۔ پچھلے مہینے کے مقابلے میں</h2>
                ${previous}
            </section>
            ${history}

           
            <div class="footer-note">یہ خودکار معلوماتی رپورٹ ہے۔ حتمی بل، ٹیرف اور ادائیگی کے لیے متعلقہ بجلی کمپنی کے اصل بل کو ترجیح دیں۔</div>
            </main>
        </body></html>`;

        frame = document.createElement("iframe");
        frame.title = "Bill report print";
        frame.setAttribute("aria-hidden", "true");
        frame.style.cssText = "position:fixed;left:0;bottom:0;width:0;height:0;border:0;visibility:hidden;";
        document.body.appendChild(frame);

        const printDoc = frame.contentDocument || frame.contentWindow?.document;
        if (!printDoc || !frame.contentWindow) throw new Error("Unable to create print document.");

        let printed = false;
        const doPrint = () => {
            if (printed || !frame?.contentWindow) return;
            printed = true;
            try {
                frame.contentWindow.focus();
                frame.contentWindow.print();
            } catch (err) {
                console.error("Print dialog error:", err);
                window.alert("پرنٹ ڈائیلاگ نہیں کھل سکا۔ دوبارہ کوشش کریں۔");
            }
            setTimeout(() => {
                if (frame?.parentNode) frame.parentNode.removeChild(frame);
                frame = null;
            }, 3000);
        };

        frame.onload = () => {
            const fontsReady = frame?.contentDocument?.fonts?.ready;
            if (fontsReady) fontsReady.then(() => setTimeout(doPrint, 400)).catch(() => setTimeout(doPrint, 600));
            else setTimeout(doPrint, 600);
        };
        printDoc.open();
        printDoc.write(html);
        printDoc.close();
        setTimeout(doPrint, 2000);
    } catch (error) {
        console.error("Bill PDF generation error:", error);
        if (frame?.parentNode) frame.parentNode.removeChild(frame);
        window.alert("PDF رپورٹ تیار کرنے میں مسئلہ پیش آیا۔ براہِ کرم دوبارہ کوشش کریں۔");
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
        bill = null,
        formOnly = Boolean(bill)
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

                    formOnly,
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
                                <strong>{selectedFile.name}</strong>
                                <span>
                                    {ocrLoading
                                        ? t.processing
                                        : success || "File selected"}
                                </span>
                            </div>
                        </div>
                        {ocrLoading && (
                            <RiLoader4Line className="comparison-spin" />
                        )}
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
                                                        className="view"
                                                        title="اردو رپورٹ / PDF"
                                                        onClick={() => openBillReport(bill)}
                                                    >
                                                        <RiFileList3Line />
                                                    </button>

                                                    <button
    type="button"
    className="view"
    title={t.view}
    onClick={() => handleViewBill(bill)}
>
    <RiEyeLine />
</button>

                                                    {admin && (

                                                        <>

                                                           <button
    type="button"
    className="edit"
    title={t.edit}
    onClick={() => handleEditBill(bill)}
>
    <RiEditLine />
</button>
                                                            <button
    type="button"
    className="danger"
    title={t.delete}
    onClick={() => handleDeleteBill(bill)}
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

                    {(selectedBill?.home_analysis_data || selectedBill?.home_analysis_result) && (
                        <section className="comparison-edit-saved-analysis">
                            <div className="comparison-section-heading">
                                <div>
                                    <small>HOME ANALYSIS</small>
                                    <h3>Saved Home Analysis Preview</h3>
                                </div>
                                <button
                                    type="button"
                                    className="comparison-secondary-btn"
                                    onClick={() => openHomeAnalysis(selectedBill)}
                                >
                                    <RiHome4Line /> {t.home}
                                </button>
                            </div>
                            {renderSavedHomeAnalysis(selectedBill)}
                        </section>
                    )}

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




    
const renderSavedHomeAnalysis = (bill) => {
    if (!bill) return null;

    const parseValue = (value, fallback) => {
        if (typeof value !== "string") {
            return value ?? fallback;
        }

        try {
            return JSON.parse(value);
        } catch {
            return fallback;
        }
    };

    const homeData = parseValue(
        bill.home_analysis_data,
        {}
    );

    const homeResults = parseValue(
        bill.home_analysis_result,
        []
    );

    const applianceLabels = {
        fan: "Fans",
        bulb: "Bulbs / Lights",
        fridge: "Refrigerator",
        ac: "Air Conditioner",
        pump: "Water Pump",
        iron: "Iron",
        washing: "Washing Machine",
        geyser: "Geyser",
        other: "Other Appliance",
    };

    const selected = homeData.selected || {};

    const appliances = Object.keys(applianceLabels)
        .filter((key) => selected[key])
        .map((key) => ({
            key,
            label:
                key === "other"
                    ? homeData.other?.name || applianceLabels[key]
                    : applianceLabels[key],
            values: homeData[key] || {},
        }));

    const totalCurrentLoad = Array.isArray(homeResults)
        ? homeResults.reduce((sum, item) => sum + Number(item.currentPower || 0), 0)
        : 0;
    const totalEfficientLoad = Array.isArray(homeResults)
        ? homeResults.reduce((sum, item) => sum + Number(item.efficientPower || 0), 0)
        : 0;
    const totalSaving = Math.max(0, totalCurrentLoad - totalEfficientLoad);
    const savingPercent = totalCurrentLoad > 0
        ? Math.round((totalSaving / totalCurrentLoad) * 100)
        : 0;

    return (
        <div className="comparison-home-details">
            <div className="saved-home-summary-grid">
                <article className="saved-home-summary-card consumption">
                    <span>YOUR ELECTRICITY CONSUMPTION</span>
                    <h3>{totalCurrentLoad.toLocaleString()} W</h3>
                    <p>Current appliance load</p>
                </article>
                <article className="saved-home-summary-card savings">
                    <span>POTENTIAL ELECTRICITY SAVINGS</span>
                    <h3>{savingPercent}%</h3>
                    <p>Estimated load reduction: {totalSaving.toLocaleString()} W</p>
                </article>
                <article className="saved-home-summary-card insight">
                    <span>KEY INSIGHT</span>
                    <h3>{homeResults.length ? "Efficiency opportunity" : "No analysis saved"}</h3>
                    <p>{homeResults.length ? "Replacing high-consumption appliances with efficient DC alternatives may reduce usage." : "Run Home Analysis to save appliance results for this bill."}</p>
                </article>
            </div>

            <div className="saved-home-guidance-grid">
                <article className="saved-home-guidance-card peak">
                    <span className="saved-home-badge">HIGH CONSUMPTION ALERT</span>
                    <h4>🕘 Peak Hours</h4>
                    <strong>☀️ 5:00 PM – 11:00 PM</strong>
                    <p>Where possible, avoid running high-consumption appliances during peak hours.</p>
                </article>
                <article className="saved-home-guidance-card opportunities">
                    <h4>📈 Best Opportunities</h4>
                    <p><b className="impact high">⚡ High Impact</b> Water pump, refrigerator, iron</p>
                    <p><b className="impact medium">⚙ Medium Impact</b> Fans</p>
                    <p><b className="impact easy">💡 Easy Saving</b> LED / DC lights</p>
                </article>
                <article className="saved-home-guidance-card tips">
                    <h4>⚙️ Quick Tips</h4>
                    <p>✓ Use DC and energy-efficient appliances where possible.</p>
                    <p>✓ Replace old appliances with efficient alternatives.</p>
                    <p>✓ Avoid unnecessary heavy appliance usage during peak hours.</p>
                    <p>✓ Use LED lights instead of high-wattage bulbs.</p>
                    <p>✓ Use solar energy for high-consumption activities during the day.</p>
                </article>
            </div>

            <section className="saved-home-section">
                <h4>Appliances Entered by User</h4>
                {appliances.length > 0 ? (
                    <div className="comparison-home-grid">
                        {appliances.map((item) => (
                            <article className="comparison-home-item" key={item.key}>
                                <h5>{item.label}</h5>
                                <p><span>Total Quantity</span><strong>{item.values.total ?? 0}</strong></p>
                                <p><span>AC Quantity</span><strong>{item.values.ac ?? 0}</strong></p>
                                <p><span>DC Quantity</span><strong>{item.values.dc ?? 0}</strong></p>
                                <p><span>AC Watts</span><strong>{item.values.watts || "Default"}</strong></p>
                                <p><span>DC Watts</span><strong>{item.values.dcWatts || "Default"}</strong></p>
                            </article>
                        ))}
                    </div>
                ) : <p className="saved-home-empty">No saved appliance form data.</p>}
            </section>

            <section className="saved-home-section">
                <h4>Analysis Results</h4>
                {Array.isArray(homeResults) && homeResults.length > 0 ? (
                    <div className="comparison-home-grid">
                        {homeResults.map((item, index) => (
                            <article className="comparison-home-item result" key={`${item.key || item.name || "result"}-${index}`}>
                                <h5>{item.name || item.key || "Appliance"}</h5>
                                <p><span>Quantity</span><strong>{item.total ?? 0}</strong></p>
                                <p><span>Current Load</span><strong>{item.currentPower ?? 0} W</strong></p>
                                <p><span>Efficient Load</span><strong>{item.efficientPower ?? 0} W</strong></p>
                                <p className="saving-value"><span>Potential Saving</span><strong>{item.savingPercent ?? 0}%</strong></p>
                            </article>
                        ))}
                    </div>
                ) : <p className="saved-home-empty">No saved analysis results.</p>}
            </section>
        </div>
    );
};



    /* =========================================================================
       VIEW MODAL
    ========================================================================= */

    const renderReportModal = () => {
        if (!reportBill) return null;
        const report = buildUrduReport(reportBill);
        const reportCards = (items, variant = "") => (
            <div className={`urdu-report-grid ${variant}`}>
                {items.map(([label, value], index) => (
                    <article className="urdu-report-card" key={`${label}-${index}`}>
                        <span className="urdu-report-card-label">{label}</span>
                        <strong className="urdu-report-card-value">{value}</strong>
                    </article>
                ))}
            </div>
        );
        const chargeItems = Array.isArray(report.chargeItems) ? report.chargeItems : [];
        const historyItems = Array.isArray(report.history) ? report.history : [];
        return (
            <div className="comparison-modal-overlay urdu-report-overlay">
                <style>{`
                    @font-face {
                        font-family: "Jameel Noori Nastaleeq";
                        src: url("/fonts/JameelNooriNastaleeq.ttf") format("truetype");
                        font-style: normal;
                        font-weight: 400;
                        font-display: swap;
                    }
                    .urdu-report-overlay .comparison-view-content {
                        font-family: "Jameel Noori Nastaleeq", "Noto Nastaliq Urdu", serif;
                        line-height: 2.15;
                    }
                    .urdu-report-paper {
                        width: 100%;
                        max-width: 900px;
                        margin: 0 auto;
                        padding: 24px;
                        background: #fff;
                        border: 1px solid #d8e1e9;
                        border-top: 6px solid #98445a;
                        border-radius: 12px;
                        box-shadow: 0 5px 18px rgba(30,50,70,.07);
                    }
                    .urdu-report-paper .urdu-report-title,
                    .urdu-report-paper .urdu-report-section h3,
                    .urdu-report-paper .urdu-report-card-label,
                    .urdu-report-paper .urdu-report-card-value,
                    .urdu-report-paper .urdu-report-reasons,
                    .urdu-report-paper .urdu-report-note,
                    .urdu-report-paper .urdu-report-comparison,
                    .urdu-report-paper .urdu-report-footer-note {
                        font-family: "Jameel Noori Nastaleeq", "Noto Nastaliq Urdu", serif;
                    }
                    .urdu-report-paper .urdu-report-section h3 {
                        font-size: 19px;
                        font-weight: 800;
                        line-height: 2;
                        padding: 5px 14px 9px;
                        border-right: 5px solid #c7a36a;
                        border-radius: 5px;
                    }
                    .urdu-report-paper .urdu-report-card-label {font-size:15px;font-weight:700;line-height:2}
                    .urdu-report-paper .urdu-report-card-value {font-size:20px;font-weight:800;line-height:2}
                    .urdu-report-paper .urdu-report-reasons {font-size:17px;line-height:2.25}
                    .urdu-report-paper .urdu-report-footer-note {margin-top:24px;padding-top:12px;border-top:1px solid #e1e8ef;color:#71808d;font-size:13px}
                    .urdu-report-overlay .comparison-view-modal{width:min(980px,calc(100vw - 32px));max-width:980px;max-height:94vh;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;background:#fff;box-shadow:0 24px 70px rgba(8,25,45,.24)}
                    .urdu-report-overlay .comparison-modal-header{flex:0 0 auto;padding:18px 22px;border-bottom:1px solid #e4ebf2;background:linear-gradient(135deg,#f8fbfd,#fff)}
                    .urdu-report-overlay .comparison-modal-header small{color:#98445a;font-size:10px;font-weight:800;letter-spacing:1px}
                    .urdu-report-overlay .comparison-modal-header h2{margin:4px 0 0;color:#153b5b;font-size:20px}
                    .urdu-report-overlay .comparison-view-content{flex:1 1 auto;overflow-y:auto;padding:22px 26px 26px;text-align:right;line-height:1.85;color:#243b53}
                    .urdu-report-title{margin:0 0 5px;color:#153b5b;font-size:23px}
                    .urdu-report-provider{margin:0;color:#65788d;font-size:13px}
                    .urdu-report-total{margin:12px 0 3px;color:#98445a;font-size:30px;font-weight:800}
                    .urdu-report-meta{display:flex;flex-wrap:wrap;gap:5px 18px;color:#65788d;font-size:12px}
                    .urdu-report-note{margin:14px 0 20px;padding:11px 14px;border:1px solid #d4dee8;border-right:4px solid #98445a;border-radius:4px;background:#f3f7fa;color:#253b53}
                    .urdu-report-section{margin:22px 0 0}
                    .urdu-report-section h3{margin:0 0 12px;padding:8px 11px;background:#98445a;color:#fff;border:0;border-radius:2px;font-size:16px}
                    .urdu-report-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
                    .urdu-report-card{min-width:0;padding:13px 15px;border:1px solid #d4dee8;border-radius:4px;background:#fff;box-shadow:none}
                    .urdu-report-card-label{display:block;margin-bottom:6px;color:#65788d;font-size:12px}
                    .urdu-report-card-value{display:block;color:#173e60;font-size:15px;overflow-wrap:anywhere}
                    .urdu-report-grid.money .urdu-report-card{background:#f3f7fa;border-color:#d4dee8}
                    .urdu-report-grid.money .urdu-report-card-value{color:#253b53}
                    .urdu-report-table-wrap{overflow-x:auto;border:1px solid #dce6ef;border-radius:10px}
                    .urdu-report-table{width:100%;border-collapse:collapse;table-layout:fixed;text-align:right;direction:rtl}
                    .urdu-report-table th,.urdu-report-table td{padding:11px 14px;border-bottom:1px solid #e5edf3;text-align:right;overflow-wrap:anywhere}
                    .urdu-report-table th{background:#98445a;color:#fff;font-size:12px;border-color:#803449}
                    .urdu-report-table tbody tr:nth-child(even){background:#eaf2f7}
                    .urdu-report-table tr:last-child td{border-bottom:0}
                    .urdu-report-reasons{margin:0;padding-right:24px;line-height:2}
                    .urdu-report-comparison{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
                    .urdu-report-comparison>div{padding:13px;border:1px solid #d4dee8;border-radius:4px;background:#f3f7fa}
                    .urdu-report-comparison span{display:block;color:#65788d;font-size:12px}
                    .urdu-report-comparison strong{display:block;margin-top:5px;color:#173e60;font-size:16px}
                    .urdu-report-home{padding:14px;border:1px solid #dce6ef;border-radius:10px;background:#f8fbfd;white-space:pre-wrap;word-break:break-word;direction:ltr;text-align:left;font-size:11px;max-height:280px;overflow:auto}
                    .urdu-report-empty{padding:12px;border:1px dashed #cbd8e3;border-radius:9px;background:#f8fafc;color:#65788d}
                    .urdu-report-overlay .comparison-modal-footer{flex:0 0 auto;display:flex;gap:9px;justify-content:flex-start;padding:13px 18px;border-top:1px solid #e4ebf2;background:#fff}
                    @media(max-width:640px){.urdu-report-paper{padding:14px;border-radius:8px}.urdu-report-grid{grid-template-columns:1fr}.urdu-report-overlay .comparison-view-content{padding:16px}.urdu-report-title{font-size:19px}.urdu-report-comparison{grid-template-columns:1fr}}
                `}</style>
                <div className="comparison-view-modal" dir="rtl">
                    <div className="comparison-modal-header">
                        <div><small>URDU BILL REPORT</small><h2>بجلی اور سولر نیٹ میٹرنگ رپورٹ</h2></div>
                        <button type="button" onClick={() => setReportBill(null)} aria-label="Close report"><RiCloseLine /></button>
                    </div>
                    <div className="comparison-view-content">
                        <div className="urdu-report-paper">
                        <h1 className="urdu-report-title">{report.monthRaw} کا بجلی اور سولر نیٹ میٹرنگ بل</h1>
                        <p className="urdu-report-provider">{report.provider}{report.area ? `، ${report.area}` : ""}</p>
                        <div className="urdu-report-total">{reportMoney(report.amount)}</div>
                        <div className="urdu-report-meta"><span>صارف: {report.consumer}</span><span>آخری تاریخ: {displayValue(report.due)}</span></div>
                        <div className="urdu-report-note">یہ رپورٹ اپ لوڈ کیے گئے بجلی کے بل میں موجود OCR معلومات کی بنیاد پر تیار کی گئی ہے۔</div>

                        <section className="urdu-report-section">
                            <h3>1۔ بجلی کی کھپت اور سولر ایکسپورٹ</h3>
                            {reportCards(report.rows)}
                            <p>واپڈا کو واپس دیے گئے یونٹس سولر کی کل پیداوار نہیں ہیں۔ گھر میں براہِ راست استعمال ہونے والی سولر بجلی کی مقدار اس بل میں موجود نہ بھی ہو سکتی ہے۔</p>
                            <p><strong>سولر سسٹم کی صلاحیت:</strong> {displayValue(report.systemCapacity)} {report.systemCapacity ? "کلوواٹ" : ""}</p>
                        </section>

                        <section className="urdu-report-section">
                            <h3>2۔ سولر ہونے کے باوجود بل زیادہ کیوں آیا؟</h3>
                            {report.reasons.length ? <ol className="urdu-report-reasons">{report.reasons.map((reason, i) => <li key={i}>{reason}</li>)}</ol> : <p className="urdu-report-empty">اس بل سے وجوہات اخذ کرنے کے لیے کافی واضح معلومات دستیاب نہیں۔</p>}
                        </section>

                        <section className="urdu-report-section">
                            <h3>3۔ بل کی رقم کی تفصیل</h3>
                            {reportCards(report.amountRows, "money")}
                        </section>

                        {chargeItems.length > 0 && (
                            <section className="urdu-report-section">
                                <h3>بل کے تمام چارجز</h3>
                                <div className="urdu-report-table-wrap">
                                    <table className="urdu-report-table">
                                        <colgroup><col style={{width:"68%"}}/><col style={{width:"32%"}}/></colgroup>
                                        <thead><tr><th>چارج کی تفصیل</th><th>رقم</th></tr></thead>
                                        <tbody>{chargeItems.map((row, i) => <tr key={i}><td>{row.label || row.description || row.name || "چارج"}</td><td>{displayValue(row.amount ?? row.total)}</td></tr>)}</tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        <section className="urdu-report-section">
                            <h3>4۔ پچھلے مہینے کے مقابلے میں</h3>
                            {report.previousAmount !== null ? (
                                <div className="urdu-report-comparison">
                                    <div><span>پچھلے بل کی رقم</span><strong>{reportMoney(report.previousAmount)}</strong></div>
                                    <div><span>موجودہ بل کے مقابلے میں فرق</span><strong>{report.monthDifference === null ? "موازنہ دستیاب نہیں" : `${formatNumber(Math.abs(report.monthDifference))} روپے ${report.monthDifference >= 0 ? "کم" : "زیادہ"}`}</strong></div>
                                </div>
                            ) : <p className="urdu-report-empty">پچھلے مہینے کا ریکارڈ دستیاب نہیں۔</p>}
                            {historyItems.length > 0 && (
                                <div className="urdu-report-table-wrap" style={{marginTop:12}}>
                                    <table className="urdu-report-table">
                                        <colgroup><col style={{width:"34%"}}/><col style={{width:"33%"}}/><col style={{width:"33%"}}/></colgroup>
                                        <thead><tr><th>مہینہ</th><th>یونٹس</th><th>بل کی رقم</th></tr></thead>
                                        <tbody>{historyItems.map((item, i) => <tr key={i}><td>{item.month || item.billing_month || "—"}</td><td>{item.units ?? item.units_consumed ?? "—"}</td><td>{item.bill_amount ?? item.amount ?? "—"}</td></tr>)}</tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                    
                        <p className="urdu-report-footer-note">یہ خودکار معلوماتی رپورٹ ہے۔ حتمی بل اور ادائیگی کے لیے متعلقہ بجلی کمپنی کے اصل بل کو ترجیح دیں۔</p>
                        </div>
                    </div>
                    <div className="comparison-modal-footer">
                        <button type="button" className="comparison-secondary-btn" onClick={() => printBillReport(reportBill)}>PDF محفوظ کریں / پرنٹ کریں</button>
                        <button type="button" className="comparison-primary-btn" onClick={() => setReportBill(null)}>{t.close}</button>
                    </div>
                </div>
            </div>
        );
    };

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

                                {renderSavedHomeAnalysis(viewBill)}

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
                        setActiveSection("upload");
                        setError("");
                        setSuccess("");
                        setOpenPickerAfterSectionChange(true);
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

            {renderReportModal()}


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