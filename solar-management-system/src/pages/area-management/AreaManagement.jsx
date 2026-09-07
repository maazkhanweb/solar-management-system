/**
 * ============================================================================
 * File:
 * src/pages/area-management/AreaManagement.jsx
 *
 * Description:
 * Area Management page.
 * Phone field and phone search functionality have been removed.
 * ============================================================================
 */

import { useEffect, useState } from "react";

import "./AreaManagement.css";

import authService from "../../services/authService";

import AreaTable from "../../components/dashboard/area/AreaTable";
import AreaModal from "../../components/dashboard/area/AreaModal";
import DeleteAreaModal from "../../components/dashboard/area/DeleteAreaModal";
import AreaAssetsModal from "../../components/dashboard/area/AreaAssetsModal";
import AlertModal from "../../components/common/AlertModal/AlertModal";


const AreaManagement = () => {

    const [areas, setAreas] = useState([]);

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");


    const [selectedArea, setSelectedArea] =
        useState(null);


    const [isModalOpen, setIsModalOpen] =
        useState(false);


    const [isDeleteModalOpen, setIsDeleteModalOpen] =
        useState(false);


    const [isAssetsModalOpen, setIsAssetsModalOpen] =
        useState(false);


    const [selectedAssetsArea, setSelectedAssetsArea] =
        useState(null);


    const [assets, setAssets] =
        useState([]);


    const [assetsLoading, setAssetsLoading] =
        useState(false);


    const [alertData, setAlertData] = useState({

        isOpen: false,

        message: "",

        type: "success",

    });


    /* =========================================================
       LOAD INITIAL DATA
    ========================================================= */

    useEffect(() => {

        loadInitialData();

    }, []);


    /* =========================================================
       ALERT FUNCTIONS
    ========================================================= */

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


    const closeAlert = () => {

        setAlertData({

            isOpen: false,

            message: "",

            type: "success",

        });

    };


    /* =========================================================
       LOAD INITIAL DATA
    ========================================================= */

    const loadInitialData = async () => {

        try {

            setLoading(true);


            await Promise.all([

                loadAreas(),

                loadUsers(),

            ]);

        } finally {

            setLoading(false);

        }

    };


    /* =========================================================
       LOAD AREAS
    ========================================================= */

    const loadAreas = async () => {

        try {

            const response =
                await authService.getAreas();


            setAreas(

                response.areas?.data ||

                response.data ||

                response.areas ||

                []

            );

        } catch (error) {

            console.error(error);

            setAreas([]);

        }

    };


    /* =========================================================
       LOAD USERS
    ========================================================= */

    const loadUsers = async () => {

        try {

            const response =
                await authService.getUsers();


            setUsers(

                response.users?.data ||

                response.data ||

                response.users ||

                []

            );

        } catch (error) {

            console.error(error);

            setUsers([]);

        }

    };


    /* =========================================================
       OPEN ADD MODAL
    ========================================================= */

    const openAddModal = () => {

        setSelectedArea(null);

        setIsModalOpen(true);

    };


    /* =========================================================
       CLOSE AREA MODAL
    ========================================================= */

    const closeModal = () => {

        setSelectedArea(null);

        setIsModalOpen(false);

    };


    /* =========================================================
       SAVE AREA
    ========================================================= */

    const handleSaveArea = async (

        areaData

    ) => {

        try {

            const isEditing =
                Boolean(selectedArea);


            if (isEditing) {

                await authService.updateArea(

                    selectedArea.id,

                    areaData

                );

            } else {

                await authService.createArea(

                    areaData

                );

            }


            await loadAreas();


            closeModal();


            showAlert(

                isEditing
                    ? "Area updated successfully."
                    : "Area created successfully.",

                "success"

            );

        } catch (error) {

            console.error(error);


            showAlert(

                error.response?.data?.message ||

                "Failed to save area.",

                "error"

            );

        }

    };


    /* =========================================================
       ADD NEW AREA NAME
    ========================================================= */

    const handleAddArea = async (

        areaName

    ) => {

        const cleanedAreaName =
            areaName.trim();


        if (!cleanedAreaName) {

            return null;

        }


        const existingArea =
            areas.find(

                (area) =>

                    area.area_name
                        ?.trim()
                        .toLowerCase() ===

                    cleanedAreaName
                        .toLowerCase()

            );


        if (existingArea) {

            return {

                area_name:
                    existingArea.area_name,

            };

        }


        return {

            area_name:
                cleanedAreaName,

        };

    };


    /* =========================================================
       EDIT AREA
    ========================================================= */

    const handleEdit = (

        area

    ) => {

        setSelectedArea(area);

        setIsModalOpen(true);

    };


    /* =========================================================
       DELETE AREA
    ========================================================= */

    const handleDelete = (

        area

    ) => {

        setSelectedArea(area);

        setIsDeleteModalOpen(true);

    };


    /* =========================================================
       VIEW AREA ASSETS
    ========================================================= */

    const handleViewAssets = async (

        area

    ) => {

        try {

            setAssetsLoading(true);

            setSelectedAssetsArea(null);

            setAssets([]);

            setIsAssetsModalOpen(true);


            const response =
                await authService.getAreaAssets(

                    area.id

                );


            setSelectedAssetsArea(

                response.area

            );


            setAssets(

                response.inventory || []

            );

        } catch (error) {

            console.error(error);

            setIsAssetsModalOpen(false);


            showAlert(

                error.response?.data?.message ||

                "Failed to load area assets.",

                "error"

            );

        } finally {

            setAssetsLoading(false);

        }

    };


    /* =========================================================
       CLOSE ASSETS MODAL
    ========================================================= */

    const closeAssetsModal = () => {

        setIsAssetsModalOpen(false);

        setSelectedAssetsArea(null);

        setAssets([]);

    };


    /* =========================================================
       MOVE AREA INVENTORY TO WAREHOUSE
    ========================================================= */

    const handleMoveToInventory = async (

        area

    ) => {

        const confirmed =
            window.confirm(

                "Are you sure you want to move all installed inventory back to warehouse?"

            );


        if (!confirmed) {

            return;

        }


        try {

            const response =
                await authService.moveAreaToInventory(

                    area.id

                );


            await loadAreas();


            showAlert(

                response.message ||

                "Inventory moved successfully.",

                "success"

            );

        } catch (error) {

            console.error(error);


            showAlert(

                error.response?.data?.message ||

                "Failed to move inventory.",

                "error"

            );

        }

    };


    /* =========================================================
       CONFIRM DELETE
    ========================================================= */

    const confirmDelete = async () => {

        try {

            const response =
                await authService.deleteArea(

                    selectedArea.id

                );


            if (!response.success) {

                closeDeleteModal();


                showAlert(

                    response.message ||

                    "Unable to delete area.",

                    "error"

                );

                return;

            }


            await loadAreas();


            closeDeleteModal();


            showAlert(

                response.message ||

                "Area deleted successfully.",

                "success"

            );

        } catch (error) {

            console.error(error);

            closeDeleteModal();


            showAlert(

                error.response?.data?.message ||

                "Unable to delete area.",

                "error"

            );

        }

    };


    /* =========================================================
       CLOSE DELETE MODAL
    ========================================================= */

    const closeDeleteModal = () => {

        setSelectedArea(null);

        setIsDeleteModalOpen(false);

    };


    /* =========================================================
       FILTER AREAS

       Phone search has been removed.
    ========================================================= */

    const filteredAreas = areas.filter((area) => {

        const search =
            searchTerm.toLowerCase();


        return (

            area.area_name
                ?.toLowerCase()
                .includes(search) ||

            area.location
                ?.toLowerCase()
                .includes(search) ||

            area.manager
                ?.toLowerCase()
                .includes(search) ||

            area.status
                ?.toLowerCase()
                .includes(search)

        );

    });


    /* =========================================================
       PAGE UI
    ========================================================= */

    return (

        <div className="area-management">


            {/* =====================================================
                PAGE HEADER
            ====================================================== */}

            <div className="area-header">

                <h1>

                    Area Management

                </h1>


                <button

                    className="add-area-btn"

                    onClick={openAddModal}

                >

                    + Add Area

                </button>

            </div>


            {/* =====================================================
                SEARCH
            ====================================================== */}

            <div className="area-search">

                <input

                    type="text"

                    placeholder="Search Area..."

                    value={searchTerm}

                    onChange={(e) =>
                        setSearchTerm(
                            e.target.value
                        )
                    }

                />

            </div>


            {/* =====================================================
                AREA TABLE
            ====================================================== */}

            {

                loading ? (

                    <p>

                        Loading...

                    </p>

                ) : (

                    <AreaTable

                        areas={filteredAreas}

                        onEdit={handleEdit}

                        onDelete={handleDelete}

                        onMove={handleMoveToInventory}

                        onViewAssets={handleViewAssets}

                    />

                )

            }


            {/* =====================================================
                ADD / EDIT AREA MODAL
            ====================================================== */}

            <AreaModal

                isOpen={isModalOpen}

                onClose={closeModal}

                onSave={handleSaveArea}

                onAddArea={handleAddArea}

                selectedArea={selectedArea}

                areas={areas}

                users={users}

            />


            {/* =====================================================
                DELETE AREA MODAL
            ====================================================== */}

            <DeleteAreaModal

                isOpen={isDeleteModalOpen}

                selectedArea={selectedArea}

                onClose={closeDeleteModal}

                onConfirm={confirmDelete}

            />


            {/* =====================================================
                AREA ASSETS MODAL
            ====================================================== */}

            <AreaAssetsModal

                isOpen={isAssetsModalOpen}

                onClose={closeAssetsModal}

                area={selectedAssetsArea}

                assets={assets}

                loading={assetsLoading}

            />


            {/* =====================================================
                ALERT MODAL
            ====================================================== */}

            <AlertModal

                isOpen={alertData.isOpen}

                message={alertData.message}

                type={alertData.type}

                onClose={closeAlert}

            />

        </div>

    );

};


export default AreaManagement;