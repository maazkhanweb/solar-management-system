import { useState, useEffect } from "react";

import FormActions from "../../common/FormActions";

import AddMasterModal from "../../common/MasterSelect/AddMasterModal";

import "./UserModal.css";

function UserModal({

    isOpen,

    onClose,

    onSave,

    onAddArea,

    selectedUser,

    areas = [],

}) {

    const [formData, setFormData] = useState({

        name: "",

        email: "",

        phone: "",

        area_id: "",

        password: "",

        role: "Administrator",

        status: "Active",

    });

    const [showAddAreaModal, setShowAddAreaModal] = useState(false);

    useEffect(() => {

        if (!isOpen) return;

        if (selectedUser) {

            setFormData({

                name: selectedUser.name || "",

                email: selectedUser.email || "",

                phone: selectedUser.phone || "",

                area_id:
                    selectedUser.area_id ||
                    selectedUser.area?.id ||
                    "",

                password: "",

                role:
                    selectedUser.role ||
                    "Administrator",

                status:
                    selectedUser.status ||
                    "Active",

            });

        } else {

            setFormData({

                name: "",

                email: "",

                phone: "",

                area_id: "",

                password: "",

                role: "Administrator",

                status: "Active",

            });

        }

    }, [selectedUser, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {

        const {

            name,

            value,

            files,

        } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: files

                ? files[0]

                : value,

        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (

            formData.role !== "Administrator" &&

            !formData.area_id

        ) {

            alert("Please select an Area.");

            return;

        }

        const data = new FormData();

        Object.keys(formData).forEach((key) => {

            if (

                formData[key] !== null &&

                formData[key] !== ""

            ) {

                data.append(

                    key,

                    formData[key]

                );

            }

        });

        onSave(data);

    };

    const handleSaveArea = async (areaName) => {

        if (!areaName.trim()) {

            return;

        }

        if (typeof onAddArea === "function") {

            const success = await onAddArea(areaName);

            if (success) {

                setShowAddAreaModal(false);

            }

        }

    };

    return (

        <div className="modal-overlay">

            <div className="user-modal">

                <div className="modal-header">

                    <h2>

                        {selectedUser

                            ? "Edit User"

                            : "Add User"}

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
                    className="user-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>

                            Full Name

                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Email

                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
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
                        />

                    </div>
                                        <div className="form-group">

                        <label>

                            Role

                        </label>

                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >

                            <option value="Administrator">

                                Administrator

                            </option>

                            <option value="Manager">

                                Manager

                            </option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label>

                            Area

                        </label>

                        <select
                            name="area_id"
                            value={formData.area_id}
                            onChange={handleChange}
                            disabled={
                                formData.role ===
                                "Administrator"
                            }
                            required={
                                formData.role !==
                                "Administrator"
                            }
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

                        {

                            formData.role !== "Administrator" && (

                                <button
                                    type="button"
                                    className="add-area-btn"
                                    onClick={() =>
                                        setShowAddAreaModal(true)
                                    }
                                >

                                    + Add New Area

                                </button>

                            )

                        }

                    </div>

                    <div className="form-group">

                        <label>

                            Password

                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={
                                selectedUser
                                    ? "Leave blank to keep current password"
                                    : "Enter password"
                            }
                            required={!selectedUser}
                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Status

                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >

                            <option value="Active">

                                Active

                            </option>

                            <option value="Inactive">

                                Inactive

                            </option>

                        </select>

                    </div>

                    <FormActions
                        saveText={
                            selectedUser
                                ? "Update User"
                                : "Save User"
                        }
                        cancelText="Cancel"
                        onCancel={onClose}
                    />

                </form>

            </div>

            <AddMasterModal

                isOpen={showAddAreaModal}

                title="Add New Area"

                placeholder="Enter Area Name"

                onClose={() =>
                    setShowAddAreaModal(false)
                }

                onSave={handleSaveArea}

            />

        </div>

    );

}

export default UserModal;