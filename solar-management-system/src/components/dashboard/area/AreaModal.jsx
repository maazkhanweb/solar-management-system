import { useState, useEffect } from "react";
import MasterSelect from "../../common/MasterSelect/MasterSelect";
import FormActions from "../../common/FormActions";
import "./AreaModal.css";


const AreaModal = ({
    isOpen,
    onClose,
    onSave,
    onAddArea,
    selectedArea,
    areas = [],
}) => {

    const [formData, setFormData] = useState({
        area_name: "",
        location: "",
        manager: "",
        phone: "",
        status: "Active",
    });

    useEffect(() => {

        if (!isOpen) return;

        if (selectedArea) {

            setFormData({
                area_name: selectedArea.area_name || "",
                location: selectedArea.location || "",
                manager: selectedArea.manager || "",
                phone: selectedArea.phone || "",
                status: selectedArea.status || "Active",
            });

        } else {

            setFormData({
                area_name: "",
                location: "",
                manager: "",
                phone: "",
                status: "Active",
            });

        }

    }, [selectedArea, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    };

    const handleAreaChange = (value) => {

        setFormData((prev) => ({
            ...prev,
            area_name: value,
        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSave(formData);

        onClose();

    };

    return (

        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">

                    <h2>

                        {selectedArea ? "Edit Area" : "Add New Area"}

                    </h2>

                </div>

                <form
                    className="modal-body"
                    onSubmit={handleSubmit}
                >

                    <MasterSelect
    label="Area Name"
    value={formData.area_name}
    options={areas.map((area) => area.area_name)}
    onChange={handleAreaChange}
    onAddNew={onAddArea}
    placeholder="Select Area"
    title="Add New Area"
    modalPlaceholder="Enter Area Name"
/>

                    <div className="form-group">

                        <label>Location</label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Manager</label>

                        <input
                            type="text"
                            name="manager"
                            value={formData.manager}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Phone</label>

                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Status</label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                    </div>

                    <FormActions
                        saveText={selectedArea ? "Update Area" : "Save Area"}
                        cancelText="Cancel"
                        onCancel={onClose}
                    />

                </form>

            </div>

        </div>

    );

};

export default AreaModal;