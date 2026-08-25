/**
 * ============================================================================
 * File: src/components/dashboard/DashboardCard/DashboardCard.jsx
 * Description:
 * Reusable Dashboard Card Component
 * ============================================================================
 */

import { useNavigate } from "react-router-dom";

import "./DashboardCard.css";

function DashboardCard({

    title,

    value,

    icon,

    subtitle,

    path,

}) {

    const navigate = useNavigate();

    /**
     * Handle Card Click
     */
    const handleClick = () => {

        if (path) {

            navigate(path);

        }

    };

    return (

        <div
            className="dashboard-card"
            onClick={handleClick}
        >

            <div className="card-top">

                <div className="card-icon">

                    {icon}

                </div>

                <div className="card-info">

                    <h4>

                        {title}

                    </h4>

                    <h2>

                        {value}

                    </h2>

                    <p>

                        {subtitle}

                    </p>

                </div>

            </div>

        </div>

    );

}

export default DashboardCard;