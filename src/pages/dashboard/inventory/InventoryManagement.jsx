/**
 * ============================================================================
 * File:
 * src/pages/dashboard/inventory/InventoryManagement.jsx
 *
 * Description:
 * Main Inventory Management page.
 *
 * Features:
 * - Inverter summary card
 * - Solar Panel summary card
 * - Battery summary card
 * - Low Stock summary card
 * - Clickable category cards
 * - Category detail modal
 * - Total / Available / Assigned inventory views
 * - Manufacturer-wise inventory grouping
 * - Assignment details with Area, Date and Assigned By
 * - Existing search and filters
 * - Existing inventory CRUD
 * - Existing inventory assignment and return functionality
 * - Success popup for Add, Edit and Delete actions
 * ============================================================================
 */

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import "./InventoryManagement.css";

import authService from "../../../services/authService";

import inventoryService from "../../../services/inventoryService";

import InventoryTable from "../../../components/dashboard/inventory/InventoryTable";

import InventoryModal from "../../../components/dashboard/inventory/InventoryModal";

import DeleteInventoryModal from "../../../components/dashboard/inventory/DeleteInventoryModal";

import AssignInventoryModal from "../../../components/dashboard/inventory/AssignInventoryModal";

import InventoryCategoryModal from "../../../components/dashboard/inventory/InventoryCategoryModal";


function InventoryManagement() {

    /* ========================================================================
       INVENTORY STATE
    ======================================================================== */

    const [inventory, setInventory] = useState([]);

    const [assignments, setAssignments] = useState([]);

    const [areas, setAreas] = useState([]);

    const [loading, setLoading] = useState(true);

    const [assignLoading, setAssignLoading] = useState(false);


    /* ========================================================================
       SEARCH & FILTERS
    ======================================================================== */

    const [searchTerm, setSearchTerm] = useState("");

    const [itemTypeFilter, setItemTypeFilter] =
        useState("All");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [conditionFilter, setConditionFilter] =
        useState("All");


    /* ========================================================================
       INVENTORY MODAL
    ======================================================================== */

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [selectedItem, setSelectedItem] =
        useState(null);


    /* ========================================================================
       DELETE MODAL
    ======================================================================== */

    const [deleteModal, setDeleteModal] =
        useState(false);

    const [deleteItem, setDeleteItem] =
        useState(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);


    /* ========================================================================
       ASSIGN MODAL
    ======================================================================== */

    const [assignModalOpen, setAssignModalOpen] =
        useState(false);

    const [selectedInventory, setSelectedInventory] =
        useState(null);


    /* ========================================================================
       CATEGORY DETAILS MODAL
    ======================================================================== */

    const [categoryModalOpen, setCategoryModalOpen] =
        useState(false);

    const [selectedCategory, setSelectedCategory] =
        useState(null);


    /* ========================================================================
       SUCCESS POPUP
    ======================================================================== */

    const [successPopup, setSuccessPopup] =
        useState({

            isOpen: false,

            title: "",

            message: "",

        });


    /* ========================================================================
       SHOW SUCCESS POPUP
    ======================================================================== */

    const showSuccessPopup = (
        title,
        message
    ) => {

        setSuccessPopup({

            isOpen: true,

            title,

            message,

        });

    };


    /* ========================================================================
       CLOSE SUCCESS POPUP
    ======================================================================== */

    const closeSuccessPopup = () => {

        setSuccessPopup({

            isOpen: false,

            title: "",

            message: "",

        });

    };


    /* ========================================================================
       INITIAL LOAD
    ======================================================================== */

    useEffect(() => {

        loadInventory();

        loadAssignments();

        loadAreas();

    }, []);


    /* ========================================================================
       LOAD INVENTORY
    ======================================================================== */

    const loadInventory = async () => {

        try {

            setLoading(true);

            const response =
                await inventoryService.getInventory();

            setInventory(
                Array.isArray(response?.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load inventory:",
                error
            );

            alert(
                "Failed to load inventory."
            );

        } finally {

            setLoading(false);

        }

    };


    /* ========================================================================
       LOAD ASSIGNMENTS
    ======================================================================== */

    const loadAssignments = async () => {

        try {

            const response =
                await inventoryService.getAssignments();

            setAssignments(
                Array.isArray(response)
                    ? response
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load inventory assignments:",
                error
            );

            setAssignments([]);

        }

    };


    /* ========================================================================
       LOAD AREAS
    ======================================================================== */

    const loadAreas = async () => {

        try {

            const response =
                await authService.getAreas();

            setAreas(
                response?.areas?.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load areas:",
                error
            );

            alert(
                "Failed to load areas."
            );

        }

    };


    /* ========================================================================
       INVENTORY MODAL FUNCTIONS
    ======================================================================== */

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


    /* ========================================================================
       SAVE INVENTORY
    ======================================================================== */

    const handleSave = async () => {

        const isEditMode =
            selectedItem !== null;

        await loadInventory();

        await loadAssignments();

        showSuccessPopup(

            isEditMode
                ? "Inventory Updated"
                : "Inventory Added",

            isEditMode
                ? "Inventory has been updated successfully."
                : "Inventory has been added successfully."

        );

    };


    /* ========================================================================
       DELETE INVENTORY
    ======================================================================== */

    const handleDeleteClick = (item) => {

        setDeleteItem(item);

        setDeleteModal(true);

    };


    const handleDelete = async () => {

        if (!deleteItem) {

            return;

        }


        try {

            setDeleteLoading(true);

            await inventoryService.deleteInventory(
                deleteItem.id
            );

            setDeleteModal(false);

            setDeleteItem(null);

            await loadInventory();

            await loadAssignments();

            showSuccessPopup(

                "Inventory Deleted",

                "Inventory has been deleted successfully."

            );

        } catch (error) {

            console.error(error);

            alert(
                "Failed to delete inventory."
            );

        } finally {

            setDeleteLoading(false);

        }

    };


    /* ========================================================================
       ASSIGN INVENTORY
    ======================================================================== */

    const handleAssignClick = (item) => {

        setSelectedInventory(item);

        setAssignModalOpen(true);

    };


    const handleAssign = async (formData) => {

        try {

            setAssignLoading(true);

            await inventoryService.assignInventory(
                formData
            );

            alert(
                "Inventory assigned successfully."
            );

            setAssignModalOpen(false);

            setSelectedInventory(null);

            await loadInventory();

            await loadAssignments();

        } catch (error) {

            console.error(error);

            alert(

                error?.response?.data?.message ||

                "Failed to assign inventory."

            );

        } finally {

            setAssignLoading(false);

        }

    };


    /* ========================================================================
       RETURN INVENTORY
    ======================================================================== */

    const handleReturn = async (item) => {

        try {

            await inventoryService.returnInventory(
                item.id
            );

            alert(
                "Inventory returned successfully."
            );

            await loadInventory();

            await loadAssignments();

        } catch (error) {

            console.error(error);

            alert(

                error?.response?.data?.message ||

                "Failed to return inventory."

            );

        }

    };


    /* ========================================================================
       CATEGORY CONFIGURATION
    ======================================================================== */

    const categoryConfig = {

        inverter: {

            key: "inverter",

            title: "Inverters",

            singular: "Inverter",

        },

        solar_panel: {

            key: "solar_panel",

            title: "Solar Panels",

            singular: "Solar Panel",

        },

        battery: {

            key: "battery",

            title: "Batteries",

            singular: "Battery",

        },

    };


    /* ========================================================================
       CATEGORY STATISTICS
    ======================================================================== */

    const categoryStatistics = useMemo(() => {

        const getStats = (type) => {

            const items = inventory.filter(

                (item) =>

                    item.item_type === type

            );


            return {

                total: items.reduce(

                    (sum, item) =>

                        sum +

                        Number(
                            item.quantity || 0
                        ),

                    0

                ),

                available: items.reduce(

                    (sum, item) =>

                        sum +

                        Number(
                            item.available_quantity || 0
                        ),

                    0

                ),

                assigned: items.reduce(

                    (sum, item) =>

                        sum +

                        Number(
                            item.assigned_quantity || 0
                        ),

                    0

                ),

                items,

            };

        };


        return {

            inverter:
                getStats("inverter"),

            solar_panel:
                getStats("solar_panel"),

            battery:
                getStats("battery"),

        };

    }, [inventory]);


    /* ========================================================================
       LOW STOCK STATISTICS
       IMPORTANT:
       User requested below 5, therefore < minimum_stock.
    ======================================================================== */

    const lowStockDetails = useMemo(() => {

        const lowStockItems =
            inventory.filter((item) => {

                const available =
                    Number(
                        item.available_quantity || 0
                    );

                const minimum =
                    Number(
                        item.minimum_stock ?? 5
                    );

                return available < minimum;

            });


        const byType = {

            inverter: lowStockItems.filter(

                (item) =>
                    item.item_type === "inverter"

            ).length,

            solar_panel: lowStockItems.filter(

                (item) =>
                    item.item_type === "solar_panel"

            ).length,

            battery: lowStockItems.filter(

                (item) =>
                    item.item_type === "battery"

            ).length,

        };


        return {

            count: lowStockItems.length,

            items: lowStockItems,

            byType,

        };

    }, [inventory]);


    /* ========================================================================
       OPEN CATEGORY MODAL
    ======================================================================== */

    const openCategoryModal = (type) => {

        const config =
            categoryConfig[type];

        if (!config) {

            return;

        }


        setSelectedCategory({

            ...config,

            statistics:
                categoryStatistics[type],

        });

        setCategoryModalOpen(true);

    };


    /* ========================================================================
       CLOSE CATEGORY MODAL
    ======================================================================== */

    const closeCategoryModal = () => {

        setCategoryModalOpen(false);

        setSelectedCategory(null);

    };


    /* ========================================================================
       SEARCH & FILTERS
    ======================================================================== */

    const filteredInventory = useMemo(() => {

        return inventory.filter((item) => {

            const search =
                searchTerm
                    .toLowerCase()
                    .trim();


            const matchesSearch =

                item.item_name
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.serial_number
                    ?.toLowerCase()
                    .includes(search)

                ||

                item.manufacturer
                    ?.toLowerCase()
                    .includes(search);


            const matchesType =

                itemTypeFilter === "All"

                    ? true

                    : item.item_type ===
                      itemTypeFilter;


            let stockStatus =
                "Available";


            if (
                Number(
                    item.available_quantity || 0
                ) === 0
            ) {

                stockStatus =
                    "Out of Stock";

            }

            else if (

                Number(
                    item.available_quantity || 0
                ) <

                Number(
                    item.minimum_stock ?? 5
                )

            ) {

                stockStatus =
                    "Low Stock";

            }


            const matchesStatus =

                statusFilter === "All"

                    ? true

                    : stockStatus ===
                      statusFilter;


            const matchesCondition =

                conditionFilter === "All"

                    ? true

                    : item.condition ===
                      conditionFilter;


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


    /* ========================================================================
       DYNAMIC FILTER OPTIONS
    ======================================================================== */

    const itemTypes = [

        "All",

        ...new Set(

            inventory.map(

                (item) =>
                    item.item_type

            )

        ),

    ];


    const conditions = [

        "All",

        ...new Set(

            inventory.map(

                (item) =>
                    item.condition

            )

        ),

    ];


    /* ========================================================================
       RESET FILTERS
    ======================================================================== */

    const resetFilters = () => {

        setSearchTerm("");

        setItemTypeFilter("All");

        setStatusFilter("All");

        setConditionFilter("All");

    };


    /* ========================================================================
       RENDER
    ======================================================================== */

    return (

        <section className="inventory-management">


            {/* =================================================================
                HEADER
            ================================================================= */}

            <div className="inventory-header">

                <div>

                    <h1>
                        Inventory Management
                    </h1>

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


            {/* =================================================================
                CATEGORY SUMMARY CARDS
            ================================================================= */}

            <div className="inventory-summary">


                {/* =============================================================
                    INVERTERS
                ============================================================= */}

                <button

                    type="button"

                    className="summary-card summary-card-clickable"

                    onClick={() =>
                        openCategoryModal(
                            "inverter"
                        )
                    }

                >

                    <h3>
                        Inverters
                    </h3>

                    <h2>
                        {
                            categoryStatistics
                                .inverter
                                .total
                        }
                    </h2>

                    <span className="summary-card-hint">

                        View inverter details

                    </span>

                </button>


                {/* =============================================================
                    SOLAR PANELS
                ============================================================= */}

                <button

                    type="button"

                    className="summary-card summary-card-clickable"

                    onClick={() =>
                        openCategoryModal(
                            "solar_panel"
                        )
                    }

                >

                    <h3>
                        Solar Panels
                    </h3>

                    <h2>
                        {
                            categoryStatistics
                                .solar_panel
                                .total
                        }
                    </h2>

                    <span className="summary-card-hint">

                        View solar panel details

                    </span>

                </button>


                {/* =============================================================
                    BATTERIES
                ============================================================= */}

                <button

                    type="button"

                    className="summary-card summary-card-clickable"

                    onClick={() =>
                        openCategoryModal(
                            "battery"
                        )
                    }

                >

                    <h3>
                        Batteries
                    </h3>

                    <h2>
                        {
                            categoryStatistics
                                .battery
                                .total
                        }
                    </h2>

                    <span className="summary-card-hint">

                        View battery details

                    </span>

                </button>


                {/* =============================================================
                    LOW STOCK
                ============================================================= */}

                <div className="summary-card low-stock-summary-card">

                    <h3>
                        Low Stock Items
                    </h3>

                    <h2>
                        {
                            lowStockDetails.count
                        }
                    </h2>


                    <div className="low-stock-breakdown">

                        <span>

                            Inverters:

                            <strong>

                                {" "}

                                {
                                    lowStockDetails
                                        .byType
                                        .inverter
                                }

                            </strong>

                        </span>


                        <span>

                            Solar Panels:

                            <strong>

                                {" "}

                                {
                                    lowStockDetails
                                        .byType
                                        .solar_panel
                                }

                            </strong>

                        </span>


                        <span>

                            Batteries:

                            <strong>

                                {" "}

                                {
                                    lowStockDetails
                                        .byType
                                        .battery
                                }

                            </strong>

                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================================
                SEARCH & FILTERS
            ================================================================= */}

            <div className="inventory-toolbar">

                <input

                    type="text"

                    className="inventory-search-input"

                    placeholder="Search by Item Name, Serial Number or Manufacturer..."

                    value={searchTerm}

                    onChange={(e) =>
                        setSearchTerm(
                            e.target.value
                        )
                    }

                />


                <select

                    value={itemTypeFilter}

                    onChange={(e) =>
                        setItemTypeFilter(
                            e.target.value
                        )
                    }

                >

                    {

                        itemTypes.map(

                            (type) => (

                                <option

                                    key={type}

                                    value={type}

                                >

                                    {type}

                                </option>

                            )

                        )

                    }

                </select>


                <select

                    value={statusFilter}

                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
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
                        setConditionFilter(
                            e.target.value
                        )
                    }

                >

                    {

                        conditions.map(

                            (condition) => (

                                <option

                                    key={condition}

                                    value={condition}

                                >

                                    {condition}

                                </option>

                            )

                        )

                    }

                </select>


                <button

                    className="reset-filter-btn"

                    onClick={resetFilters}

                >

                    Reset Filters

                </button>

            </div>


            {/* =================================================================
                RESULTS COUNT
            ================================================================= */}

            {

                !loading && (

                    <div className="inventory-results">

                        Showing

                        <strong>
                            {" "}
                            {
                                filteredInventory.length
                            }{" "}
                        </strong>

                        of

                        <strong>
                            {" "}
                            {
                                inventory.length
                            }{" "}
                        </strong>

                        Inventory Items

                    </div>

                )

            }


            {/* =================================================================
                NO RESULTS
            ================================================================= */}

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


            {/* =================================================================
                INVENTORY TABLE
            ================================================================= */}

            {

                loading ? (

                    <div className="inventory-loading">

                        <h3>
                            Loading Inventory...
                        </h3>

                    </div>

                ) : (

                    <InventoryTable

                        inventory={
                            filteredInventory
                        }

                        onEdit={handleEdit}

                        onAssign={
                            handleAssignClick
                        }

                        onReturn={
                            handleReturn
                        }

                        onDelete={
                            handleDeleteClick
                        }

                    />

                )

            }


            {/* =================================================================
                ADD / EDIT INVENTORY MODAL
            ================================================================= */}

            <InventoryModal

                isOpen={isModalOpen}

                onClose={closeModal}

                onSave={handleSave}

                selectedItem={selectedItem}

            />


            {/* =================================================================
                ASSIGN INVENTORY MODAL
            ================================================================= */}

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


            {/* =================================================================
                DELETE INVENTORY MODAL
            ================================================================= */}

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


            {/* =================================================================
                CATEGORY DETAILS MODAL
            ================================================================= */}

            <InventoryCategoryModal

                isOpen={categoryModalOpen}

                category={selectedCategory}

                inventory={inventory}

                assignments={assignments}

                onClose={closeCategoryModal}

            />


           

        </section>

    );

}


export default InventoryManagement;