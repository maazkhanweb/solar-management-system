/**
 * ============================================================================
 * File:
 * src/components/dashboard/area/AddAreaModal.jsx
 *
 * Description:
 * Reusable Add Area Modal
 * ============================================================================
 */

import { useEffect, useState } from "react";

import FormActions from "../../common/FormActions";

import "./AddAreaModal.css";

function AddAreaModal({

    isOpen,

    onClose,

    onSave,

}) {

    const [formData, setFormData] = useState({

        area_name: "",

        location: "",

        manager: "",

        phone: "",

    });

    useEffect(() => {

        if (isOpen) {

            setFormData({

                area_name: "",

                location: "",

                manager: "",

                phone: "",

            });

        }

    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {

        const {

            name,

            value,

        } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSave(formData);

    };

    return (

        <div className="modal-overlay">

            <div className="add-area-modal">

                <div className="modal-header">

                    <h2>

                        Add New Area

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
                    className="add-area-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>

                            Area Name

                        </label>

                        <input
                            type="text"
                            name="area_name"
                            value={formData.area_name}
                            onChange={handleChange}
                            placeholder="Enter Area Name"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Location

                        </label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter Location"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Manager

                        </label>

                        <input
                            type="text"
                            name="manager"
                            value={formData.manager}
                            onChange={handleChange}
                            placeholder="Enter Manager Name"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Phone

                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter Phone Number"
                        />

                    </div>

                    <FormActions

                        saveText="Save Area"

                        cancelText="Cancel"

                        onCancel={onClose}

                    />

                </form>

            </div>

        </div>

    );

}

export default AddAreaModal;