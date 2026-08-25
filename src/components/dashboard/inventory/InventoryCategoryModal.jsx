/**
 * ============================================================================
 * File:
 * src/components/dashboard/inventory/InventoryCategoryModal.jsx
 *
 * Description:
 * Category-wise inventory details modal.
 *
 * Features:
 * - Total inventory view
 * - Available inventory view
 * - Assigned inventory view
 * - Damaged inventory information
 * - Damage reason display
 * - Clickable inner cards
 * - Manufacturer-wise grouping
 * - Assignment details
 * - Area, assigned date and area manager information
 * ============================================================================
 */

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FaBoxOpen,
    FaCheckCircle,
    FaTimes,
    FaUser,
} from "react-icons/fa";

import "../../../pages/dashboard/inventory/InventoryManagement.css";


function InventoryCategoryModal({

    isOpen,

    category,

    inventory = [],

    assignments = [],

    onClose,

}) {

    /* ========================================================================
       ACTIVE VIEW
    ======================================================================== */

    const [activeView, setActiveView] =
        useState("total");


    /* ========================================================================
       RESET VIEW WHEN CATEGORY CHANGES
    ======================================================================== */

    useEffect(() => {

        if (isOpen) {

            setActiveView("total");

        }

    }, [isOpen, category]);


    /* ========================================================================
       CATEGORY INVENTORY
    ======================================================================== */

    const categoryInventory = useMemo(() => {

        if (!category?.key) {

            return [];

        }


        return inventory.filter(

            (item) =>

                item.item_type ===
                category.key

        );

    }, [

        inventory,

        category,

    ]);


    /* ========================================================================
       CATEGORY COUNTS
    ======================================================================== */

    const totalQuantity = useMemo(

        () =>

            categoryInventory.reduce(

                (sum, item) =>

                    sum +

                    Number(
                        item.quantity || 0
                    ),

                0

            ),

        [categoryInventory]

    );


    const availableQuantity = useMemo(

        () =>

            categoryInventory.reduce(

                (sum, item) =>

                    sum +

                    Number(
                        item.available_quantity || 0
                    ),

                0

            ),

        [categoryInventory]

    );


    const assignedQuantity = useMemo(

        () =>

            categoryInventory.reduce(

                (sum, item) =>

                    sum +

                    Number(
                        item.assigned_quantity || 0
                    ),

                0

            ),

        [categoryInventory]

    );


    /* ========================================================================
       DAMAGED QUANTITY
    ======================================================================== */

    const damagedQuantity = useMemo(

        () =>

            categoryInventory.reduce(

                (sum, item) =>

                    sum +

                    Number(
                        item.damaged_quantity || 0
                    ),

                0

            ),

        [categoryInventory]

    );


    /* ========================================================================
       AVAILABLE ITEMS
    ======================================================================== */

    const availableItems = useMemo(

        () =>

            categoryInventory.filter(

                (item) =>

                    Number(
                        item.available_quantity || 0
                    ) > 0

            ),

        [categoryInventory]

    );


    /* ========================================================================
       CATEGORY ITEM IDS
    ======================================================================== */

    const categoryItemIds = useMemo(

        () =>

            new Set(

                categoryInventory.map(

                    (item) =>
                        Number(item.id)

                )

            ),

        [categoryInventory]

    );


    /* ========================================================================
       ASSIGNED ITEMS
    ======================================================================== */

    const categoryAssignments = useMemo(

        () =>

            assignments.filter(

                (assignment) =>

                    categoryItemIds.has(

                        Number(

                            assignment.inventory_item_id

                            ??

                            assignment.inventoryItem?.id

                            ??

                            assignment.inventory_item?.id

                        )

                    )

                    &&

                    assignment.status ===
                    "Assigned"

            ),

        [

            assignments,

            categoryItemIds,

        ]

    );


    /* ========================================================================
       GROUP BY MANUFACTURER
    ======================================================================== */

    const groupByManufacturer = (

        items

    ) => {

        const groups = {};


        items.forEach((item) => {

            const manufacturer =

                item.manufacturer?.trim()

                ||

                "Unknown Manufacturer";


            if (!groups[manufacturer]) {

                groups[manufacturer] = [];

            }


            groups[manufacturer].push(item);

        });


        return Object.entries(groups)

            .sort(

                ([a], [b]) =>
                    a.localeCompare(b)

            );

    };


    /* ========================================================================
       GROUP ASSIGNMENTS BY MANUFACTURER
    ======================================================================== */

    const groupAssignmentsByManufacturer = (

        items

    ) => {

        const groups = {};


        items.forEach((assignment) => {

            /*
             * Support both possible API relation names.
             */

            const inventoryItem =

                assignment.inventoryItem

                ||

                assignment.inventory_item

                ||

                {};


            const manufacturer =

                inventoryItem.manufacturer?.trim()

                ||

                "Unknown Manufacturer";


            if (!groups[manufacturer]) {

                groups[manufacturer] = [];

            }


            groups[manufacturer].push(
                assignment
            );

        });


        return Object.entries(groups)

            .sort(

                ([a], [b]) =>
                    a.localeCompare(b)

            );

    };


    /* ========================================================================
       DATE FORMATTER
    ======================================================================== */

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        const parsedDate =
            new Date(date);


        if (

            Number.isNaN(

                parsedDate.getTime()

            )

        ) {

            return date;

        }


        return parsedDate.toLocaleDateString(

            "en-GB",

            {

                day: "2-digit",

                month: "short",

                year: "numeric",

            }

        );

    };


    /* ========================================================================
       RENDER TOTAL / AVAILABLE TABLE
    ======================================================================== */

    const renderInventoryTables = (

        items

    ) => {

        const groups =
            groupByManufacturer(items);


        if (groups.length === 0) {

            return (

                <div className="category-empty">

                    <FaBoxOpen />

                    <h3>
                        No Inventory Found
                    </h3>

                    <p>

                        There are no{" "}

                        {

                            category?.singular?.toLowerCase()

                            ||

                            "inventory"

                        }{" "}

                        records in this view.

                    </p>

                </div>

            );

        }


        return (

            <div className="manufacturer-groups">

                {

                    groups.map(

                        ([

                            manufacturer,

                            manufacturerItems

                        ]) => (

                            <section

                                className="manufacturer-group"

                                key={manufacturer}

                            >

                                <div className="manufacturer-group-header">

                                    <div>

                                        <h3>

                                            {manufacturer}

                                        </h3>

                                        <span>

                                            {

                                                manufacturerItems.length

                                            }

                                            {" "}

                                            record

                                            {

                                                manufacturerItems.length !== 1

                                                    ? "s"

                                                    : ""

                                            }

                                        </span>

                                    </div>

                                </div>


                                <div className="category-table-wrapper">

                                    <table className="category-details-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Item
                                                </th>

                                                <th>
                                                    Serial Number
                                                </th>

                                                <th>
                                                    Capacity
                                                </th>

                                                <th>
                                                    Total
                                                </th>

                                                <th>
                                                    Available
                                                </th>

                                                <th>
                                                    Assigned
                                                </th>

                                                <th>
                                                    Damaged
                                                </th>

                                                <th>
                                                    Damage Reason
                                                </th>

                                                <th>
                                                    Condition
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {

                                                manufacturerItems.map(

                                                    (item) => (

                                                        <tr

                                                            key={
                                                                item.id
                                                            }

                                                        >

                                                            {/* ITEM */}

                                                            <td>

                                                                <strong>

                                                                    {
                                                                        item.item_name
                                                                    }

                                                                </strong>

                                                            </td>


                                                            {/* SERIAL NUMBER */}

                                                            <td>

                                                                <span className="category-serial">

                                                                    {

                                                                        item.serial_number

                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* CAPACITY */}

                                                            <td>

                                                                {

                                                                    item.capacity

                                                                }

                                                                {" W"}

                                                            </td>


                                                            {/* TOTAL */}

                                                            <td>

                                                                <strong>

                                                                    {

                                                                        item.quantity

                                                                    }

                                                                </strong>

                                                            </td>


                                                            {/* AVAILABLE */}

                                                            <td>

                                                                <span className="quantity-badge available">

                                                                    {

                                                                        item.available_quantity

                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* ASSIGNED */}

                                                            <td>

                                                                <span className="quantity-badge assigned">

                                                                    {

                                                                        item.assigned_quantity

                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* DAMAGED */}

                                                            <td>

                                                                <span

                                                                    className={

                                                                        `quantity-badge ${
                                                                            Number(
                                                                                item.damaged_quantity || 0
                                                                            ) > 0

                                                                                ? "damaged"

                                                                                : "available"
                                                                        }`

                                                                    }

                                                                >

                                                                    {

                                                                        Number(

                                                                            item.damaged_quantity || 0

                                                                        )

                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* DAMAGE REASON */}

                                                            <td>

                                                                {

                                                                    Number(

                                                                        item.damaged_quantity || 0

                                                                    ) > 0

                                                                        ? (

                                                                            item.damage_reason

                                                                            ||

                                                                            "Reason not provided"

                                                                        )

                                                                        : "-"

                                                                }

                                                            </td>


                                                            {/* CONDITION */}

                                                            <td>

                                                                {

                                                                    item.condition

                                                                    ||

                                                                    "-"

                                                                }

                                                            </td>


                                                            {/* STATUS */}

                                                            <td>

                                                                <span

                                                                    className={

                                                                        `category-status ${
                                                                            item.status
                                                                                ?.toLowerCase()
                                                                                ===
                                                                                "installed"

                                                                                ? "installed"

                                                                                : "available"
                                                                        }`

                                                                    }

                                                                >

                                                                    {

                                                                        item.status

                                                                        ||

                                                                        "Available"

                                                                    }

                                                                </span>

                                                            </td>

                                                        </tr>

                                                    )

                                                )

                                            }

                                        </tbody>

                                    </table>

                                </div>

                            </section>

                        )

                    )

                }

            </div>

        );

    };


    /* ========================================================================
       RENDER ASSIGNED TABLES
    ======================================================================== */

    const renderAssignedTables = () => {

        const groups =

            groupAssignmentsByManufacturer(

                categoryAssignments

            );


        if (groups.length === 0) {

            return (

                <div className="category-empty">

                    <FaCheckCircle />

                    <h3>
                        No Assigned Inventory
                    </h3>

                    <p>

                        There are currently no assigned{" "}

                        {

                            category?.singular?.toLowerCase()

                            ||

                            "inventory"

                        }{" "}

                        items.

                    </p>

                </div>

            );

        }


        return (

            <div className="manufacturer-groups">

                {

                    groups.map(

                        ([

                            manufacturer,

                            manufacturerAssignments

                        ]) => (

                            <section

                                className="manufacturer-group"

                                key={manufacturer}

                            >

                                <div className="manufacturer-group-header">

                                    <div>

                                        <h3>

                                            {manufacturer}

                                        </h3>

                                        <span>

                                            Assigned Inventory

                                        </span>

                                    </div>

                                </div>


                                <div className="category-table-wrapper">

                                    <table className="category-details-table assigned-details-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Item
                                                </th>

                                                <th>
                                                    Serial Number
                                                </th>

                                                <th>
                                                    Quantity
                                                </th>

                                                <th>
                                                    Area
                                                </th>

                                                <th>
                                                    Assigned Date
                                                </th>

                                                <th>
                                                    Assigned By
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {

                                                manufacturerAssignments.map(

                                                    (assignment) => {

                                                        /*
                                                         * Get inventory item.
                                                         *
                                                         * Supports:
                                                         * - inventoryItem
                                                         * - inventory_item
                                                         */

                                                        const relationItem =

                                                            assignment.inventoryItem

                                                            ||

                                                            assignment.inventory_item

                                                            ||

                                                            null;


                                                        const assignmentItemId =

                                                            Number(

                                                                assignment.inventory_item_id

                                                                ??

                                                                relationItem?.id

                                                            );


                                                        const item =

                                                            relationItem

                                                            ||

                                                            categoryInventory.find(

                                                                (inventoryItem) =>

                                                                    Number(

                                                                        inventoryItem.id

                                                                    )

                                                                    ===

                                                                    assignmentItemId

                                                            )

                                                            ||

                                                            {};


                                                        /*
                                                         * Area relation.
                                                         */

                                                        const area =

                                                            assignment.area

                                                            ||

                                                            assignment.areaData

                                                            ||

                                                            {};


                                                        /*
                                                         * Assigned By = Area Manager
                                                         */

                                                        const areaManager =

                                                            area.manager

                                                            ||

                                                            area.manager_name

                                                            ||

                                                            area.managerName

                                                            ||

                                                            "-";


                                                        return (

                                                            <tr

                                                                key={

                                                                    assignment.id

                                                                }

                                                            >

                                                                {/* ITEM */}

                                                                <td>

                                                                    <strong>

                                                                        {

                                                                            item.item_name

                                                                            ||

                                                                            item.name

                                                                            ||

                                                                            "-"

                                                                        }

                                                                    </strong>

                                                                </td>


                                                                {/* SERIAL NUMBER */}

                                                                <td>

                                                                    <span className="category-serial">

                                                                        {

                                                                            item.serial_number

                                                                            ||

                                                                            item.serialNumber

                                                                            ||

                                                                            "-"

                                                                        }

                                                                    </span>

                                                                </td>


                                                                {/* QUANTITY */}

                                                                <td>

                                                                    <span className="quantity-badge assigned">

                                                                        {

                                                                            assignment.quantity

                                                                            ||

                                                                            0

                                                                        }

                                                                    </span>

                                                                </td>


                                                                {/* AREA */}

                                                                <td>

                                                                    <div className="assignment-area">

                                                                        <strong>

                                                                            {

                                                                                area.area_name

                                                                                ||

                                                                                area.name

                                                                                ||

                                                                                "Unknown Area"

                                                                            }

                                                                        </strong>

                                                                    </div>

                                                                </td>


                                                                {/* ASSIGNED DATE */}

                                                                <td>

                                                                    {

                                                                        formatDate(

                                                                            assignment.assigned_at

                                                                        )

                                                                    }

                                                                </td>


                                                                {/* ASSIGNED BY */}

                                                                <td>

                                                                    <div className="assigned-by">

                                                                        <FaUser />

                                                                        <span>

                                                                            {

                                                                                areaManager

                                                                            }

                                                                        </span>

                                                                    </div>

                                                                </td>


                                                                {/* STATUS */}

                                                                <td>

                                                                    <span className="category-status installed">

                                                                        {

                                                                            assignment.status

                                                                            ||

                                                                            "Assigned"

                                                                        }

                                                                    </span>

                                                                </td>

                                                            </tr>

                                                        );

                                                    }

                                                )

                                            }

                                        </tbody>

                                    </table>

                                </div>

                            </section>

                        )

                    )

                }

            </div>

        );

    };


    /* ========================================================================
       MODAL CLOSED
    ======================================================================== */

    if (!isOpen || !category) {

        return null;

    }


    /* ========================================================================
       MAIN MODAL
    ======================================================================== */

    return (

        <div

            className="inventory-category-overlay"

            onMouseDown={(e) => {

                if (

                    e.target === e.currentTarget

                ) {

                    onClose();

                }

            }}

        >

            <div className="inventory-category-modal">


                {/* =============================================================
                    HEADER
                ============================================================= */}

                <div className="inventory-category-header">

                    <div>

                        <h2>

                            {category.title} Details

                        </h2>

                        <p>

                            Manage and review{" "}

                            {category.title.toLowerCase()}

                            {" "}stock.

                        </p>

                    </div>


                    <button

                        type="button"

                        className="inventory-category-close"

                        onClick={onClose}

                        title="Close"

                    >

                        <FaTimes />

                    </button>

                </div>


                {/* =============================================================
                    INNER SUMMARY CARDS
                ============================================================= */}

                <div className="category-summary-cards">


                    {/* =========================================================
                        TOTAL
                    ========================================================= */}

                    <button

                        type="button"

                        className={

                            `category-summary-card ${
                                activeView === "total"
                                    ? "active"
                                    : ""
                            }`

                        }

                        onClick={() =>
                            setActiveView("total")
                        }

                    >

                        <span className="category-card-label">

                            Total {category.singular}s

                        </span>

                        <strong>

                            {totalQuantity}

                        </strong>

                        <small>

                            View all

                        </small>

                    </button>


                    {/* =========================================================
                        AVAILABLE
                    ========================================================= */}

                    <button

                        type="button"

                        className={

                            `category-summary-card ${
                                activeView === "available"
                                    ? "active"
                                    : ""
                            }`

                        }

                        onClick={() =>
                            setActiveView("available")
                        }

                    >

                        <span className="category-card-label">

                            Available {category.singular}s

                        </span>

                        <strong>

                            {availableQuantity}

                        </strong>

                        <small>

                            View available

                        </small>

                    </button>


                    {/* =========================================================
                        ASSIGNED
                    ========================================================= */}

                    <button

                        type="button"

                        className={

                            `category-summary-card ${
                                activeView === "assigned"
                                    ? "active"
                                    : ""
                            }`

                        }

                        onClick={() =>
                            setActiveView("assigned")
                        }

                    >

                        <span className="category-card-label">

                            Assigned {category.singular}s

                        </span>

                        <strong>

                            {assignedQuantity}

                        </strong>

                        <small>

                            View assignments

                        </small>

                    </button>


                    {/* =========================================================
                        DAMAGED
                    ========================================================= */}

                    <div className="category-summary-card">

                        <span className="category-card-label">

                            Damaged {category.singular}s

                        </span>

                        <strong>

                            {damagedQuantity}

                        </strong>

                        <small>

                            Damaged stock

                        </small>

                    </div>

                </div>


                {/* =============================================================
                    TABLE AREA
                ============================================================= */}

                <div className="inventory-category-body">

                    {

                        activeView === "total"

                            ?

                            renderInventoryTables(

                                categoryInventory

                            )

                            :

                        activeView === "available"

                            ?

                            renderInventoryTables(

                                availableItems

                            )

                            :

                            renderAssignedTables()

                    }

                </div>


                {/* =============================================================
                    FOOTER
                ============================================================= */}

                <div className="inventory-category-footer">

                    <span>

                        {

                            activeView === "total"

                                ? `Total ${category.title}`

                                : activeView === "available"

                                ? `Available ${category.title}`

                                : `Assigned ${category.title}`

                        }

                    </span>


                    <button

                        type="button"

                        onClick={onClose}

                        className="inventory-category-close-btn"

                    >

                        Close

                    </button>

                </div>

            </div>

        </div>

    );

}


export default InventoryCategoryModal;