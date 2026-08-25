import React from "react";
import "./AreaAssetsModal.css";

const AreaAssetsModal = ({
    isOpen,
    onClose,
    area,
    assets,
    loading,
}) => {

    if (!isOpen) return null;

    return (

        <div className="modal-overlay">

            <div className="area-assets-modal">

                <div className="modal-header">

                    <h2>

                        Installed Area Assets

                    </h2>

                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                {

                    loading ? (

                        <div className="loading-state">

                            Loading assets...

                        </div>

                    ) : (

                        <>

                            <div className="area-info">

                                <div className="info-card">

                                    <label>

                                        Area Name

                                    </label>

                                    <span>

                                        {area?.area_name || "-"}

                                    </span>

                                </div>

                                <div className="info-card">

                                    <label>

                                        Location

                                    </label>

                                    <span>

                                        {area?.location || "-"}

                                    </span>

                                </div>

                                <div className="info-card">

                                    <label>

                                        Manager

                                    </label>

                                    <span>

                                        {area?.manager || "-"}

                                    </span>

                                </div>

                                <div className="info-card">

                                    <label>

                                        Phone

                                    </label>

                                    <span>

                                        {area?.phone || "-"}

                                    </span>

                                </div>

                                <div className="info-card">

                                    <label>

                                        Status

                                    </label>

                                    <span>

                                        {area?.status || "-"}

                                    </span>

                                </div>

                            </div>

                            <div className="assets-table-wrapper">

                                <table className="assets-table">

                                    <thead>

                                        <tr>

                                            <th>#</th>

                                            <th>Item Name</th>

                                            <th>Type</th>

                                            <th>Manufacturer</th>

                                            <th>Capacity</th>

                                            <th>Serial Number</th>

                                            <th>Quantity</th>

                                            <th>Assigned Date</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {
                                            assets?.length > 0 ? (

                                                assets.map((item, index) => (
                                                                                                        <tr key={item.assignment_id}>

                                                        <td>

                                                            {index + 1}

                                                        </td>

                                                        <td>

                                                            {item.item_name}

                                                        </td>

                                                        <td>

                                                            {item.item_type}

                                                        </td>

                                                        <td>

                                                            {item.manufacturer}

                                                        </td>

                                                        <td>

                                                            {item.capacity || "-"}

                                                        </td>

                                                        <td>

                                                            {item.serial_number || "-"}

                                                        </td>

                                                        <td>

                                                            {item.quantity}

                                                        </td>

                                                        <td>

                                                            {

                                                                item.assigned_at
                                                                    ? new Date(
                                                                          item.assigned_at
                                                                      ).toLocaleDateString()
                                                                    : "-"

                                                            }

                                                        </td>

                                                    </tr>

                                                ))

                                            ) : (

                                                <tr>

                                                    <td
                                                        colSpan="8"
                                                        className="no-data"
                                                    >

                                                        No installed inventory found for this area.

                                                    </td>

                                                </tr>

                                            )

                                        }

                                    </tbody>

                                </table>

                            </div>

                            <div className="assets-summary">

                                <div className="summary-card">

                                    <h3>

                                        {assets?.length || 0}

                                    </h3>

                                    <p>

                                        Installed Items

                                    </p>

                                </div>

                                <div className="summary-card">

                                    <h3>

                                        {assets?.reduce(

                                            (total, item) =>
                                                total + Number(item.quantity || 0),

                                            0

                                        )}

                                    </h3>

                                    <p>

                                        Total Quantity

                                    </p>

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                >

                                    Close

                                </button>

                            </div>

                        </>

                    )

                }

            </div>

        </div>

    );

};

export default AreaAssetsModal;