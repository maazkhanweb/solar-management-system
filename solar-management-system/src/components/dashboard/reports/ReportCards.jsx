/**
 * ============================================================================
 * File: src/components/dashboard/reports/ReportCards.jsx
 * Description:
 * Live Report Summary Cards
 * ============================================================================
 */

import {
    FaFileAlt,
    FaCalendarDay,
    FaCalendarAlt,
    FaChartLine,
} from "react-icons/fa";

import "./ReportCards.css";

function ReportCards({ summary }) {

    const cards = [

        {
            id: 1,
            title: "Total Reports",
            value: summary?.totalReports ?? 0,
            icon: <FaFileAlt />,
            color: "#2563eb",
        },

        {
            id: 2,
            title: "Daily Reports",
            value: summary?.dailyReports ?? 0,
            icon: <FaCalendarDay />,
            color: "#16a34a",
        },

        {
            id: 3,
            title: "Monthly Reports",
            value: summary?.monthlyReports ?? 0,
            icon: <FaCalendarAlt />,
            color: "#f59e0b",
        },

        {
            id: 4,
            title: "Yearly Reports",
            value: summary?.yearlyReports ?? 0,
            icon: <FaChartLine />,
            color: "#7c3aed",
        },

    ];

    return (

        <div className="report-cards">

            {

                cards.map((card) => (

                    <div
                        key={card.id}
                        className="report-card"
                    >

                        <div
                            className="report-card-icon"
                            style={{
                                backgroundColor: card.color,
                            }}
                        >

                            {card.icon}

                        </div>

                        <div className="report-card-content">

                            <h4>

                                {card.title}

                            </h4>

                            <h2>

                                {card.value}

                            </h2>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}

export default ReportCards;