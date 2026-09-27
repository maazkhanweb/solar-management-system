import {
    useEffect,
    useState,
    useCallback,
    useMemo,
} from "react";

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
    RiArrowLeftLine,
    RiCalendarLine,
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


    const [loading, setLoading] =
        useState(true);


    const [showComparison, setShowComparison] =
        useState(false);


    /*
    |--------------------------------------------------------------------------
    | Selected Month
    |--------------------------------------------------------------------------
    */

    const [selectedMonth, setSelectedMonth] =
        useState(null);


    /*
    |--------------------------------------------------------------------------
    | Load Dashboard Data
    |--------------------------------------------------------------------------
    */

    const loadDashboardData =
        useCallback(async () => {

            try {

                const response =
                    await dashboardService
                        .getDashboardStatistics();

                /*
                 * API structure:
                 *
                 * response.data.statistics
                 * response.data.comparisons
                 */

                setDashboardData(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Dashboard Error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        }, []);


    useEffect(() => {

        loadDashboardData();

    }, [loadDashboardData]);


    /*
    |--------------------------------------------------------------------------
    | Dashboard Statistics
    |--------------------------------------------------------------------------
    */

    const dashboardStats = [

        {
            id: 1,
            title: "Total Users",
            value:
                dashboardData.statistics.totalUsers,
            subtitle: "Registered Users",
            icon: <RiTeamLine />,
            path: "/users",
        },

        {
            id: 2,
            title: "Areas",
            value:
                dashboardData.statistics.totalAreas,
            subtitle: "Active Areas",
            icon: <RiMapPinLine />,
            path: "/areas",
        },

        {
            id: 3,
            title: "Inventory Items",
            value:
                dashboardData.statistics.totalInventoryItems,
            subtitle: "Total Assets",
            icon: <RiArchiveLine />,
            path: "/inventory",
        },

        {
            id: 4,
            title: "Assigned Items",
            value:
                dashboardData.statistics.totalAssignedItems,
            subtitle: "Installed Assets",
            icon: <RiCheckboxCircleLine />,
            path: "/inventory-transactions",
        },

        {
            id: 5,
            title: "Low Stock",
            value:
                dashboardData.statistics.totalLowStockItems,
            subtitle: "Low Stock Items",
            icon: <RiArchiveLine />,
            path: "/inventory",
        },

        {
            id: 6,
            title: "WAPDA Bills",
            value:
                dashboardData.statistics.totalWapdaBills,
            subtitle: "Uploaded Bills",
            icon: <RiFileList3Line />,
            path: "/bill-management",
        },

        {
            id: 7,
            title: "Reports",
            value:
                dashboardData.statistics.totalReports,
            subtitle: "Available Reports",
            icon: <RiBarChartBoxLine />,
            path: "/reports",
        },

    ];


    /*
    |--------------------------------------------------------------------------
    | Monthly Comparisons
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | Backend now returns:
    |
    | comparisons: [
    |     {
    |         month: 8,
    |         year: 2026,
    |         month_name: "August 2026",
    |         comparison_count: 3,
    |         comparisons: [...]
    |     }
    | ]
    |
    | Therefore we DO NOT rebuild month groups
    | from individual area comparisons.
    |
    */

    const comparisons =
        Array.isArray(
            dashboardData.comparisons
        )
            ? dashboardData.comparisons
            : [];


    /*
    |--------------------------------------------------------------------------
    | Month Groups
    |--------------------------------------------------------------------------
    |
    | Backend already grouped the data by month/year.
    |
    */

    const monthGroups =
        useMemo(() => {

            return comparisons
                .filter(
                    (group) =>
                        group &&
                        group.month &&
                        group.year &&
                        Array.isArray(
                            group.comparisons
                        )
                )
                .sort(
                    (a, b) => {

                        if (
                            Number(a.year) !==
                            Number(b.year)
                        ) {

                            return (
                                Number(b.year) -
                                Number(a.year)
                            );

                        }

                        return (
                            Number(b.month) -
                            Number(a.month)
                        );

                    }
                );

        }, [comparisons]);


    /*
    |--------------------------------------------------------------------------
    | Selected Month Data
    |--------------------------------------------------------------------------
    */

    const selectedMonthData =
        useMemo(() => {

            if (!selectedMonth) {

                return [];

            }

            const group =
                monthGroups.find(
                    (item) =>
                        item.month ===
                            selectedMonth.month &&
                        item.year ===
                            selectedMonth.year
                );

            return group
                ? group.comparisons
                : [];

        }, [
            selectedMonth,
            monthGroups,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Selected Month Label
    |--------------------------------------------------------------------------
    */

    const selectedMonthLabel =
        useMemo(() => {

            if (!selectedMonth) {

                return "";

            }

            const group =
                monthGroups.find(
                    (item) =>
                        item.month ===
                            selectedMonth.month &&
                        item.year ===
                            selectedMonth.year
                );

            if (!group) {

                return "";

            }

            return (
                group.month_name ||
                new Date(
                    2000,
                    Number(group.month) - 1,
                    1
                ).toLocaleString(
                    "en-US",
                    {
                        month: "long",
                    }
                ) +
                ` ${group.year}`
            );

        }, [
            selectedMonth,
            monthGroups,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Format Amount
    |--------------------------------------------------------------------------
    */

    const formatAmount =
        (amount) => {

            const value =
                Number(
                    amount || 0
                );

            return value.toLocaleString();

        };


    /*
    |--------------------------------------------------------------------------
    | Format Units
    |--------------------------------------------------------------------------
    */

    const formatUnits =
        (units) => {

            const value =
                Number(
                    units || 0
                );

            return value.toLocaleString();

        };


    /*
    |--------------------------------------------------------------------------
    | Chart Data
    |--------------------------------------------------------------------------
    */

    const getComparisonChartData =
        (comparison) => {

            if (
                !comparison?.has_bill ||
                !comparison?.bill
            ) {

                return [];

            }


            return [

                {

                    name: "Units",

                    WAPDA: Number(
                        comparison
                            .analysis
                            ?.units_consumed ??
                        comparison
                            .bill
                            ?.units_consumed ??
                        0
                    ),

                    Solar: Number(
                        comparison
                            .analysis
                            ?.generated_units ??
                        comparison
                            .bill
                            ?.generated_units ??
                        0
                    ),

                },

            ];

        };


    /*
    |--------------------------------------------------------------------------
    | Open Comparison
    |--------------------------------------------------------------------------
    */

    const openComparison =
        () => {

            setShowComparison(true);

            /*
             * Automatically select latest month.
             */

            if (
                monthGroups.length > 0
            ) {

                setSelectedMonth({

                    month:
                        Number(
                            monthGroups[0].month
                        ),

                    year:
                        Number(
                            monthGroups[0].year
                        ),

                });

            } else {

                setSelectedMonth(null);

            }

        };


    /*
    |--------------------------------------------------------------------------
    | Close Comparison
    |--------------------------------------------------------------------------
    */

    const closeComparison =
        () => {

            setShowComparison(false);

            setSelectedMonth(null);

        };


    /*
    |--------------------------------------------------------------------------
    | Back To Month Cards
    |--------------------------------------------------------------------------
    */

    const backToMonths =
        () => {

            setSelectedMonth(null);

        };


    return (

        <section
            className="dashboard"
        >

            {/* ======================================================
                Dashboard Header
            ======================================================= */}

            <div className="dashboard-header">

                <div>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Welcome back, Admin. Here's
                        an overview of your Solar
                        Management System.
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

                        {/* ==================================================
                            Dashboard Statistics
                        =================================================== */}

                        <div className="dashboard-cards">

                            {

                                dashboardStats.map(
                                    (item) => (

                                        <DashboardCard
                                            key={item.id}
                                            title={item.title}
                                            value={item.value}
                                            subtitle={
                                                item.subtitle
                                            }
                                            icon={item.icon}
                                            path={item.path}
                                        />

                                    )
                                )

                            }


                            {/* ==================================================
                                View Comparison Card
                            =================================================== */}

                            <button
                                type="button"
                                className="view-comparison-card"
                                onClick={
                                    openComparison
                                }
                            >

                                <div className="view-comparison-icon">

                                    <RiBarChart2Line />

                                </div>


                                <div className="view-comparison-content">

                                    <span className="view-comparison-title">

                                        VIEW COMPARISON

                                    </span>


                                    <strong>

                                        {
                                            monthGroups.length
                                        }

                                    </strong>


                                    <span className="view-comparison-subtitle">

                                        Available Months

                                    </span>

                                </div>

                            </button>

                        </div>


                        {/* ==================================================
                            View Comparison Modal
                        =================================================== */}

                        {

                            showComparison && (

                                <div
                                    className="comparison-modal-overlay"
                                    onClick={
                                        closeComparison
                                    }
                                >

                                    <div
                                        className="comparison-modal"
                                        onClick={
                                            (event) =>
                                                event.stopPropagation()
                                        }
                                    >

                                        {/* ==================================================
                                            Modal Header
                                        =================================================== */}

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

                                                        {

                                                            selectedMonth
                                                                ? `Compare WAPDA consumption with solar generation for ${selectedMonthLabel}.`
                                                                : "Select a month to compare WAPDA consumption with solar generation."

                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            <button
                                                type="button"
                                                className="comparison-close-btn"
                                                onClick={
                                                    closeComparison
                                                }
                                                title="Close"
                                            >

                                                <RiCloseLine />

                                            </button>

                                        </div>


                                        {/* ==================================================
                                            MONTH SELECTION
                                        =================================================== */}

                                        {

                                            !selectedMonth ? (

                                                <>

                                                    {

                                                        monthGroups.length === 0 ? (

                                                            <div className="comparison-empty">

                                                                <RiCalendarLine />

                                                                <h3>
                                                                    No Monthly Comparison Data Available
                                                                </h3>

                                                                <p>
                                                                    Monthly comparison cards will
                                                                    appear here when bills are available.
                                                                </p>

                                                            </div>

                                                        ) : (

                                                            <div className="comparison-month-grid">

                                                                {

                                                                    monthGroups.map(
                                                                        (group) => (

                                                                            <button
                                                                                type="button"
                                                                                key={
                                                                                    `${group.year}-${group.month}`
                                                                                }
                                                                                className="comparison-month-card"
                                                                                onClick={() =>
                                                                                    setSelectedMonth({

                                                                                        month:
                                                                                            Number(
                                                                                                group.month
                                                                                            ),

                                                                                        year:
                                                                                            Number(
                                                                                                group.year
                                                                                            ),

                                                                                    })
                                                                                }
                                                                            >

                                                                                <div className="comparison-month-icon">

                                                                                    <RiCalendarLine />

                                                                                </div>


                                                                                <div className="comparison-month-content">

                                                                                    <span>
                                                                                        MONTH
                                                                                    </span>


                                                                                    <h3>

                                                                                        {
                                                                                            group.month_name ||
                                                                                            new Date(
                                                                                                2000,
                                                                                                Number(
                                                                                                    group.month
                                                                                                ) - 1,
                                                                                                1
                                                                                            ).toLocaleString(
                                                                                                "en-US",
                                                                                                {
                                                                                                    month: "long",
                                                                                                }
                                                                                            ) +
                                                                                            ` ${group.year}`
                                                                                        }

                                                                                    </h3>


                                                                                    <p>

                                                                                        {
                                                                                            group.comparison_count ??
                                                                                            group.comparisons.length
                                                                                        }{" "}

                                                                                        Comparison
                                                                                        {
                                                                                            (
                                                                                                group.comparison_count ??
                                                                                                group.comparisons.length
                                                                                            ) === 1
                                                                                                ? ""
                                                                                                : "s"
                                                                                        }

                                                                                    </p>

                                                                                </div>


                                                                                <div className="comparison-month-arrow">

                                                                                    →

                                                                                </div>

                                                                            </button>

                                                                        )
                                                                    )

                                                                }

                                                            </div>

                                                        )

                                                    }

                                                </>

                                            ) : (

                                                <>

                                                    {/* ==================================================
                                                        Back To Months
                                                    =================================================== */}

                                                    <button
                                                        type="button"
                                                        className="comparison-back-btn"
                                                        onClick={
                                                            backToMonths
                                                        }
                                                    >

                                                        <RiArrowLeftLine />

                                                        <span>
                                                            Back to Months
                                                        </span>

                                                    </button>


                                                    {/* ==================================================
                                                        Selected Month Heading
                                                    =================================================== */}

                                                    <div className="comparison-selected-month">

                                                        <div>

                                                            <span>
                                                                SELECTED MONTH
                                                            </span>

                                                            <h3>
                                                                {
                                                                    selectedMonthLabel
                                                                }
                                                            </h3>

                                                        </div>


                                                        <div className="comparison-selected-month-count">

                                                            {
                                                                selectedMonthData.length
                                                            }

                                                            {" "}

                                                            Comparison
                                                            {
                                                                selectedMonthData.length === 1
                                                                    ? ""
                                                                    : "s"
                                                            }

                                                        </div>

                                                    </div>


                                                    {/* ==================================================
                                                        Area Comparison Cards
                                                    =================================================== */}

                                                    {

                                                        selectedMonthData.length === 0 ? (

                                                            <div className="comparison-empty">

                                                                <RiBarChart2Line />

                                                                <h3>
                                                                    No Comparison Data Available
                                                                </h3>

                                                                <p>
                                                                    No bill comparison data is
                                                                    available for this month.
                                                                </p>

                                                            </div>

                                                        ) : (

                                                            <div className="comparison-grid">

                                                                {

                                                                    selectedMonthData.map(
                                                                        (
                                                                            comparison,
                                                                            index
                                                                        ) => {

                                                                            const areaName =
                                                                                comparison
                                                                                    .area
                                                                                    ?.name ||
                                                                                "Unknown Area";


                                                                            const hasBill =
                                                                                comparison
                                                                                    .has_bill &&
                                                                                comparison
                                                                                    .bill;


                                                                            const chartData =
                                                                                getComparisonChartData(
                                                                                    comparison
                                                                                );


                                                                            const difference =
                                                                                Number(
                                                                                    comparison
                                                                                        .comparison
                                                                                        ?.difference_units ??
                                                                                    comparison
                                                                                        .analysis
                                                                                        ?.difference_units ??
                                                                                    0
                                                                                );


                                                                            const isBenefit =
                                                                                difference >= 0;


                                                                            const consumedUnits =
                                                                                Number(
                                                                                    comparison
                                                                                        .analysis
                                                                                        ?.units_consumed ??
                                                                                    comparison
                                                                                        .bill
                                                                                        ?.units_consumed ??
                                                                                    0
                                                                                );


                                                                            const generatedUnits =
                                                                                Number(
                                                                                    comparison
                                                                                        .analysis
                                                                                        ?.generated_units ??
                                                                                    comparison
                                                                                        .bill
                                                                                        ?.generated_units ??
                                                                                    0
                                                                                );


                                                                            /*
                                                                            |--------------------------------------------------------------------------
                                                                            | Unique Key
                                                                            |--------------------------------------------------------------------------
                                                                            */

                                                                            const comparisonKey =
                                                                                comparison
                                                                                    .bill
                                                                                    ?.id
                                                                                    ? `bill-${comparison.bill.id}`
                                                                                    : `${comparison.area?.id || "area"}-${index}`;


                                                                            return (

                                                                                <article
                                                                                    className="comparison-card"
                                                                                    key={
                                                                                        comparisonKey
                                                                                    }
                                                                                >

                                                                                    {/* ==================================================
                                                                                        Area Header
                                                                                    =================================================== */}

                                                                                    <div className="comparison-card-header">

                                                                                        <div>

                                                                                            <span className="comparison-area-label">

                                                                                                AREA

                                                                                            </span>


                                                                                            <h3>

                                                                                                {
                                                                                                    areaName
                                                                                                }

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

                                                                                                {/* ==================================================
                                                                                                    Metrics
                                                                                                =================================================== */}

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

                                                                                                                {
                                                                                                                    formatUnits(
                                                                                                                        consumedUnits
                                                                                                                    )
                                                                                                                }

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

                                                                                                                {
                                                                                                                    formatUnits(
                                                                                                                        generatedUnits
                                                                                                                    )
                                                                                                                }

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

                                                                                                                {
                                                                                                                    formatAmount(
                                                                                                                        comparison
                                                                                                                            .bill
                                                                                                                            ?.bill_amount
                                                                                                                    )
                                                                                                                }

                                                                                                            </strong>

                                                                                                        </div>

                                                                                                    </div>

                                                                                                </div>


                                                                                                {/* ==================================================
                                                                                                    Benefit / Loss
                                                                                                =================================================== */}

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

                                                                                                            {
                                                                                                                formatUnits(
                                                                                                                    Math.abs(
                                                                                                                        difference
                                                                                                                    )
                                                                                                                )
                                                                                                            }{" "}

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


                                                                                                {/* ==================================================
                                                                                                    Graph
                                                                                                =================================================== */}

                                                                                                <div className="comparison-chart-wrapper">

                                                                                                    <div className="comparison-chart-title">

                                                                                                        <span>
                                                                                                            Unit Comparison
                                                                                                        </span>


                                                                                                        <small>

                                                                                                            {
                                                                                                                selectedMonthLabel
                                                                                                            }

                                                                                                        </small>

                                                                                                    </div>


                                                                                                    <div className="comparison-chart">

                                                                                                        <ResponsiveContainer
                                                                                                            width="100%"
                                                                                                            height="100%"
                                                                                                        >

                                                                                                            <BarChart
                                                                                                                data={
                                                                                                                    chartData
                                                                                                                }
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

                                                </>

                                            )

                                        }


                                        {/* ==================================================
                                            Modal Footer
                                        =================================================== */}

                                        <div className="comparison-modal-footer">

                                            <button
                                                type="button"
                                                className="comparison-modal-close"
                                                onClick={
                                                    closeComparison
                                                }
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