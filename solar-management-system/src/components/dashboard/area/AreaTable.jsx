import "./AreaTable.css";

import {
    FaEdit,
    FaTrash,
    FaWarehouse,
    FaEye,
} from "react-icons/fa";

const AreaTable = ({

    areas,

    onEdit,

    onDelete,

    onMove,

    onViewAssets,

}) => {

    return (

        <div className="area-table-container">

            <table className="area-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Area Name</th>

                        <th>Location</th>

                        <th>Manager</th>

                        <th>Phone</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        areas.length > 0 ? (

                            areas.map((area) => (

                                <tr key={area.id}>

                                    <td>

                                        {area.id}

                                    </td>

                                    <td>

                                        {area.area_name}

                                    </td>

                                    <td>

                                        {area.location}

                                    </td>

                                    <td>

                                        {area.manager}

                                    </td>

                                    <td>

                                        {area.phone}

                                    </td>

                                    <td>

                                        {area.status}

                                    </td>

                                    <td>

                                        <div className="area-actions">

                                            <button

                                                className="action-btn edit"

                                                onClick={() =>
                                                    onEdit(area)
                                                }

                                                title="Edit Area"

                                            >

                                                <FaEdit />

                                            </button>

                                            <button

                                                className="action-btn move"

                                                onClick={() =>
                                                    onMove(area)
                                                }

                                                title="Move Inventory To Warehouse"

                                            >

                                                <FaWarehouse />

                                            </button>

                                            <button

                                                className="action-btn view"

                                                onClick={() =>
                                                    onViewAssets(area)
                                                }

                                                title="View Installed Assets"

                                            >

                                                <FaEye />

                                            </button>
                                                                                        <button

                                                className="action-btn delete"

                                                onClick={() =>
                                                    onDelete(area)
                                                }

                                                title="Delete Area"

                                            >

                                                <FaTrash />

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td

                                    colSpan="7"

                                    style={{

                                        textAlign: "center",

                                        padding: "20px",

                                    }}

                                >

                                    No Areas Found.

                                </td>

                            </tr>

                        )

                    }

                </tbody>

            </table>

        </div>

    );

};

export default AreaTable;