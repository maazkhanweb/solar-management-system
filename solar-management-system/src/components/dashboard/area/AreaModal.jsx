/**
 * ============================================================================
 * File:
 * src/components/dashboard/area/AreaModal.jsx
 *
 * Description:
 * Add and Edit Area modal.
 * Phone field is optional and is not required for saving an area.
 * ============================================================================
 */

import { useEffect, useState } from "react";

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
    users = [],
}) => {

    const [formData, setFormData] = useState({
        area_name: "",
        location: "",
        manager: "",
        status: "Active",
    });


    const [newAreaNames, setNewAreaNames] = useState([]);


    /* =========================================================
       SET FORM DATA
    ========================================================= */

    useEffect(() => {

        if (!isOpen) {
            return;
        }


        if (selectedArea) {

            setFormData({
                area_name: selectedArea.area_name || "",
                location: selectedArea.location || "",
                manager: selectedArea.manager || "",
                status: selectedArea.status || "Active",
            });

        } else {

            setFormData({
                area_name: "",
                location: "",
                manager: "",
                status: "Active",
            });

        }

    }, [
        isOpen,
        selectedArea,
    ]);


    /* =========================================================
       UNIQUE AREA NAMES
    ========================================================= */

    const uniqueAreaNames = [

        ...new Map(

            [
                ...areas
                    .filter((area) => area.area_name)
                    .map((area) =>
                        area.area_name.trim()
                    ),

                ...newAreaNames,
            ]

                .filter(Boolean)

                .map((areaName) => [

                    areaName
                        .trim()
                        .toLowerCase(),

                    areaName.trim(),

                ])

        ).values(),

    ];


    /* =========================================================
       UNIQUE USERS
    ========================================================= */

    const uniqueUsers = [

        ...new Map(

            users

                .filter((user) => user.name)

                .map((user) => [

                    user.id,

                    user,

                ])

        ).values(),

    ];


    /* =========================================================
       NORMAL INPUT CHANGE
    ========================================================= */

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


    /* =========================================================
       AREA CHANGE
    ========================================================= */

    const handleAreaChange = (value) => {

        setFormData((prev) => ({
            ...prev,
            area_name: value,
        }));

    };


    /* =========================================================
       ADD NEW AREA
    ========================================================= */

    const handleAddNewArea = async (areaName) => {

        if (!areaName?.trim()) {
            return null;
        }


        const cleanAreaName = areaName.trim();


        let result = null;


        if (onAddArea) {

            result = await onAddArea(
                cleanAreaName
            );

        }


        const savedAreaName =
            result?.area_name ||
            result?.name ||
            cleanAreaName;


        setNewAreaNames((prev) => {

            const alreadyExists =

                prev.some(

                    (name) =>

                        name
                            .trim()
                            .toLowerCase() ===

                        savedAreaName
                            .trim()
                            .toLowerCase()

                );


            if (alreadyExists) {
                return prev;
            }


            return [
                ...prev,
                savedAreaName,
            ];

        });


        setFormData((prev) => ({
            ...prev,
            area_name: savedAreaName,
        }));


        return {
            ...result,
            area_name: savedAreaName,
        };

    };


    /* =========================================================
       FORM SUBMIT
    ========================================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();


        // Phone number is NOT required.
        // Area can be saved without any phone field.

        await onSave(formData);

    };


    /* =========================================================
       CLOSE MODAL
    ========================================================= */

    if (!isOpen) {
        return null;
    }


    return (

        <div className="modal-overlay">

            <div className="modal">


                {/* =====================================================
                    MODAL HEADER
                ====================================================== */}

                <div className="modal-header">

                    <h2>
                        {
                            selectedArea
                                ? "Edit Area"
                                : "Add New Area"
                        }
                    </h2>


                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>

                </div>


                {/* =====================================================
                    AREA FORM
                ====================================================== */}

                <form
                    className="modal-body"
                    onSubmit={handleSubmit}
                >


                    {/* AREA NAME */}

                    <MasterSelect
                        label="Area Name"
                        value={formData.area_name}
                        options={uniqueAreaNames}
                        onChange={handleAreaChange}
                        onAddNew={handleAddNewArea}
                        placeholder="Select Area"
                        title="Add New Area"
                        modalPlaceholder="Enter Area Name"
                    />


                    {/* LOCATION */}

                    <div className="form-group">

                        <label>
                            Location
                        </label>


                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* MANAGER */}

                    <div className="form-group">

                        <label>
                            Manager
                        </label>


                        <select
                            name="manager"
                            value={formData.manager}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Manager
                            </option>


                            {
                                uniqueUsers.map((user) => (

                                    <option
                                        key={user.id}
                                        value={user.name}
                                    >
                                        {user.name}
                                    </option>

                                ))
                            }

                        </select>

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


                    {/* FORM ACTIONS */}

                    <FormActions
                        saveText={
                            selectedArea
                                ? "Update Area"
                                : "Save Area"
                        }
                        cancelText="Cancel"
                        onCancel={onClose}
                    />

                </form>

            </div>

        </div>

    );

};


export default AreaModal;