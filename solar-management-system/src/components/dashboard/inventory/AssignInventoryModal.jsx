import { useEffect, useState } from "react";

import "./AssignInventoryModal.css";

const AssignInventoryModal = ({

    isOpen,

    onClose,

    onAssign,

    inventory,

    areas,

    loading,

}) => {

    const [formData, setFormData] = useState({

        area_id: "",

        quantity: 1,

        remarks: "",

    });

    useEffect(() => {

        if (isOpen) {

            setFormData({

                area_id: "",

                quantity: 1,

                remarks: "",

            });

        }

    }, [isOpen]);

    if (!isOpen) {

        return null;

    }

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!formData.area_id) {

            alert("Please select an area.");

            return;

        }

        if (

            !formData.quantity ||

            Number(formData.quantity) <= 0

        ) {

            alert("Please enter a valid quantity.");

            return;

        }

        onAssign({

            inventory_item_id: inventory.id,

            area_id: formData.area_id,

            quantity: Number(formData.quantity),

            remarks: formData.remarks,

        });

    };

    return (

        <div className="assign-modal-overlay">

            <div className="assign-modal">

                <div className="assign-modal-header">

                    <h2>

                        Assign Inventory

                    </h2>

                    <button

                        className="close-btn"

                        onClick={onClose}

                    >

                        ×

                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="inventory-info">

                        <p>

                            <strong>Item :</strong>

                            {inventory?.item_name}

                        </p>

                        <p>

                            <strong>Serial :</strong>

                            {inventory?.serial_number}

                        </p>

                        <p>

                            <strong>Available :</strong>

                            {inventory?.available_quantity}

                        </p>
                    </div>

                    <div className="form-group">

                        <label>

                            Area <span>*</span>

                        </label>

                        <select

                            name="area_id"

                            value={formData.area_id}

                            onChange={handleChange}

                            required

                        >

                            <option value="">

                                Select Area

                            </option>

                            {

                                areas.map((area) => (

                                    <option

                                        key={area.id}

                                        value={area.id}

                                    >

                                        {area.area_name}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div className="form-group">

                        <label>

                            Quantity <span>*</span>

                        </label>

                        <input

                            type="number"

                            name="quantity"

                            min="1"

                            max={

                                inventory?.available_quantity || 1

                            }

                            value={formData.quantity}

                            onChange={handleChange}

                            required

                        />

                        <small>

                            Available Stock :{" "}

                            {

                                inventory?.available_quantity

                            }

                        </small>

                    </div>

                    <div className="form-group">

                        <label>

                            Remarks

                        </label>

                        <textarea

                            name="remarks"

                            rows="4"

                            value={formData.remarks}

                            onChange={handleChange}

                            placeholder="Enter remarks..."

                        />

                    </div>

                    <div className="assign-modal-footer">

                        <button

                            type="button"

                            className="cancel-btn"

                            onClick={onClose}

                            disabled={loading}

                        >

                            Cancel

                        </button>

                        <button

                            type="submit"

                            className="assign-btn"

                            disabled={

                                loading ||

                                inventory?.available_quantity <= 0

                            }

                        >

                            {

                                loading

                                    ? "Assigning..."

                                    : "Assign Inventory"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};

export default AssignInventoryModal;