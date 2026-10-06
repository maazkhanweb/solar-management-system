import { useState } from "react";
import { Outlet } from "react-router-dom";

import "./DashboardLayout.css";

import Sidebar from "../../components/dashboard/Sidebar/Sidebar";
import Navbar from "../../components/dashboard/Navbar/Navbar";


function DashboardLayout() {

    const [sidebarOpen, setSidebarOpen] =
        useState(false);


    const handleOpenSidebar = () => {

        setSidebarOpen(true);

    };


    const handleCloseSidebar = () => {

        setSidebarOpen(false);

    };


    return (

        <div className="dashboard-layout">

            <Sidebar
                isOpen={sidebarOpen}
                onClose={handleCloseSidebar}
            />


            {sidebarOpen && (

                <button
                    type="button"
                    className="dashboard-sidebar-overlay"
                    aria-label="Close navigation"
                    onClick={handleCloseSidebar}
                />

            )}


            <div className="dashboard-main">

                <Navbar
                    onMenuClick={handleOpenSidebar}
                />


                <main className="dashboard-content">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}


export default DashboardLayout;