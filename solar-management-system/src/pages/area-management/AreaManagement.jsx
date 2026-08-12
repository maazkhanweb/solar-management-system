import { useEffect, useState } from "react";
import "./AreaManagement.css";

import authService from "../../services/authService";

import AreaTable from "../../components/dashboard/area/AreaTable";
import AreaModal from "../../components/dashboard/area/AreaModal";
import DeleteAreaModal from "../../components/dashboard/area/DeleteAreaModal";
import AreaAssetsModal from "../../components/dashboard/area/AreaAssetsModal";

const AreaManagement = () => {

    const [areas, setAreas] = useState([]);

    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedArea, setSelectedArea] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    /* ==========================================
       Area Assets States
    ========================================== */

    const [isAssetsModalOpen, setIsAssetsModalOpen] = useState(false);

    const [selectedAssetsArea, setSelectedAssetsArea] = useState(null);

    const [assets, setAssets] = useState([]);

    const [assetsLoading, setAssetsLoading] = useState(false);

    useEffect(() => {

        loadAreas();

    }, []);

    const loadAreas = async () => {

        try {

            setLoading(true);

           const response = await authService.getAreas();

console.log("Areas Response:", response);

setAreas(
    response.areas?.data ||
    response.data ||
    response.areas ||
    []
);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const openAddModal = () => {

        setSelectedArea(null);

        setIsModalOpen(true);

    };

    const closeModal = () => {

        setSelectedArea(null);

        setIsModalOpen(false);

    };

    const handleSaveArea = async (areaData) => {

        try {

            if (selectedArea) {

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

        } catch (error) {

            console.error(error);

        }

    };

    const handleAddArea = async (areaName) => {

    try {

        const areaData = {

            area_name: areaName,

            location: "-",

            manager: "-",

            phone: "-",

            status: "Active",

        };

        await authService.createArea(areaData);

        await loadAreas();

    } catch (error) {

        console.error(error);

        alert("Failed to add area.");

    }

};

    const handleEdit = (area) => {

        setSelectedArea(area);

        setIsModalOpen(true);

    };

    const handleDelete = (area) => {

        setSelectedArea(area);

        setIsDeleteModalOpen(true);

    };

    /* ==========================================
       View Area Assets
    ========================================== */

    const handleViewAssets = async (area) => {

        try {

            setAssetsLoading(true);

            setSelectedAssetsArea(null);

            setAssets([]);

            setIsAssetsModalOpen(true);

            const response = await authService.getAreaAssets(
                area.id
            );

            setSelectedAssetsArea(response.area);

            setAssets(response.inventory);

        } catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Failed to load area assets."

            );

        } finally {

            setAssetsLoading(false);

        }

    };

    const closeAssetsModal = () => {

        setIsAssetsModalOpen(false);

        setSelectedAssetsArea(null);

        setAssets([]);

    };

    const handleMoveToInventory = async (area) => {

        const confirmed = window.confirm(
            "Are you sure you want to move all installed inventory back to warehouse?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const response =
                await authService.moveAreaToInventory(area.id);

            alert(response.message);

            await loadAreas();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to move inventory."
            );

        }

    };
        const confirmDelete = async () => {

        try {

            const response = await authService.deleteArea(
                selectedArea.id
            );

            if (!response.success) {

                alert(response.message);

                return;

            }

            await loadAreas();

            closeDeleteModal();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to delete area."
            );

        }

    };

    const closeDeleteModal = () => {

        setSelectedArea(null);

        setIsDeleteModalOpen(false);

    };

    const filteredAreas = areas.filter((area) =>

        area.area_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||

        area.location
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||

        area.manager
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||

        area.phone
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||

        area.status
            .toLowerCase()
            .includes(searchTerm.toLowerCase())

    );

    return (

        <div className="area-management">

            <div className="area-header">

                <h1>Area Management</h1>

                <button
                    className="add-area-btn"
                    onClick={openAddModal}
                >
                    + Add Area
                </button>

            </div>

            <div className="area-search">

                <input
                    type="text"
                    placeholder="Search Area..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                />

            </div>

            {

                loading ? (

                    <p>Loading...</p>

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

            <AreaModal
    isOpen={isModalOpen}
    onClose={closeModal}
    onSave={handleSaveArea}
    onAddArea={handleAddArea}
    selectedArea={selectedArea}
    areas={areas}
/>

            <DeleteAreaModal
                isOpen={isDeleteModalOpen}
                selectedArea={selectedArea}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
            />

            <AreaAssetsModal
                isOpen={isAssetsModalOpen}
                onClose={closeAssetsModal}
                area={selectedAssetsArea}
                assets={assets}
                loading={assetsLoading}
            />

        </div>

    );

};

export default AreaManagement;