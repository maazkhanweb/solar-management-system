import { Outlet } from "react-router-dom";

import "./DashboardLayout.css";

import Sidebar from "../../components/dashboard/Sidebar/Sidebar";
import Navbar from "../../components/dashboard/Navbar/Navbar";

function DashboardLayout() {

    return (

        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-main">

                <Navbar />

                <main className="dashboard-content">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}

export default DashboardLayout;