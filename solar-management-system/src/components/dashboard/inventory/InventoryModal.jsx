import { useEffect, useState } from "react";

import FormActions from "../../common/FormActions";

import "./InventoryModal.css";

import inventoryService from "../../../services/inventoryService";

function InventoryModal({

    isOpen,

    onClose,

    onSave,

    selectedItem,

}) {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        item_type: "inverter",

        item_name: "",

        serial_number: "",

        manufacturer: "",

        capacity: "",

        quantity: "",

        minimum_stock: 5,

        condition: "New",

        battery_health: 100,

        status: "Available",

        remarks: "",

    });

    useEffect(() => {

        if (selectedItem) {

            setFormData({

                item_type: selectedItem.item_type || "inverter",

                item_name: selectedItem.item_name || "",

                serial_number: selectedItem.serial_number || "",

                manufacturer: selectedItem.manufacturer || "",

                capacity: selectedItem.capacity || "",

                quantity: selectedItem.quantity || "",

                minimum_stock:
                    selectedItem.minimum_stock || 5,

                condition: selectedItem.condition || "New",

                battery_health: selectedItem.battery_health || 100,

                status: selectedItem.status || "Available",

                remarks: selectedItem.remarks || "",

            });

        } else {

            resetForm();

        }

    }, [selectedItem]);

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

            battery_health: 100,

            status: "Available",

            remarks: "",

        });

    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (

            !formData.item_name ||

            !formData.serial_number ||

            !formData.manufacturer ||

            !formData.capacity ||

            !formData.quantity

        ) {

            alert("Please fill all required fields.");

            return;

        }

        try {

            setLoading(true);

            if (selectedItem) {

                await inventoryService.updateInventory(

                    selectedItem.id,

                    formData

                );

                alert("Inventory updated successfully.");

            } else {

                await inventoryService.createInventory(

                    formData

                );

                alert("Inventory created successfully.");

            }

            if (onSave) {

                await onSave();

            }

            resetForm();

            onClose();

        } catch (error) {

            console.error(error);

            alert("Failed to save inventory.");

        } finally {

            setLoading(false);

        }

    };

    if (!isOpen) {

        return null;

    }

    return (

        <div className="modal-overlay">

            <div className="inventory-modal">

                <div className="modal-header">

                    <h2>

                        {

                            selectedItem

                                ? "Edit Inventory"

                                : "Add Inventory"

                        }

                    </h2>

                    <button

                        className="close-btn"

                        onClick={onClose}

                    >

                        ×

                    </button>

                </div>

                <form

                    onSubmit={handleSubmit}

                    className="inventory-form"

                >

                    <div className="form-grid">
                        <div className="form-group">

                            <label>Item Type</label>

                            <select

                                name="item_type"

                                value={formData.item_type}

                                onChange={handleChange}

                            >

                                <option value="inverter">

                                    Inverter

                                </option>

                                <option value="solar_panel">

                                    Solar Panel

                                </option>

                                <option value="battery">

                                    Battery

                                </option>

                            </select>

                        </div>

                        <div className="form-group">

                            <label>Item Name</label>

                            <input

                                type="text"

                                name="item_name"

                                value={formData.item_name}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="form-group">

                            <label>Serial Number</label>

                            <input

                                type="text"

                                name="serial_number"

                                value={formData.serial_number}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="form-group">

                            <label>Manufacturer</label>

                            <input

                                type="text"

                                name="manufacturer"

                                value={formData.manufacturer}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="form-group">

                            <label>Capacity</label>

                            <input

                                type="number"

                                step="0.01"

                                name="capacity"

                                value={formData.capacity}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="form-group">

                            <label>Battery Health (%)</label>

                            <input
                                type="number"
                                name="battery_health"
                                min="0"
                                max="100"
                                step="0.01"
                                value={formData.battery_health}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group">

                            <label>Quantity</label>

                            <input

                                type="number"

                                min="1"

                                name="quantity"

                                value={formData.quantity}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="form-group">

                            <label>Minimum Stock</label>

                            <input

                                type="number"

                                min="0"

                                name="minimum_stock"

                                value={formData.minimum_stock}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="form-group">

                            <label>Condition</label>

                            <select

                                name="condition"

                                value={formData.condition}

                                onChange={handleChange}

                            >

                                <option value="New">

                                    New

                                </option>

                                <option value="Used">

                                    Used

                                </option>

                            </select>

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Remarks</label>

                        <textarea

                            rows="4"

                            name="remarks"

                            value={formData.remarks}

                            onChange={handleChange}

                        />

                    </div>

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

    );

}

export default InventoryModal;