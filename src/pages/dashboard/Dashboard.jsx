import { useEffect, useState, useCallback } from "react";

import {
    RiTeamLine,
    RiMapPinLine,
    RiArchiveLine,
    RiCheckboxCircleLine,
    RiFileList3Line,
    RiBarChartBoxLine,
    RiBarChart2Line,
    RiFlashlightLine,
    RiMoneyDollarCircleLine,
    RiCloseLine,
} from "react-icons/ri";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import DashboardCard from "../../components/dashboard/DashboardCard/DashboardCard";
import dashboardService from "../../services/dashboardService";


import "./Dashboard.css";

const Dashboard = () => {

    const [dashboardData, setDashboardData] = useState({

        statistics: {

            totalUsers: 0,

            totalAreas: 0,

            totalInventoryItems: 0,

            totalAssignedItems: 0,

            totalLowStockItems: 0,

            totalWapdaBills: 0,

            totalReports: 0,

        },

        comparisons: [],

    });

    const [loading, setLoading] = useState(true);

    const [showComparison, setShowComparison] = useState(false);


    const loadDashboardData = useCallback(async () => {

        try {

            const response =
                await dashboardService.getDashboardStatistics();

            setDashboardData(response.data);

        } catch (error) {

            console.error("Dashboard Error:", error);

        } finally {

            setLoading(false);

        }

    }, []);


    useEffect(() => {

        loadDashboardData();

    }, [loadDashboardData]);


    const dashboardStats = [

        {
            id: 1,
            title: "Total Users",
            value: dashboardData.statistics.totalUsers,
            subtitle: "Registered Users",
            icon: <RiTeamLine />,
            path: "/users",
        },

        {
            id: 2,
            title: "Areas",
            value: dashboardData.statistics.totalAreas,
            subtitle: "Active Areas",
            icon: <RiMapPinLine />,
            path: "/areas",
        },

        {
            id: 3,
            title: "Inventory Items",
            value: dashboardData.statistics.totalInventoryItems,
            subtitle: "Total Assets",
            icon: <RiArchiveLine />,
            path: "/inventory",
        },

        {
            id: 4,
            title: "Assigned Items",
            value: dashboardData.statistics.totalAssignedItems,
            subtitle: "Installed Assets",
            icon: <RiCheckboxCircleLine />,
            path: "/inventory-transactions",
        },

        {
            id: 5,
            title: "Low Stock",
            value: dashboardData.statistics.totalLowStockItems,
            subtitle: "Low Stock Items",
            icon: <RiArchiveLine />,
            path: "/inventory",
        },

        {
            id: 6,
            title: "WAPDA Bills",
            value: dashboardData.statistics.totalWapdaBills,
            subtitle: "Uploaded Bills",
            icon: <RiFileList3Line />,
            path: "/bill-management",
        },

        {
            id: 7,
            title: "Reports",
            value: dashboardData.statistics.totalReports,
            subtitle: "Available Reports",
            icon: <RiBarChartBoxLine />,
            path: "/reports",
        },

    ];


    const comparisons = Array.isArray(dashboardData.comparisons)
        ? dashboardData.comparisons
        : [];


    const formatAmount = (amount) => {

        const value = Number(amount || 0);

        return value.toLocaleString();

    };


    const formatUnits = (units) => {

        const value = Number(units || 0);

        return value.toLocaleString();

    };


    const getComparisonChartData = (comparison) => {

        if (!comparison?.has_bill || !comparison?.bill) {

            return [];

        }

        return [

            {
                name: "Units",

                WAPDA: Number(
                    comparison.analysis?.units_consumed || 0
                ),

                Solar: Number(
                    comparison.analysis?.generated_units ||
                    comparison.bill?.generated_units ||
                    0
                ),
            },

        ];

    };


    const closeComparison = () => {

        setShowComparison(false);

    };


    return (

        <section
            className="dashboard"
            style={{
            
            }}
        >

            <div className="dashboard-header">

                <div>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Welcome back, Admin. Here's an overview of your
                        Solar Management System.
                    </p>

                </div>

            </div>


            {

                loading ? (

                    <div
                        style={{
                            padding: "40px",
                            textAlign: "center",
                            fontSize: "18px",
                            fontWeight: "600",
                        }}
                    >
                        Loading Dashboard...
                    </div>

                ) : (

                    <>

                        {/* ==========================================
                            Dashboard Statistics
                        ========================================== */}

                        <div className="dashboard-cards">

                            {

                                dashboardStats.map((item) => (

                                    <DashboardCard
                                        key={item.id}
                                        title={item.title}
                                        value={item.value}
                                        subtitle={item.subtitle}
                                        icon={item.icon}
                                        path={item.path}
                                    />

                                ))

                            }


                            {/* ==========================================
                                View Comparison Card
                            ========================================== */}

                            <button
                                type="button"
                                className="view-comparison-card"
                                onClick={() => setShowComparison(true)}
                            >

                                <div className="view-comparison-icon">

                                    <RiBarChart2Line />

                                </div>

                                <div className="view-comparison-content">

                                    <span className="view-comparison-title">
                                        VIEW COMPARISON
                                    </span>

                                    <strong>
                                        {comparisons.length}
                                    </strong>

                                    <span className="view-comparison-subtitle">
                                        Area Comparisons
                                    </span>

                                </div>

                            </button>

                        </div>


                        {/* ==========================================
                            View Comparison Modal
                        ========================================== */}

                        {

                            showComparison && (

                                <div
                                    className="comparison-modal-overlay"
                                    onClick={closeComparison}
                                >

                                    <div
                                        className="comparison-modal"
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                    >

                                        {/* Modal Header */}

                                        <div className="comparison-modal-header">

                                            <div className="comparison-modal-title">

                                                <div className="comparison-title-icon">

                                                    <RiBarChart2Line />

                                                </div>

                                                <div>

                                                    <h2>
                                                        View Comparison
                                                    </h2>

                                                    <p>
                                                        Compare WAPDA consumption
                                                        with solar generation
                                                        for each area.
                                                    </p>

                                                </div>

                                            </div>


                                            <button
                                                type="button"
                                                className="comparison-close-btn"
                                                onClick={closeComparison}
                                                title="Close"
                                            >

                                                <RiCloseLine />

                                            </button>

                                        </div>


                                        {/* Comparison Content */}

                                        {

                                            comparisons.length === 0 ? (

                                                <div className="comparison-empty">

                                                    <RiBarChart2Line />

                                                    <h3>
                                                        No Comparison Data Available
                                                    </h3>

                                                    <p>
                                                        Area comparison data will
                                                        appear here when bills are
                                                        available.
                                                    </p>

                                                </div>

                                            ) : (

                                                <div className="comparison-grid">

                                                    {

                                                        comparisons.map(
                                                            (comparison) => {

                                                                const areaName =
                                                                    comparison.area?.name ||
                                                                    "Unknown Area";

                                                                const hasBill =
                                                                    comparison.has_bill &&
                                                                    comparison.bill;

                                                                const chartData =
                                                                    getComparisonChartData(
                                                                        comparison
                                                                    );

                                                                const difference =
                                                                    Number(
                                                                        comparison
                                                                            .comparison
                                                                            ?.difference_units ||
                                                                        0
                                                                    );

                                                                const isBenefit =
                                                                    difference >= 0;

                                                                const consumedUnits =
                                                                    Number(
                                                                        comparison
                                                                            .analysis
                                                                            ?.units_consumed ||
                                                                        0
                                                                    );

                                                                const generatedUnits =
                                                                    Number(
                                                                        comparison
                                                                            .analysis
                                                                            ?.generated_units ||
                                                                        comparison
                                                                            .bill
                                                                            ?.generated_units ||
                                                                        0
                                                                    );


                                                                return (

                                                                    <article
                                                                        className="comparison-card"
                                                                        key={
                                                                            comparison
                                                                                .area
                                                                                ?.id
                                                                        }
                                                                    >

                                                                        {/* Area Header */}

                                                                        <div className="comparison-card-header">

                                                                            <div>

                                                                                <span className="comparison-area-label">
                                                                                    AREA
                                                                                </span>

                                                                                <h3>
                                                                                    {areaName}
                                                                                </h3>

                                                                            </div>

                                                                            <div className="comparison-area-icon">

                                                                                <RiMapPinLine />

                                                                            </div>

                                                                        </div>


                                                                        {

                                                                            !hasBill ? (

                                                                                <div className="comparison-no-bill">

                                                                                    <RiFileList3Line />

                                                                                    <h4>
                                                                                        No Bill Data Available
                                                                                    </h4>

                                                                                    <p>
                                                                                        Upload a WAPDA bill
                                                                                        for this area to view
                                                                                        the comparison.
                                                                                    </p>

                                                                                </div>

                                                                            ) : (

                                                                                <>

                                                                                    {/* Metrics */}

                                                                                    <div className="comparison-metrics">

                                                                                        <div className="comparison-metric">

                                                                                            <div className="comparison-metric-icon">
                                                                                                <RiFlashlightLine />
                                                                                            </div>

                                                                                            <div>

                                                                                                <span>
                                                                                                    WAPDA Units
                                                                                                </span>

                                                                                                <strong>
                                                                                                    {formatUnits(
                                                                                                        consumedUnits
                                                                                                    )}
                                                                                                </strong>

                                                                                            </div>

                                                                                        </div>


                                                                                        <div className="comparison-metric">

                                                                                            <div className="comparison-metric-icon">
                                                                                                <RiFlashlightLine />
                                                                                            </div>

                                                                                            <div>

                                                                                                <span>
                                                                                                    Solar Units
                                                                                                </span>

                                                                                                <strong>
                                                                                                    {formatUnits(
                                                                                                        generatedUnits
                                                                                                    )}
                                                                                                </strong>

                                                                                            </div>

                                                                                        </div>


                                                                                        <div className="comparison-metric">

                                                                                            <div className="comparison-metric-icon">
                                                                                                <RiMoneyDollarCircleLine />
                                                                                            </div>

                                                                                            <div>

                                                                                                <span>
                                                                                                    WAPDA Bill
                                                                                                </span>

                                                                                                <strong>
                                                                                                    Rs.{" "}
                                                                                                    {formatAmount(
                                                                                                        comparison
                                                                                                            .bill
                                                                                                            ?.bill_amount
                                                                                                    )}
                                                                                                </strong>

                                                                                            </div>

                                                                                        </div>

                                                                                    </div>


                                                                                    {/* Benefit / Loss */}

                                                                                    <div
                                                                                        className={`comparison-result ${
                                                                                            isBenefit
                                                                                                ? "comparison-benefit"
                                                                                                : "comparison-loss"
                                                                                        }`}
                                                                                    >

                                                                                        <div>

                                                                                            <span>
                                                                                                {
                                                                                                    isBenefit
                                                                                                        ? "Benefit"
                                                                                                        : "Loss"
                                                                                                }
                                                                                            </span>

                                                                                            <strong>
                                                                                                {formatUnits(
                                                                                                    Math.abs(
                                                                                                        difference
                                                                                                    )
                                                                                                )}{" "}
                                                                                                Units
                                                                                            </strong>

                                                                                        </div>

                                                                                        <div className="comparison-result-symbol">

                                                                                            {
                                                                                                isBenefit
                                                                                                    ? "↑"
                                                                                                    : "↓"
                                                                                            }

                                                                                        </div>

                                                                                    </div>


                                                                                    {/* Graph */}

                                                                                    <div className="comparison-chart-wrapper">

                                                                                        <div className="comparison-chart-title">

                                                                                            <span>
                                                                                                Unit Comparison
                                                                                            </span>

                                                                                            <small>
                                                                                                {
                                                                                                    comparison
                                                                                                        .bill
                                                                                                        ?.month
                                                                                                }{" "}
                                                                                                {
                                                                                                    comparison
                                                                                                        .bill
                                                                                                        ?.year
                                                                                                }
                                                                                            </small>

                                                                                        </div>


                                                                                        <div className="comparison-chart">

                                                                                            <ResponsiveContainer
                                                                                                width="100%"
                                                                                                height="100%"
                                                                                            >

                                                                                                <BarChart
                                                                                                    data={chartData}
                                                                                                    margin={{
                                                                                                        top: 10,
                                                                                                        right: 10,
                                                                                                        left: -20,
                                                                                                        bottom: 5,
                                                                                                    }}
                                                                                                >

                                                                                                    <CartesianGrid
                                                                                                        strokeDasharray="3 3"
                                                                                                        vertical={false}
                                                                                                        stroke="rgba(128,128,128,0.20)"
                                                                                                    />

                                                                                                    <XAxis
                                                                                                        dataKey="name"
                                                                                                        tick={{
                                                                                                            fontSize: 12,
                                                                                                        }}
                                                                                                    />

                                                                                                    <YAxis
                                                                                                        tick={{
                                                                                                            fontSize: 11,
                                                                                                        }}
                                                                                                    />

                                                                                                    <Tooltip
                                                                                                        formatter={(
                                                                                                            value,
                                                                                                            name
                                                                                                        ) => [

                                                                                                            `${Number(
                                                                                                                value
                                                                                                            ).toLocaleString()} Units`,

                                                                                                            name,

                                                                                                        ]}
                                                                                                    />

                                                                                                    <Bar
                                                                                                        dataKey="WAPDA"
                                                                                                        name="WAPDA"
                                                                                                        fill="#0F766E"
                                                                                                        radius={[
                                                                                                            5,
                                                                                                            5,
                                                                                                            0,
                                                                                                            0,
                                                                                                        ]}
                                                                                                        barSize={45}
                                                                                                    />

                                                                                                    <Bar
                                                                                                        dataKey="Solar"
                                                                                                        name="Solar"
                                                                                                        fill="#D2A35C"
                                                                                                        radius={[
                                                                                                            5,
                                                                                                            5,
                                                                                                            0,
                                                                                                            0,
                                                                                                        ]}
                                                                                                        barSize={45}
                                                                                                    />

                                                                                                </BarChart>

                                                                                            </ResponsiveContainer>

                                                                                        </div>

                                                                                    </div>

                                                                                </>

                                                                            )

                                                                        }

                                                                    </article>

                                                                );

                                                            }
                                                        )

                                                    }

                                                </div>

                                            )

                                        }


                                        {/* Modal Footer */}

                                        <div className="comparison-modal-footer">

                                            <button
                                                type="button"
                                                className="comparison-modal-close"
                                                onClick={closeComparison}
                                            >
                                                Close
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            )

                        }

                    </>

                )

            }

        </section>

    );

};

export default Dashboard;