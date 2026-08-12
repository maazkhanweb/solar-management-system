import { useEffect, useState, useCallback } from "react";

import {
    RiTeamLine,
    RiMapPinLine,
    RiArchiveLine,
    RiCheckboxCircleLine,
    RiFileList3Line,
    RiBarChartBoxLine,
} from "react-icons/ri";

import DashboardCard from "../../components/dashboard/DashboardCard/DashboardCard";

import ProductionChart from "../../components/dashboard/charts/ProductionChart";
import BatteryChart from "../../components/dashboard/charts/BatteryChart";
import BillChart from "../../components/dashboard/charts/BillChart";
import AIChart from "../../components/dashboard/charts/AIChart";

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

        production: [],

        batteryHealth: [],

        wapdaTrend: [],

        aiPerformance: [],

    });

    const [loading, setLoading] = useState(true);

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

    return (

        <section className="dashboard">

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

                        </div>

                        <div className="dashboard-charts">

                            <ProductionChart
                                data={dashboardData.production}
                            />

                            <BatteryChart
                                data={dashboardData.batteryHealth}
                            />

                        </div>

                        <div className="dashboard-charts">

                            <BillChart
                                data={dashboardData.wapdaTrend}
                            />

                            <AIChart
                                data={dashboardData.aiPerformance}
                            />

                        </div>

                    </>

                )

            }

        </section>

    );

};

export default Dashboard;