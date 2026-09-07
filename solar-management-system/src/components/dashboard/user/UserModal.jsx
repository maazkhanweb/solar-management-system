/**
 * ============================================================================
 * File:
 * src/components/dashboard/user/UserModal.jsx
 *
 * Description:
 * Add and Edit User Modal.
 * Area selection has been removed.
 * ============================================================================
 */

import {
    useState,
    useEffect,
} from "react";

import FormActions from "../../common/FormActions";

import "./UserModal.css";


function UserModal({

    isOpen,

    onClose,

    onSave,

    selectedUser,

}) {

    const [formData, setFormData] = useState({

        name: "",

        email: "",

        phone: "",

        password: "",

        role: "Administrator",

        status: "Active",

    });


    /* =========================================================
       SET FORM DATA
    ========================================================= */

    useEffect(() => {

        if (!isOpen) {

            return;

        }


        if (selectedUser) {

            setFormData({

                name:
                    selectedUser.name || "",

                email:
                    selectedUser.email || "",

                phone:
                    selectedUser.phone || "",

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

                password: "",

                role: "Administrator",

                status: "Active",

            });

        }

    }, [

        selectedUser,
        isOpen,

    ]);


    /* =========================================================
       INPUT CHANGE
    ========================================================= */

    const handleChange = (e) => {

        const {

            name,

            value,

            files,

        } = e.target;


        setFormData((prev) => ({

            ...prev,

            [name]:

                files
                    ? files[0]
                    : value,

        }));

    };


    /* =========================================================
       FORM SUBMIT
    ========================================================= */

    const handleSubmit = (e) => {

        e.preventDefault();


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


    /* =========================================================
       CLOSE MODAL
    ========================================================= */

    if (!isOpen) {

        return null;

    }


    return (

        <div className="modal-overlay">

            <div className="user-modal">


                {/* =====================================================
                    MODAL HEADER
                ====================================================== */}

                <div className="modal-header">

                    <h2>

                        {
                            selectedUser
                                ? "Edit User"
                                : "Add User"
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


                {/* =====================================================
                    USER FORM
                ====================================================== */}

                <form onSubmit={handleSubmit}>


                    <div className="form-grid">


                        {/* FULL NAME */}

                        <div className="form-group">

                            <label>

                                Full Name

                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label>

                                Email

                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />

                        </div>


                        {/* PHONE */}

                        <div className="form-group">

                            <label>

                                Phone

                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />

                        </div>


                        {/* ROLE */}

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


                        {/* PASSWORD */}

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


                        {/* STATUS */}

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


                    </div>


                    {/* =====================================================
                        FORM ACTIONS
                    ====================================================== */}

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

        </div>

    );

}


export default UserModal;