/**
 * ============================================================================
 * File:
 * src/components/dashboard/wapda-bill/WapdaBillModal.jsx
 *
 * Description:
 * Add and Edit WAPDA Bill Modal.
 * Handles bill details, area/location selection,
 * month conversion and OCR uploads.
 * ============================================================================
 */

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import FormActions from "../../common/FormActions";
import BillOCRUpload from "./BillOCRUpload";

import authService from "../../../services/authService";
import ocrService from "../../../services/ocrService";

import "./WapdaBillModal.css";


/* ============================================================================
   MONTHS
============================================================================ */

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


/* ============================================================================
   DEFAULT FORM
============================================================================ */

const defaultForm = {

    consumer_name: "",

    reference_number: "",

    bill_month: "",

    bill_year:
        new Date().getFullYear(),

    bill_address: "",

    area_id: "",

    location: "",

    units_consumed: "",

    bill_amount: "",

    generated_units: "",

    solar_report_month: "",

    solar_report_year:
        new Date().getFullYear(),

    difference_units: "",

    status: "Unpaid",

    generation_loss_reason: "",

    bill_image: null,

    solar_image: null,

    ocr_status: false,

    ocr_confidence: "",

};


/* ============================================================================
   NORMALIZE MONTH
============================================================================ */

const normalizeMonth = (month) => {

    if (
        month === null ||
        month === undefined ||
        month === ""
    ) {

        return "";

    }


    const monthNumber =
        Number(month);


    if (
        !Number.isNaN(monthNumber) &&
        monthNumber >= 1 &&
        monthNumber <= 12
    ) {

        return months[
            monthNumber - 1
        ];

    }


    return months.find(

        (item) =>

            item.toLowerCase() ===
            String(month)
                .trim()
                .toLowerCase()

    ) || "";

};


/* ============================================================================
   GET MONTH NUMBER
============================================================================ */

const getMonthNumber = (month) => {

    if (!month) {

        return "";

    }


    const monthNumber =
        Number(month);


    if (
        !Number.isNaN(monthNumber) &&
        monthNumber >= 1 &&
        monthNumber <= 12
    ) {

        return monthNumber;

    }


    const index =
        months.findIndex(

            (item) =>

                item.toLowerCase() ===
                String(month)
                    .trim()
                    .toLowerCase()

        );


    return index >= 0
        ? index + 1
        : "";

};


/* ============================================================================
   CALCULATE DIFFERENCE
============================================================================ */

const calculateDifference = (

    unitsConsumed,

    generatedUnits

) => {

    const consumed =
        Number(unitsConsumed) || 0;


    const generated =
        Number(generatedUnits) || 0;


    return (

        generated - consumed

    ).toFixed(2);

};


/* ============================================================================
   COMPONENT
============================================================================ */

function WapdaBillModal({

    isOpen,

    onClose,

    onSave,

    selectedBill,

}) {

    const [

        formData,

        setFormData

    ] = useState(defaultForm);


    const [

        areas,

        setAreas

    ] = useState([]);


    const [

        ocrLoading,

        setOcrLoading

    ] = useState(false);


    const [

        solarOcrLoading,

        setSolarOcrLoading

    ] = useState(false);


    /* ========================================================================
       LOAD AREAS
    ======================================================================== */

    useEffect(() => {

        const loadAreas =
            async () => {

                try {

                    const response =
                        await authService.getAreas();


                    setAreas(

                        response?.areas?.data ||

                        response?.areas ||

                        response?.data ||

                        []

                    );

                } catch (error) {

                    console.error(

                        "Failed to load areas:",

                        error

                    );

                }

            };


        if (isOpen) {

            loadAreas();

        }

    }, [isOpen]);


    /* ========================================================================
       LOAD SELECTED BILL
    ======================================================================== */

    useEffect(() => {

        if (!isOpen) {

            return;

        }


        if (selectedBill) {

            setFormData({

                ...defaultForm,

                ...selectedBill,


                bill_month:

                    normalizeMonth(

                        selectedBill.bill_month

                    ),


                area_id:

                    selectedBill.area_id ||

                    selectedBill.area?.id ||

                    "",


                location:

                    selectedBill.location ||

                    selectedBill.area?.location ||

                    "",


                bill_address:

                    selectedBill.bill_address ||

                    selectedBill.address ||

                    "",


                solar_report_month:

                    normalizeMonth(

                        selectedBill.solar_report_month ||

                        selectedBill.report_month

                    ),


                solar_report_year:

                    selectedBill.solar_report_year ||

                    selectedBill.report_year ||

                    new Date().getFullYear(),


                ocr_status:

                    selectedBill.ocr_status === true ||

                    selectedBill.ocr_status === 1 ||

                    selectedBill.ocr_status === "1",


                ocr_confidence:

                    selectedBill.ocr_confidence || "",


                bill_image: null,

                solar_image: null,

            });

        } else {

            setFormData({

                ...defaultForm,

                bill_year:
                    new Date().getFullYear(),

                solar_report_year:
                    new Date().getFullYear(),

            });

        }

    }, [

        selectedBill,

        isOpen,

    ]);


    /* ========================================================================
       LOCATIONS
    ======================================================================== */

    const locations = useMemo(() => {

        return [

            ...new Set(

                areas

                    .map(

                        (area) =>

                            area.location?.trim()

                    )

                    .filter(Boolean)

            ),

        ];

    }, [areas]);


    /* ========================================================================
       HANDLE CHANGE
    ======================================================================== */

    const handleChange = (event) => {

        const {

            name,

            value,

            files,

        } = event.target;


        setFormData((previous) => {

            const updatedData = {

                ...previous,

                [name]:

                    files

                        ? files[0]

                        : value,

            };


            if (

                name === "units_consumed" ||

                name === "generated_units"

            ) {

                const unitsConsumed =

                    name === "units_consumed"

                        ? value

                        : previous.units_consumed;


                const generatedUnits =

                    name === "generated_units"

                        ? value

                        : previous.generated_units;


                updatedData.difference_units =

                    calculateDifference(

                        unitsConsumed,

                        generatedUnits

                    );

            }


            return updatedData;

        });

    };


    /* ========================================================================
       HANDLE AREA CHANGE
    ======================================================================== */

    const handleAreaChange = (event) => {

        const areaId =
            event.target.value;


        const selectedArea =
            areas.find(

                (area) =>

                    String(area.id) ===
                    String(areaId)

            );


        setFormData((previous) => ({

            ...previous,

            area_id: areaId,

            location:

                selectedArea?.location ||

                previous.location ||

                "",

        }));

    };


    /* ========================================================================
       WAPDA BILL OCR
    ======================================================================== */

    const handleBillOCR =
        async (file) => {

            try {

                setOcrLoading(true);


                const response =
                    await ocrService.processBill(
                        file
                    );


                const bill =

                    response?.data?.data ||

                    response?.data ||

                    {};


                if (
                    Object.keys(bill).length === 0
                ) {

                    alert(

                        "No OCR data returned from backend."

                    );

                    return;

                }


                const ocrAreaName =

                    bill.area_name ||

                    bill.area ||

                    "";


                const matchedArea =
                    areas.find(

                        (area) =>

                            area.area_name
                                ?.trim()
                                .toLowerCase() ===

                            ocrAreaName
                                ?.trim()
                                .toLowerCase()

                    );


                setFormData((previous) => {

                    const unitsConsumed =

                        bill.units_consumed ??

                        previous.units_consumed;


                    return {

                        ...previous,


                        consumer_name:

                            bill.consumer_name ||

                            previous.consumer_name,


                        reference_number:

                            bill.reference_number ||

                            previous.reference_number,


                        bill_month:

                            normalizeMonth(

                                bill.bill_month ??

                                previous.bill_month

                            ),


                        bill_year:

                            bill.bill_year ??

                            previous.bill_year,


                        bill_address:

                            bill.bill_address ||

                            bill.address ||

                            previous.bill_address,


                        area_id:

                            previous.area_id ||

                            matchedArea?.id ||

                            "",


                        location:

                            previous.location ||

                            matchedArea?.location ||

                            "",


                        units_consumed:

                            unitsConsumed,


                        bill_amount:

                            bill.bill_amount ??

                            previous.bill_amount,


                        status:

                            bill.status ||

                            previous.status,


                        ocr_status: true,


                        ocr_confidence:

                            bill.ocr_confidence ??

                            previous.ocr_confidence,


                        difference_units:

                            calculateDifference(

                                unitsConsumed,

                                previous.generated_units

                            ),


                        bill_image: file,

                    };

                });

            } catch (error) {

                console.error(

                    "WAPDA OCR Error:",

                    error

                );


                alert(

                    error?.response?.data?.message ||

                    error?.message ||

                    "OCR Processing Failed."

                );

            } finally {

                setOcrLoading(false);

            }

        };


    /* ========================================================================
       SOLAR OCR
    ======================================================================== */

    const handleSolarOCR =
        async (file) => {

            try {

                setSolarOcrLoading(true);


                const response =
                    await ocrService.processSolar(
                        file
                    );


                const solar =

                    response?.data?.data ||

                    response?.data ||

                    {};


                if (
                    Object.keys(solar).length === 0
                ) {

                    alert(

                        "No solar report data returned."

                    );

                    return;

                }


                setFormData((previous) => {

                    const generatedUnits =

                        solar.generated_units ??

                        solar.units_generated ??

                        previous.generated_units;


                    return {

                        ...previous,


                        generated_units:

                            generatedUnits,


                        solar_report_month:

                            normalizeMonth(

                                solar.report_month ||

                                solar.solar_report_month ||

                                previous.solar_report_month

                            ),


                        solar_report_year:

                            solar.report_year ||

                            solar.solar_report_year ||

                            previous.solar_report_year,


                        difference_units:

                            calculateDifference(

                                previous.units_consumed,

                                generatedUnits

                            ),


                        solar_image: file,

                    };

                });

            } catch (error) {

                console.error(

                    "Solar OCR Error:",

                    error

                );


                alert(

                    error?.response?.data?.message ||

                    error?.message ||

                    "Solar OCR Processing Failed."

                );

            } finally {

                setSolarOcrLoading(false);

            }

        };


    /* ========================================================================
       SUBMIT
    ======================================================================== */

    const handleSubmit =
        (event) => {

            event.preventDefault();


            const data =
                new FormData();


            Object.entries(formData).forEach(

                ([key, value]) => {

                    if (

                        value === null ||

                        value === undefined ||

                        value === ""

                    ) {

                        return;

                    }


                    if (

                        key === "bill_image" ||

                        key === "solar_image"

                    ) {

                        if (
                            value instanceof File
                        ) {

                            data.append(

                                key,

                                value

                            );

                        }

                        return;

                    }


                    if (key === "bill_month") {

                        data.append(

                            key,

                            getMonthNumber(value)

                        );

                        return;

                    }


                    if (
                        key ===
                        "solar_report_month"
                    ) {

                        data.append(

                            key,

                            getMonthNumber(value)

                        );

                        return;

                    }


                    if (key === "ocr_status") {

                        data.append(

                            key,

                            value
                                ? "1"
                                : "0"

                        );

                        return;

                    }


                    data.append(

                        key,

                        value

                    );

                }

            );


            onSave(data);

        };


    /* ========================================================================
       CLOSED STATE
    ======================================================================== */

    if (!isOpen) {

        return null;

    }


    /* ========================================================================
       RENDER
    ======================================================================== */

    return (

        <div className="modal-overlay">

            <div className="bill-modal">

                {/* ============================================================
                    HEADER
                ============================================================ */}

                <div className="modal-header">

                    <h2>

                        {selectedBill

                            ? "Edit Bill"

                            : "Add Bill"}

                    </h2>


                    <button

                        type="button"

                        className="close-btn"

                        onClick={onClose}

                    >

                        ✕

                    </button>

                </div>


                <form

                    className="bill-form"

                    onSubmit={handleSubmit}

                >

                    {/* ========================================================
                        OCR UPLOADS
                    ========================================================= */}

                    <div className="bill-ocr-row">

                        <div className="bill-ocr-item">

                            <label>
                                WAPDA Bill
                            </label>


                            <BillOCRUpload

                                title=""

                                buttonText={
                                    "Upload WAPDA Bill"
                                }

                                loadingText={
                                    "Scanning WAPDA Bill..."
                                }

                                successText={
                                    "WAPDA Bill scanned successfully."
                                }

                                loading={
                                    ocrLoading
                                }

                                onFileSelect={
                                    handleBillOCR
                                }

                            />

                        </div>


                        <div className="bill-ocr-item">

                            <label>
                                Solar Bill
                            </label>


                            <BillOCRUpload

                                title=""

                                buttonText={
                                    "Upload Solar Bill"
                                }

                                loadingText={
                                    "Scanning Solar Report..."
                                }

                                successText={
                                    "Solar report scanned successfully."
                                }

                                loading={
                                    solarOcrLoading
                                }

                                onFileSelect={
                                    handleSolarOCR
                                }

                            />

                        </div>

                    </div>


                    {/* ========================================================
                        AREA
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Select Area
                        </label>


                        <select

                            name="area_id"

                            value={
                                formData.area_id
                            }

                            onChange={
                                handleAreaChange
                            }

                        >

                            <option value="">
                                Select Area
                            </option>


                            {areas.map(
                                (area) => (

                                    <option

                                        key={
                                            area.id
                                        }

                                        value={
                                            area.id
                                        }

                                    >

                                        {
                                            area.area_name
                                        }

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* ========================================================
                        LOCATION
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Location
                        </label>


                        <select

                            name="location"

                            value={
                                formData.location
                            }

                            onChange={
                                handleChange
                            }

                        >

                            <option value="">
                                Select Location
                            </option>


                            {locations.map(
                                (location) => (

                                    <option

                                        key={
                                            location
                                        }

                                        value={
                                            location
                                        }

                                    >

                                        {location}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* ========================================================
                        CONSUMER NAME
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Consumer Name *
                        </label>


                        <input

                            type="text"

                            name="consumer_name"

                            value={
                                formData.consumer_name
                            }

                            onChange={
                                handleChange
                            }

                            required

                        />

                    </div>


                    {/* ========================================================
                        REFERENCE NUMBER
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Reference Number *
                        </label>


                        <input

                            type="text"

                            name="reference_number"

                            value={
                                formData.reference_number
                            }

                            onChange={
                                handleChange
                            }

                            required

                        />

                    </div>


                    {/* ========================================================
                        BILL MONTH
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Bill Month *
                        </label>


                        <select

                            name="bill_month"

                            value={
                                formData.bill_month
                            }

                            onChange={
                                handleChange
                            }

                            required

                        >

                            <option value="">
                                Select Month
                            </option>


                            {months.map(
                                (month) => (

                                    <option

                                        key={
                                            month
                                        }

                                        value={
                                            month
                                        }

                                    >

                                        {month}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* ========================================================
                        BILL YEAR
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Bill Year *
                        </label>


                        <input

                            type="number"

                            name="bill_year"

                            value={
                                formData.bill_year
                            }

                            onChange={
                                handleChange
                            }

                            required

                        />

                    </div>


                    {/* ========================================================
                        BILL ADDRESS
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Bill Address
                        </label>


                        <input

                            type="text"

                            name="bill_address"

                            value={
                                formData.bill_address
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </div>


                    {/* ========================================================
                        UNITS CONSUMED
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Units Consumed *
                        </label>


                        <input

                            type="number"

                            step="0.01"

                            name="units_consumed"

                            value={
                                formData.units_consumed
                            }

                            onChange={
                                handleChange
                            }

                            required

                        />

                    </div>


                    {/* ========================================================
                        BILL AMOUNT
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Bill Amount *
                        </label>


                        <input

                            type="number"

                            step="0.01"

                            name="bill_amount"

                            value={
                                formData.bill_amount
                            }

                            onChange={
                                handleChange
                            }

                            required

                        />

                    </div>


                    {/* ========================================================
                        GENERATED UNITS
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Solar Generated Units
                        </label>


                        <input

                            type="number"

                            step="0.01"

                            name="generated_units"

                            value={
                                formData.generated_units
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </div>


                    {/* ========================================================
                        SOLAR REPORT MONTH
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Solar Report Month
                        </label>


                        <select

                            name="solar_report_month"

                            value={
                                formData.solar_report_month
                            }

                            onChange={
                                handleChange
                            }

                        >

                            <option value="">
                                Select Month
                            </option>


                            {months.map(
                                (month) => (

                                    <option

                                        key={
                                            month
                                        }

                                        value={
                                            month
                                        }

                                    >

                                        {month}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* ========================================================
                        SOLAR REPORT YEAR
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Solar Report Year
                        </label>


                        <input

                            type="number"

                            name="solar_report_year"

                            value={
                                formData.solar_report_year
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </div>


                    {/* ========================================================
                        DIFFERENCE UNITS
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Difference Units
                        </label>


                        <input

                            type="number"

                            name="difference_units"

                            value={
                                formData.difference_units
                            }

                            readOnly

                        />

                    </div>


                    {/* ========================================================
                        STATUS
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Status
                        </label>


                        <select

                            name="status"

                            value={
                                formData.status
                            }

                            onChange={
                                handleChange
                            }

                        >

                            <option value="Paid">
                                Paid
                            </option>


                            <option value="Unpaid">
                                Unpaid
                            </option>

                        </select>

                    </div>


                    {/* ========================================================
                        GENERATION LOSS REASON
                    ========================================================= */}

                    <div className="form-group">

                        <label>
                            Generation Loss Reason
                        </label>


                        <input

                            type="text"

                            name="generation_loss_reason"

                            value={
                                formData.generation_loss_reason
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="Optional"

                        />

                    </div>


                    {/* ========================================================
                        FORM ACTIONS
                    ========================================================= */}

                    <FormActions

                        saveText={

                            selectedBill

                                ? "Update Bill"

                                : "Save Bill"

                        }

                        cancelText="Cancel"

                        onCancel={onClose}

                    />

                </form>

            </div>

        </div>

    );

}


export default WapdaBillModal;