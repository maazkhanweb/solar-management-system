/**
 * ============================================================================
 * File:
 * src/components/common/ActionButtons/ActionButtons.jsx
 *
 * Description:
 * Reusable action buttons for Edit, Delete and Analysis actions.
 *
 * Delete button can be disabled for protected users such as Super Admin.
 * ============================================================================
 */

import {
    FaEdit,
    FaTrash,
    FaChartBar
} from "react-icons/fa";

import "./ActionButtons.css";


function ActionButtons({
    onEdit,
    onDelete,
    onAnalysis,
    deleteDisabled = false,
}) {

    return (

        <div className="action-buttons">

            {/* =========================================================
                EDIT BUTTON
            ========================================================= */}

            <button
                type="button"
                className="action-btn edit"
                onClick={onEdit}
                title="Edit"
            >

                <FaEdit />

            </button>


            {/* =========================================================
                DELETE BUTTON
            ========================================================= */}

            <button
                type="button"
                className={`action-btn delete ${
                    deleteDisabled ? "disabled" : ""
                }`}
                onClick={deleteDisabled ? undefined : onDelete}
                disabled={deleteDisabled}
                title={
                    deleteDisabled
                        ? "Super Admin cannot be deleted"
                        : "Delete"
                }
                aria-label={
                    deleteDisabled
                        ? "Super Admin cannot be deleted"
                        : "Delete"
                }
            >

                <FaTrash />

            </button>


            {/* =========================================================
                ANALYSIS BUTTON
            ========================================================= */}

            {

                onAnalysis && (

                    <button
                        type="button"
                        className="action-btn analysis"
                        onClick={onAnalysis}
                        title="Analysis"
                    >

                        <FaChartBar />

                    </button>

                )

            }

        </div>

    );

}


export default ActionButtons;