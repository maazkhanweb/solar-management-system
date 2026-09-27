/**
 * ============================================================================
 * File:
 * src/components/dashboard/inventory/InventoryModal.jsx
 *
 * Description:
 * Add and Edit Inventory modal.
 *
 * Features:
 * - Add inventory
 * - Edit inventory
 * - Inline form validation
 * - Damaged quantity support
 * - Damage reason support
 * - Inventory status support
 * - Remarks field removed
 * - Custom success/error alert
 * ============================================================================
 */

import { useEffect, useState } from "react";

import FormActions from "../../common/FormActions";

import MasterSelect from "../../common/MasterSelect/MasterSelect";

import AlertModal from "../../common/AlertModal/AlertModal";

import "./InventoryModal.css";

import inventoryService from "../../../services/inventoryService";


function InventoryModal({
    isOpen,
    onClose,
    onSave,
    selectedItem,
}) {

    /* =========================================================================
       Loading State
    ========================================================================= */

    const [loading, setLoading] = useState(false);


    /* =========================================================================
       Validation Errors
    ========================================================================= */

    const [errors, setErrors] = useState({});


    /* =========================================================================
       Custom Alert State
    ========================================================================= */

    const [alertData, setAlertData] = useState({

        isOpen: false,

        message: "",

        type: "success",

    });


    /* =========================================================================
       Dynamic Item Types
    ========================================================================= */

    const [itemTypes, setItemTypes] = useState([

        "inverter",

        "solar_panel",

        "battery",

    ]);


    /* =========================================================================
       Form Data
    ========================================================================= */

    const [formData, setFormData] = useState({

        item_type: "inverter",

        item_name: "",

        serial_number: "",

        manufacturer: "",

        capacity: "",

        quantity: "",

        minimum_stock: 5,

        condition: "New",

        status: "Available",

        damaged_quantity: 0,

        damage_reason: "",

    });


    /* =========================================================================
       Show Alert
    ========================================================================= */

    const showAlert = (
        message,
        type = "success"
    ) => {

        setAlertData({

            isOpen: true,

            message,

            type,

        });

    };


    /* =========================================================================
       Close Alert
    ========================================================================= */

    const closeAlert = () => {

        setAlertData((prev) => ({

            ...prev,

            isOpen: false,

        }));

    };


    /* =========================================================================
       Load Item Types
    ========================================================================= */

    const loadItemTypes = async () => {

        try {

            const response =
                await inventoryService.getInventory();


            const defaultTypes = [

                "inverter",

                "solar_panel",

                "battery",

            ];


            const inventoryItems =

                response.inventory

                ||

                response.data

                ||

                response

                ||

                [];


            const existingTypes = Array.from(

                new Set(

                    Array.isArray(inventoryItems)

                        ? inventoryItems

                            .map(
                                (item) =>
                                    item.item_type
                            )

                            .filter(Boolean)

                        : []

                )

            );


            const allTypes = Array.from(

                new Set([

                    ...defaultTypes,

                    ...existingTypes,

                ])

            );


            setItemTypes(allTypes);

        } catch (error) {

            console.error(
                "Failed to load item types:",
                error
            );

        }

    };


    /* =========================================================================
       Load Item Types When Modal Opens
    ========================================================================= */

    useEffect(() => {

        if (isOpen) {

            loadItemTypes();

        }

    }, [isOpen]);


    /* =========================================================================
       Load Selected Item For Edit
    ========================================================================= */

    useEffect(() => {

        if (selectedItem) {

            setFormData({

                item_type:
                    selectedItem.item_type
                    ||
                    "inverter",

                item_name:
                    selectedItem.item_name
                    ||
                    "",

                serial_number:
                    selectedItem.serial_number
                    ||
                    "",

                manufacturer:
                    selectedItem.manufacturer
                    ||
                    "",

                capacity:
                    selectedItem.capacity
                    ??
                    "",

                quantity:
                    selectedItem.quantity
                    ??
                    "",

                minimum_stock:
                    selectedItem.minimum_stock
                    ??
                    5,

                condition:
                    selectedItem.condition
                    ||
                    "New",

                /*
                 * IMPORTANT:
                 * Status was missing from the edit form.
                 * Laravel UpdateInventoryRequest requires it.
                 */
                status:
                    selectedItem.status
                    ||
                    "Available",

                damaged_quantity:
                    selectedItem.damaged_quantity
                    ??
                    0,

                damage_reason:
                    selectedItem.damage_reason
                    ||
                    "",

            });


            setErrors({});

        } else {

            resetForm();

        }

    }, [selectedItem, isOpen]);


    /* =========================================================================
       Reset Form
    ========================================================================= */

    const resetForm = () => {

        setFormData({

            item_type: "inverter",

            item_name: "",

            serial_number: "",

            manufacturer: "",

            capacity: "",

            quantity: "",

            minimum_stock: 5,

            condition: "New",

            status: "Available",

            damaged_quantity: 0,

            damage_reason: "",

        });


        setErrors({});

    };


    /* =========================================================================
       Validate Form
    ========================================================================= */

    const validateForm = () => {

        const newErrors = {};


        /* ---------------------------------------------------------------------
           Item Name
        --------------------------------------------------------------------- */

        if (!formData.item_name.trim()) {

            newErrors.item_name =
                "This field is required.";

        }


        /* ---------------------------------------------------------------------
           Serial Number
        --------------------------------------------------------------------- */

        if (!formData.serial_number.trim()) {

            newErrors.serial_number =
                "This field is required.";

        }


        /* ---------------------------------------------------------------------
           Manufacturer
        --------------------------------------------------------------------- */

        if (!formData.manufacturer.trim()) {

            newErrors.manufacturer =
                "This field is required.";

        }


        /* ---------------------------------------------------------------------
           Capacity
        --------------------------------------------------------------------- */

        if (
            formData.capacity === ""
            ||
            formData.capacity === null
        ) {

            newErrors.capacity =
                "This field is required.";

        }


        /* ---------------------------------------------------------------------
           Quantity
        --------------------------------------------------------------------- */

        if (
            formData.quantity === ""
            ||
            formData.quantity === null
        ) {

            newErrors.quantity =
                "This field is required.";

        }


        /* ---------------------------------------------------------------------
           Status
        --------------------------------------------------------------------- */

        if (!formData.status) {

            newErrors.status =
                "This field is required.";

        }


        /* ---------------------------------------------------------------------
           Damaged Quantity
        --------------------------------------------------------------------- */

        const quantity =
            Number(formData.quantity || 0);

        const damagedQuantity =
            Number(formData.damaged_quantity || 0);


        if (damagedQuantity < 0) {

            newErrors.damaged_quantity =
                "Damaged quantity cannot be negative.";

        }


        if (damagedQuantity > quantity) {

            newErrors.damaged_quantity =
                "Damaged quantity cannot be greater than total quantity.";

        }


        /* ---------------------------------------------------------------------
           Damage Reason
           Required only when damaged quantity is greater than 0.
        --------------------------------------------------------------------- */

        if (
            damagedQuantity > 0
            &&
            !formData.damage_reason.trim()
        ) {

            newErrors.damage_reason =
                "Please enter the damage reason.";

        }


        setErrors(newErrors);


        return Object.keys(newErrors).length === 0;

    };


    /* =========================================================================
       Normal Input Change
    ========================================================================= */

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));


        /* ---------------------------------------------------------------------
           Automatically clear damage reason when damaged quantity is 0.
        --------------------------------------------------------------------- */

        if (
            name === "damaged_quantity"
            &&
            Number(value || 0) === 0
        ) {

            setFormData((prev) => ({

                ...prev,

                damaged_quantity: value,

                damage_reason: "",

            }));

        }


        /* ---------------------------------------------------------------------
           Remove Error When User Starts Typing
        --------------------------------------------------------------------- */

        if (errors[name]) {

            setErrors((prev) => {

                const updatedErrors = {
                    ...prev,
                };


                delete updatedErrors[name];


                return updatedErrors;

            });

        }

    };


    /* =========================================================================
       Item Type Change
    ========================================================================= */

    const handleItemTypeChange = (value) => {

        setFormData((prev) => ({

            ...prev,

            item_type: value,

        }));

    };


    /* =========================================================================
       Submit Form
    ========================================================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();


        /* ---------------------------------------------------------------------
           Run Inline Validation
        --------------------------------------------------------------------- */

        const isValid = validateForm();


        if (!isValid) {

            return;

        }


        try {

            setLoading(true);


            /* -----------------------------------------------------------------
               Update Inventory
            ----------------------------------------------------------------- */

            if (selectedItem) {

                await inventoryService.updateInventory(

                    selectedItem.id,

                    formData

                );


                await loadItemTypes();


                if (onSave) {

                    await onSave();

                }


                resetForm();

                onClose();


                showAlert(

                    "Inventory updated successfully.",

                    "success"

                );

            }


            /* -----------------------------------------------------------------
               Create Inventory
            ----------------------------------------------------------------- */

            else {

                await inventoryService.createInventory(

                    formData

                );


                await loadItemTypes();


                if (onSave) {

                    await onSave();

                }


                resetForm();

                onClose();


                showAlert(

                    "Inventory created successfully.",

                    "success"

                );

            }

        } catch (error) {

            console.error(
                "Inventory save error:",
                error
            );


            /* -----------------------------------------------------------------
               Backend Validation Error
            ----------------------------------------------------------------- */

            const backendErrors =
                error?.response?.data?.errors;


            if (backendErrors) {

                const formattedErrors = {};


                Object.keys(backendErrors).forEach(
                    (field) => {

                        formattedErrors[field] =
                            Array.isArray(
                                backendErrors[field]
                            )

                                ? backendErrors[field][0]

                                : backendErrors[field];

                    }
                );


                setErrors(formattedErrors);

                return;

            }


            /* -----------------------------------------------------------------
               Backend General Error
            ----------------------------------------------------------------- */

            showAlert(

                error?.response?.data?.message
                ||
                "Failed to save inventory.",

                "error"

            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================================================================
       Don't Render Main Modal When Closed
    ========================================================================= */

    if (!isOpen) {

        return (

            <AlertModal

                isOpen={alertData.isOpen}

                message={alertData.message}

                type={alertData.type}

                onClose={closeAlert}

            />

        );

    }


    return (

        <>

            {/* =================================================================
                Inventory Modal
            ================================================================= */}

            <div className="modal-overlay">

                <div className="inventory-modal">


                    {/* =========================================================
                        Modal Header
                    ========================================================= */}

                    <div className="modal-header">

                        <h2>

                            {
                                selectedItem
                                    ? "Edit Inventory"
                                    : "Add Inventory"
                            }

                        </h2>


                        <button

                            type="button"

                            className="close-btn"

                            onClick={onClose}

                            aria-label="Close"

                        >

                            ×

                        </button>

                    </div>


                    {/* =========================================================
                        Inventory Form
                    ========================================================= */}

                    <form

                        onSubmit={handleSubmit}

                        className="inventory-form"

                    >

                        <div className="form-grid">


                            {/* =================================================
                                Item Type
                            ================================================= */}

                            <MasterSelect

                                label="Item Type"

                                value={formData.item_type}

                                options={itemTypes}

                                onChange={
                                    handleItemTypeChange
                                }

                                placeholder="Select Item Type"

                                title="Add New Item Type"

                                modalPlaceholder="Enter Item Type"

                            />


                            {/* =================================================
                                Item Name
                            ================================================= */}

                            <div

                                className={
                                    `form-group ${
                                        errors.item_name
                                            ? "has-error"
                                            : ""
                                    }`
                                }

                            >

                                <label>

                                    Item Name

                                    <span className="required-mark">

                                        *

                                    </span>

                                </label>


                                <input

                                    type="text"

                                    name="item_name"

                                    value={
                                        formData.item_name
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    className={
                                        errors.item_name
                                            ? "input-error"
                                            : ""
                                    }

                                />


                                {
                                    errors.item_name && (

                                        <span className="validation-error">

                                            {
                                                errors.item_name
                                            }

                                        </span>

                                    )
                                }

                            </div>


                            {/* =================================================
                                Serial Number
                            ================================================= */}

                            <div

                                className={
                                    `form-group ${
                                        errors.serial_number
                                            ? "has-error"
                                            : ""
                                    }`
                                }

                            >

                                <label>

                                    Serial Number

                                    <span className="required-mark">

                                        *

                                    </span>

                                </label>


                                <input

                                    type="text"

                                    name="serial_number"

                                    value={
                                        formData.serial_number
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    className={
                                        errors.serial_number
                                            ? "input-error"
                                            : ""
                                    }

                                />


                                {
                                    errors.serial_number && (

                                        <span className="validation-error">

                                            {
                                                errors.serial_number
                                            }

                                        </span>

                                    )
                                }

                            </div>


                            {/* =================================================
                                Manufacturer
                            ================================================= */}

                            <div

                                className={
                                    `form-group ${
                                        errors.manufacturer
                                            ? "has-error"
                                            : ""
                                    }`
                                }

                            >

                                <label>

                                    Manufacturer

                                    <span className="required-mark">

                                        *

                                    </span>

                                </label>


                                <input

                                    type="text"

                                    name="manufacturer"

                                    value={
                                        formData.manufacturer
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    className={
                                        errors.manufacturer
                                            ? "input-error"
                                            : ""
                                    }

                                />


                                {
                                    errors.manufacturer && (

                                        <span className="validation-error">

                                            {
                                                errors.manufacturer
                                            }

                                        </span>

                                    )
                                }

                            </div>


                            {/* =================================================
                                Capacity
                            ================================================= */}

                            <div

                                className={
                                    `form-group ${
                                        errors.capacity
                                            ? "has-error"
                                            : ""
                                    }`
                                }

                            >

                                <label>

                                    Capacity

                                    <span className="required-mark">

                                        *

                                    </span>

                                </label>


                                <input

                                    type="number"

                                    step="0.01"

                                    name="capacity"

                                    value={
                                        formData.capacity
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    className={
                                        errors.capacity
                                            ? "input-error"
                                            : ""
                                    }

                                />


                                {
                                    errors.capacity && (

                                        <span className="validation-error">

                                            {
                                                errors.capacity
                                            }

                                        </span>

                                    )
                                }

                            </div>


                            {/* =================================================
                                Quantity
                            ================================================= */}

                            <div

                                className={
                                    `form-group ${
                                        errors.quantity
                                            ? "has-error"
                                            : ""
                                    }`
                                }

                            >

                                <label>

                                    Quantity

                                    <span className="required-mark">

                                        *

                                    </span>

                                </label>


                                <input

                                    type="number"

                                    min="1"

                                    name="quantity"

                                    value={
                                        formData.quantity
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    className={
                                        errors.quantity
                                            ? "input-error"
                                            : ""
                                    }

                                />


                                {
                                    errors.quantity && (

                                        <span className="validation-error">

                                            {
                                                errors.quantity
                                            }

                                        </span>

                                    )
                                }

                            </div>


                            {/* =================================================
                                Damaged Quantity
                            ================================================= */}

                            <div

                                className={
                                    `form-group ${
                                        errors.damaged_quantity
                                            ? "has-error"
                                            : ""
                                    }`
                                }

                            >

                                <label>

                                    Damaged Quantity

                                </label>


                                <input

                                    type="number"

                                    min="0"

                                    name="damaged_quantity"

                                    value={
                                        formData.damaged_quantity
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    className={
                                        errors.damaged_quantity
                                            ? "input-error"
                                            : ""
                                    }

                                />


                                {
                                    errors.damaged_quantity && (

                                        <span className="validation-error">

                                            {
                                                errors.damaged_quantity
                                            }

                                        </span>

                                    )
                                }

                            </div>


                            {/* =================================================
                                Minimum Stock
                            ================================================= */}

                            <div className="form-group">

                                <label>

                                    Minimum Stock

                                </label>


                                <input

                                    type="number"

                                    min="0"

                                    name="minimum_stock"

                                    value={
                                        formData.minimum_stock
                                    }

                                    onChange={
                                        handleChange
                                    }

                                />

                            </div>


                            {/* =================================================
                                Condition
                            ================================================= */}

                            <div className="form-group">

                                <label>

                                    Condition

                                </label>


                                <select

                                    name="condition"

                                    value={
                                        formData.condition
                                    }

                                    onChange={
                                        handleChange
                                    }

                                >

                                    <option value="New">

                                        New

                                    </option>


                                    <option value="Used">

                                        Used

                                    </option>

                                </select>

                            </div>


                            {/* =================================================
                                Status
                            ================================================= */}

                            <div

                                className={
                                    `form-group ${
                                        errors.status
                                            ? "has-error"
                                            : ""
                                    }`
                                }

                            >

                                <label>

                                    Status

                                    <span className="required-mark">

                                        *

                                    </span>

                                </label>


                                <select

                                    name="status"

                                    value={
                                        formData.status
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    className={
                                        errors.status
                                            ? "input-error"
                                            : ""
                                    }

                                >

                                    <option value="Available">

                                        Available

                                    </option>


                                    <option value="Installed">

                                        Installed

                                    </option>

                                </select>


                                {
                                    errors.status && (

                                        <span className="validation-error">

                                            {
                                                errors.status
                                            }

                                        </span>

                                    )
                                }

                            </div>


                            {/* =================================================
                                Damage Reason
                            ================================================= */}

                            <div

                                className={
                                    `form-group ${
                                        errors.damage_reason
                                            ? "has-error"
                                            : ""
                                    }`
                                }

                            >

                                <label>

                                    Damage Reason

                                    {
                                        Number(
                                            formData.damaged_quantity || 0
                                        ) > 0 && (

                                            <span className="required-mark">

                                                *

                                            </span>

                                        )
                                    }

                                </label>


                                <input

                                    type="text"

                                    name="damage_reason"

                                    value={
                                        formData.damage_reason
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    disabled={
                                        Number(
                                            formData.damaged_quantity || 0
                                        ) === 0
                                    }

                                    placeholder={
                                        Number(
                                            formData.damaged_quantity || 0
                                        ) > 0

                                            ? "Enter damage reason"

                                            : "No damaged items"
                                    }

                                    className={
                                        errors.damage_reason
                                            ? "input-error"
                                            : ""
                                    }

                                />


                                {
                                    errors.damage_reason && (

                                        <span className="validation-error">

                                            {
                                                errors.damage_reason
                                            }

                                        </span>

                                    )
                                }

                            </div>

                        </div>


                        {/* ====================================================
                            Form Actions
                        ===================================================== */}

                        <FormActions

                            saveText={
                                loading

                                    ? "Saving..."

                                    : selectedItem

                                        ? "Update Inventory"

                                        : "Save Inventory"
                            }

                            cancelText="Cancel"

                            onCancel={onClose}

                        />

                    </form>

                </div>

            </div>


            {/* ================================================================
                Backend Error Alert
            ================================================================= */}

            <AlertModal

                isOpen={alertData.isOpen}

                message={alertData.message}

                type={alertData.type}

                onClose={closeAlert}

            />

        </>

    );

}


export default InventoryModal;