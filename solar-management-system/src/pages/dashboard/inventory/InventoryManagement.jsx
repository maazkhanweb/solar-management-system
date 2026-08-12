import { useEffect, useMemo, useState } from "react";

import "./InventoryManagement.css";

import authService from "../../../services/authService";
import inventoryService from "../../../services/inventoryService";

import InventoryTable from "../../../components/dashboard/inventory/InventoryTable";
import InventoryModal from "../../../components/dashboard/inventory/InventoryModal";
import DeleteInventoryModal from "../../../components/dashboard/inventory/DeleteInventoryModal";
import AssignInventoryModal from "../../../components/dashboard/inventory/AssignInventoryModal";

function InventoryManagement() {

    /* ==========================================
       States
    ========================================== */

    const [inventory, setInventory] = useState([]);

    const [areas, setAreas] = useState([]);

    const [loading, setLoading] = useState(true);

    const [assignLoading, setAssignLoading] = useState(false);

    /* ==========================================
       Search & Filters
    ========================================== */

    const [searchTerm, setSearchTerm] = useState("");

    const [itemTypeFilter, setItemTypeFilter] = useState("All");

    const [statusFilter, setStatusFilter] = useState("All");

    const [conditionFilter, setConditionFilter] = useState("All");

    /* ==========================================
       Inventory Modal
    ========================================== */

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    /* ==========================================
       Delete Modal
    ========================================== */

    const [deleteModal, setDeleteModal] = useState(false);

    const [deleteItem, setDeleteItem] = useState(null);

    const [deleteLoading, setDeleteLoading] = useState(false);

    /* ==========================================
       Assign Modal
    ========================================== */

    const [assignModalOpen, setAssignModalOpen] = useState(false);

    const [selectedInventory, setSelectedInventory] = useState(null);

    /* ==========================================
       Initial Load
    ========================================== */

    useEffect(() => {

        loadInventory();

        loadAreas();

    }, []);

    /* ==========================================
       Load Inventory
    ========================================== */

    const loadInventory = async () => {

        try {

            setLoading(true);

            const response =
                await inventoryService.getInventory();

            setInventory(response.data);

        }

        catch (error) {

            console.error(error);

            alert("Failed to load inventory.");

        }

        finally {

            setLoading(false);

        }

    };

    /* ==========================================
       Load Areas
    ========================================== */

    const loadAreas = async () => {

        try {

            const response =
                await authService.getAreas();

            setAreas(response.areas.data);

        }

        catch (error) {

            console.error(error);

            alert("Failed to load areas.");

        }

    };
        /* ==========================================
       Inventory Modal Functions
    ========================================== */

    const openAddModal = () => {

        setSelectedItem(null);

        setIsModalOpen(true);

    };

    const closeModal = () => {

        setSelectedItem(null);

        setIsModalOpen(false);

    };

    const handleEdit = (item) => {

        setSelectedItem(item);

        setIsModalOpen(true);

    };

    const handleSave = async () => {

        await loadInventory();

    };

    /* ==========================================
       Delete Inventory
    ========================================== */

    const handleDeleteClick = (item) => {

        setDeleteItem(item);

        setDeleteModal(true);

    };

    const handleDelete = async () => {

        try {

            setDeleteLoading(true);

            await inventoryService.deleteInventory(
                deleteItem.id
            );

            alert("Inventory deleted successfully.");

            setDeleteModal(false);

            setDeleteItem(null);

            await loadInventory();

        }

        catch (error) {

            console.error(error);

            alert("Failed to delete inventory.");

        }

        finally {

            setDeleteLoading(false);

        }

    };

    /* ==========================================
       Assign Inventory
    ========================================== */

    const handleAssignClick = (item) => {

        setSelectedInventory(item);

        setAssignModalOpen(true);

    };

    const handleAssign = async (formData) => {

        try {

            setAssignLoading(true);

            await inventoryService.assignInventory(formData);

            alert("Inventory assigned successfully.");

            setAssignModalOpen(false);

            setSelectedInventory(null);

            await loadInventory();

        }

        catch (error) {

            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Failed to assign inventory."
            );

        }

        finally {

            setAssignLoading(false);

        }

    };

    /* ==========================================
       Return Inventory
    ========================================== */

    const handleReturn = async (item) => {

        try {

            await inventoryService.returnInventory(item.id);

            alert("Inventory returned successfully.");

            await loadInventory();

        }

        catch (error) {

            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Failed to return inventory."
            );

        }

    };
        /* ==========================================
       Enterprise Search & Filters
    ========================================== */

    const filteredInventory = useMemo(() => {

        return inventory.filter((item) => {

            const search = searchTerm.toLowerCase();

            const matchesSearch =

                item.item_name?.toLowerCase().includes(search) ||

                item.serial_number?.toLowerCase().includes(search) ||

                item.manufacturer?.toLowerCase().includes(search);

            const matchesType =

                itemTypeFilter === "All"

                    ? true

                    : item.item_type === itemTypeFilter;

            let stockStatus = "Available";

            if (item.available_quantity === 0) {

                stockStatus = "Out of Stock";

            }

            else if (

                item.available_quantity <= item.minimum_stock

            ) {

                stockStatus = "Low Stock";

            }

            const matchesStatus =

                statusFilter === "All"

                    ? true

                    : stockStatus === statusFilter;

            const matchesCondition =

                conditionFilter === "All"

                    ? true

                    : item.condition === conditionFilter;

            return (

                matchesSearch &&

                matchesType &&

                matchesStatus &&

                matchesCondition

            );

        });

    }, [

        inventory,

        searchTerm,

        itemTypeFilter,

        statusFilter,

        conditionFilter,

    ]);

    /* ==========================================
       Summary Statistics
    ========================================== */

    const statistics = useMemo(() => ({

        totalItems: inventory.length,

        availableStock: inventory.reduce(

            (sum, item) =>

                sum + (item.available_quantity || 0),

            0

        ),

        assignedStock: inventory.reduce(

            (sum, item) =>

                sum + (item.assigned_quantity || 0),

            0

        ),

        lowStockItems: inventory.filter(

            (item) =>

                item.available_quantity <= item.minimum_stock

        ).length,

    }), [inventory]);

    /* ==========================================
       Reset Filters
    ========================================== */

    const resetFilters = () => {

        setSearchTerm("");

        setItemTypeFilter("All");

        setStatusFilter("All");

        setConditionFilter("All");

    };

    /* ==========================================
       Dynamic Dropdown Values
    ========================================== */

    const itemTypes = [

        "All",

        ...new Set(

            inventory.map(

                (item) => item.item_type

            )

        ),

    ];

    const conditions = [

        "All",

        ...new Set(

            inventory.map(

                (item) => item.condition

            )

        ),

    ];
        /* ==========================================
       JSX
    ========================================== */

    return (

        <section className="inventory-management">

            {/* ==========================================
                Header
            ========================================== */}

            <div className="inventory-header">

                <div>

                    <h1>Inventory Management</h1>

                    <p>

                        Manage all warehouse inventory.

                    </p>

                </div>

                <button

                    className="add-btn"

                    onClick={openAddModal}

                >

                    + Add Inventory

                </button>

            </div>

            {/* ==========================================
                Summary Cards
            ========================================== */}

            <div className="inventory-summary">

                <div className="summary-card">

                    <h3>Total Items</h3>

                    <h2>{statistics.totalItems}</h2>

                </div>

                <div className="summary-card">

                    <h3>Available Stock</h3>

                    <h2>{statistics.availableStock}</h2>

                </div>

                <div className="summary-card">

                    <h3>Assigned Stock</h3>

                    <h2>{statistics.assignedStock}</h2>

                </div>

                <div className="summary-card">

                    <h3>Low Stock Items</h3>

                    <h2>{statistics.lowStockItems}</h2>

                </div>

            </div>

            {/* ==========================================
                Search & Filters
            ========================================== */}

            <div className="inventory-toolbar">

                <input

                    type="text"

                    className="inventory-search-input"

                    placeholder="Search by Item Name, Serial Number or Manufacturer..."

                    value={searchTerm}

                    onChange={(e) =>

                        setSearchTerm(e.target.value)

                    }

                />

                <select

                    value={itemTypeFilter}

                    onChange={(e) =>

                        setItemTypeFilter(e.target.value)

                    }

                >

                    {

                        itemTypes.map((type) => (

                            <option

                                key={type}

                                value={type}

                            >

                                {type}

                            </option>

                        ))

                    }

                </select>

                <select

                    value={statusFilter}

                    onChange={(e) =>

                        setStatusFilter(e.target.value)

                    }

                >

                    <option value="All">

                        All Status

                    </option>

                    <option value="Available">

                        Available

                    </option>

                    <option value="Low Stock">

                        Low Stock

                    </option>

                    <option value="Out of Stock">

                        Out of Stock

                    </option>

                </select>

                <select

                    value={conditionFilter}

                    onChange={(e) =>

                        setConditionFilter(e.target.value)

                    }

                >

                    {

                        conditions.map((condition) => (

                            <option

                                key={condition}

                                value={condition}

                            >

                                {condition}

                            </option>

                        ))

                    }

                </select>

                <button

                    className="reset-filter-btn"

                    onClick={resetFilters}

                >

                    Reset Filters

                </button>

            </div>

            {/* ==========================================
                Results Count
            ========================================== */}

            {

                !loading && (

                    <div className="inventory-results">

                        Showing

                        <strong>

                            {" "}

                            {filteredInventory.length}

                            {" "}

                        </strong>

                        of

                        <strong>

                            {" "}

                            {inventory.length}

                            {" "}

                        </strong>

                        Inventory Items

                    </div>

                )

            }

            {/* ==========================================
                No Results
            ========================================== */}

            {

                !loading &&

                filteredInventory.length === 0 && (

                    <div className="inventory-empty">

                        <h3>

                            No Inventory Found

                        </h3>

                        <p>

                            No inventory matches the selected filters.

                        </p>

                    </div>

                )

            }

            {/* ==========================================
                Loading / Table
            ========================================== */}

            {

                loading ? (

                    <div className="inventory-loading">

                        <h3>

                            Loading Inventory...

                        </h3>

                    </div>

                ) : (

                    <InventoryTable

                        inventory={filteredInventory}

                        onEdit={handleEdit}

                        onAssign={handleAssignClick}

                        onReturn={handleReturn}

                        onDelete={handleDeleteClick}

                    />

                )

            }
                        {/* ==========================================
                Inventory Modal
            ========================================== */}

            <InventoryModal

                isOpen={isModalOpen}

                onClose={closeModal}

                onSave={handleSave}

                selectedItem={selectedItem}

            />

            {/* ==========================================
                Assign Inventory Modal
            ========================================== */}

            <AssignInventoryModal

                isOpen={assignModalOpen}

                inventory={selectedInventory}

                areas={areas}

                loading={assignLoading}

                onClose={() => {

                    setAssignModalOpen(false);

                    setSelectedInventory(null);

                }}

                onAssign={handleAssign}

            />

            {/* ==========================================
                Delete Inventory Modal
            ========================================== */}

            <DeleteInventoryModal

                isOpen={deleteModal}

                item={deleteItem}

                loading={deleteLoading}

                onClose={() => {

                    setDeleteModal(false);

                    setDeleteItem(null);

                }}

                onConfirm={handleDelete}

            />

        </section>

    );

}

export default InventoryManagement;