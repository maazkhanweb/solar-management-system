import { useEffect, useState } from "react";

import FormActions from "../../common/FormActions";
import BillOCRUpload from "./BillOCRUpload";

import ocrService from "../../../services/ocrService";

import "./WapdaBillModal.css";

const defaultForm = {

    consumer_name: "",

    reference_number: "",

    bill_month: "",

    bill_year: new Date().getFullYear(),

    bill_address: "",

    units_consumed: "",

    bill_amount: "",

    generated_units: "",

    difference_units: "",

    status: "Unpaid",

    generation_loss_reason: "",

    remarks: "",

    bill_image: null,

    /*
    |--------------------------------------------------------------------------
    | NEW
    |--------------------------------------------------------------------------
    */

    ocr_status: false,

    ocr_confidence: 0,

};

function WapdaBillModal({

    isOpen,

    onClose,

    onSave,

    selectedBill,

    areas = [],

}) {

    const [formData, setFormData] = useState(defaultForm);

    const [ocrLoading, setOcrLoading] = useState(false);

    useEffect(() => {

        if (!isOpen) return;

        if (selectedBill) {

            setFormData({

                ...defaultForm,

                ...selectedBill,

                bill_image: null,

            });

        } else {

            setFormData(defaultForm);

        }

    }, [selectedBill, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {

        const { name, value, files } = e.target;

        let updatedData = {

            ...formData,

            [name]: files ? files[0] : value,

        };

        if (

            name === "generated_units" ||

            name === "units_consumed"

        ) {

            const billUnits =

                Number(updatedData.units_consumed || 0);

            const generatedUnits =

                Number(updatedData.generated_units || 0);

            const difference = Math.abs(

                generatedUnits -

                billUnits

            );

            updatedData.difference_units =

                difference.toFixed(2);

        }

        setFormData(updatedData);

    };

    /*
    |--------------------------------------------------------------------------
    | OCR
    |--------------------------------------------------------------------------
    */

    const handleOCR = async (file) => {

        try {

            setOcrLoading(true);

            const response =
                await ocrService.processBill(file);

            console.log("========== OCR RESPONSE ==========");

            console.log(response.data);

            console.log("=================================");

            if (!response.data.data) {

                alert("No OCR data returned from backend.");

                return;

            }

            const bill = response.data.data;
                        setFormData((prev) => ({

                ...prev,

                consumer_name:
                    bill.consumer_name || "",

                reference_number:
                    bill.reference_number || "",

                units_consumed:
                    bill.units_consumed || "",

                bill_amount:
                    bill.bill_amount || "",

                generated_units:
                    bill.generated_units || "",

                difference_units:
                    Math.abs(

                        Number(bill.units_consumed || 0)

                        -

                        Number(bill.generated_units || 0)

                    ).toFixed(2),

                bill_month:
                    bill.bill_month || "",

                bill_year:
                    bill.bill_year ||
                    new Date().getFullYear(),

                bill_address:
                    bill.bill_address ||
                    bill.area_name ||
                    "",

                bill_image:
                    file,

                /*
                |--------------------------------------------------------------------------
                | OCR Information
                |--------------------------------------------------------------------------
                */

                ocr_status:
                    bill.ocr_status ?? true,

                ocr_confidence:
                    bill.ocr_confidence ?? 100,

            }));

        } catch (error) {

            alert(

                error.response?.data?.message ||

                "OCR Processing Failed."

            );

        } finally {

            setOcrLoading(false);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (e) => {

    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {

        if (

            formData[key] !== null &&

            formData[key] !== ""

        ) {

            let value = formData[key];

            /*
            |--------------------------------------------------------------------------
            | Boolean Values
            |--------------------------------------------------------------------------
            */

            if (key === "ocr_status") {

                value = value ? 1 : 0;

            }

            /*
            |--------------------------------------------------------------------------
            | OCR Confidence
            |--------------------------------------------------------------------------
            */

            if (key === "ocr_confidence") {

                value = Number(value);

            }

            data.append(key, value);

        }

    });

    onSave(data);

};

    return (

        <div className="modal-overlay">

            <div className="bill-modal">

                <div className="modal-header">

                    <h2>

                        {

                            selectedBill

                                ? "Edit Bill"

                                : "Add Bill"

                        }

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
                                        {/* Consumer Name */}

                    <div className="form-group">

                        <label>Consumer Name *</label>

                        <input
                            type="text"
                            name="consumer_name"
                            value={formData.consumer_name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* Reference Number */}

                    <div className="form-group">

                        <label>Reference Number *</label>

                        <input
                            type="text"
                            name="reference_number"
                            value={formData.reference_number}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* Bill Month */}

                    <div className="form-group">

                        <label>Bill Month *</label>

                        <select
                            name="bill_month"
                            value={formData.bill_month}
                            onChange={handleChange}
                            required
                        >

                            <option value="">Select Month</option>

                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>

                        </select>

                    </div>

                    {/* Bill Year */}

                    <div className="form-group">

                        <label>Bill Year *</label>

                        <input
                            type="number"
                            name="bill_year"
                            value={formData.bill_year}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* Bill Address */}

                    <div className="form-group">

                        <label>Bill Address</label>

                        <input
                            type="text"
                            name="bill_address"
                            value={formData.bill_address}
                            onChange={handleChange}
                            placeholder="OCR will automatically detect the address"
                        />

                    </div>

                    {/* Units Consumed */}

                    <div className="form-group">

                        <label>Units Consumed *</label>

                        <input
                            type="number"
                            step="0.01"
                            name="units_consumed"
                            value={formData.units_consumed}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* Bill Amount */}

                    <div className="form-group">

                        <label>Bill Amount *</label>

                        <input
                            type="number"
                            step="0.01"
                            name="bill_amount"
                            value={formData.bill_amount}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* Generated Units */}

                    <div className="form-group">

                        <label>Inverter Generated Units</label>

                        <input
                            type="number"
                            step="0.01"
                            name="generated_units"
                            value={formData.generated_units}
                            onChange={handleChange}
                        />

                    </div>

                    {/* Difference Units */}

                    <div className="form-group">

                        <label>Difference Units</label>

                        <input
                            type="number"
                            step="0.01"
                            name="difference_units"
                            value={formData.difference_units}
                            onChange={handleChange}
                        />

                    </div>

                    {/* Status */}

                    <div className="form-group">

                        <label>Status *</label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >

                            <option value="Paid">
                                Paid
                            </option>

                            <option value="Unpaid">
                                Unpaid
                            </option>

                        </select>

                    </div>

                    {/* Generation Loss Reason */}

                    <div className="form-group">

                        <label>Generation Loss Reason</label>

                        <input
                            type="text"
                            name="generation_loss_reason"
                            value={formData.generation_loss_reason}
                            onChange={handleChange}
                            placeholder="Optional"
                        />

                    </div>

                    {/* OCR Upload */}

                    <div className="form-group full-width">

                        <label>Bill Image OCR</label>

                        <BillOCRUpload

                            loading={ocrLoading}

                            onFileSelect={handleOCR}

                        />

                    </div>

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
                