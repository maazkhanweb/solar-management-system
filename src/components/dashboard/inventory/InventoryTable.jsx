import {
    RiEdit2Line,
    RiDeleteBin6Line,
    RiArrowRightCircleLine,
    RiArrowGoBackLine,
    RiUser3Line,
} from "react-icons/ri";

import "./InventoryTable.css";

function InventoryTable({

    inventory,

    onEdit,

    onAssign,

    onReturn,

    onDelete,

}) {

    /* ==========================================
       Stock Status
    ========================================== */

    const getStockStatus = (item) => {

        if (item.available_quantity === 0) {

            return {

                text: "Out of Stock",

                className: "status out",

            };

        }

        if (

            item.available_quantity <=
            item.minimum_stock

        ) {

            return {

                text: "Low Stock",

                className: "status low",

            };

        }

        return {

            text: "Available",

            className: "status available",

        };

    };

    return (

        <div className="inventory-table-container">

            <table className="inventory-table">

                <thead>

                    <tr>

                        <th>Item</th>

                        <th>Type</th>

                        <th>Manufacturer</th>

                        <th>Capacity</th>

                        <th>Serial Number</th>

                        <th>Stock Details</th>

                        <th>Location</th>

                        <th>Status</th>

                        <th className="action-column">

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        inventory.length === 0 ? (

                            <tr>

                                <td

                                    colSpan="9"

                                    className="no-data"

                                >

                                    No Inventory Found

                                </td>

                            </tr>

                        ) : (

                            inventory.map((item) => {

                                const status =
                                    getStockStatus(item);

                                return (

                                    <tr key={item.id}>

                                        <td>

                                            <div className="item-info">

                                                <strong>

                                                    {item.item_name}

                                                </strong>

                                            </div>

                                        </td>

                                        <td>

                                            <span className="item-type">

                                                {item.item_type}

                                            </span>

                                        </td>

                                        <td>

                                            {item.manufacturer}

                                        </td>

                                        <td>

                                            {item.capacity}

                                            <small className="capacity-unit">

                                                {" "}W

                                            </small>

                                        </td>

                                        <td>

                                            <span className="serial-number">

                                                {item.serial_number}

                                            </span>

                                        </td>

                                        <td>

                                            <div className="stock-card">

                                                <div className="stock-row">

                                                    <span>Total</span>

                                                    <strong>

                                                        {item.quantity}

                                                    </strong>

                                                </div>

                                                <div className="stock-row available">

                                                    <span>Available</span>

                                                    <strong>

                                                        {item.available_quantity}

                                                    </strong>

                                                </div>

                                                <div className="stock-row assigned">

                                                    <span>Assigned</span>

                                                    <strong>

                                                        {item.assigned_quantity}

                                                    </strong>

                                                </div>

                                                <div className="stock-row damaged">

                                                    <span>Damaged</span>

                                                    <strong>

                                                        {item.damaged_quantity}

                                                    </strong>

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                            <div className="inventory-location">

                                                <span className="location-badge">

                                                    {

                                                        item.area?.area_name

                                                            ?

                                                            item.area.area_name

                                                            :

                                                            "Warehouse"

                                                    }

                                                </span>

                                                <div className="location-manager">

                                                    <RiUser3Line />

                                                    <span>

                                                        {

                                                            item.area?.manager

                                                                ?

                                                                item.area.manager

                                                                :

                                                                "Not Assigned"

                                                        }

                                                    </span>

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                            <span className={status.className}>

                                                {status.text}

                                            </span>

                                        </td>
                                                                                <td>

                                            <div className="action-buttons">

                                                <button

                                                    className="action-btn edit-btn"

                                                    onClick={() => onEdit(item)}

                                                    title="Edit Inventory"

                                                >

                                                    <RiEdit2Line size={18} />

                                                </button>

                                                <button

                                                    className="action-btn assign-btn"

                                                    disabled={
                                                        item.available_quantity <= 0
                                                    }

                                                    onClick={() => onAssign(item)}

                                                    title="Assign Inventory"

                                                >

                                                    <RiArrowRightCircleLine size={20} />

                                                </button>

                                                <button

                                                    className="action-btn return-btn"

                                                    disabled={
                                                        item.assigned_quantity <= 0
                                                    }

                                                    onClick={() => onReturn(item)}

                                                    title="Return Inventory"

                                                >

                                                    <RiArrowGoBackLine size={20} />

                                                </button>

                                                <button

                                                    className="action-btn delete-btn"

                                                    onClick={() => onDelete(item)}

                                                    title="Delete Inventory"

                                                >

                                                    <RiDeleteBin6Line size={18} />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                );

                            })

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}

export default InventoryTable;