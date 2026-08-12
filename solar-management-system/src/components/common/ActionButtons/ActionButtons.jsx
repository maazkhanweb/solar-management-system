import { FaEdit, FaTrash, FaChartBar } from "react-icons/fa";
import "./ActionButtons.css";

function ActionButtons({
    onEdit,
    onDelete,
    onAnalysis,
}) {

    return (

        <div className="action-buttons">

            <button
                className="action-btn edit"
                onClick={onEdit}
                title="Edit"
            >
                <FaEdit />
            </button>

            <button
                className="action-btn delete"
                onClick={onDelete}
                title="Delete"
            >
                <FaTrash />
            </button>

            {

                onAnalysis && (

                    <button
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