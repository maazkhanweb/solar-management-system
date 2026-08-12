import { Routes, Route, Navigate } from "react-router-dom";

import useAuthentication from "../hooks/useAuth";

import Login from "../pages/auth/Login";

import Dashboard from "../pages/dashboard/Dashboard";

import UserManagement from "../pages/user-management/UserManagement";

import AreaManagement from "../pages/area-management/AreaManagement";

import InventoryManagement from "../pages/dashboard/inventory/InventoryManagement";

import InventoryTransactionHistory from "../pages/dashboard/inventoryTransaction/InventoryTransactionHistory";

import BillManagement from "../pages/dashboard/wapda-bill/WapdaBillManagement";

import Reports from "../pages/dashboard/reports/Reports";

import Charts from "../pages/dashboard/charts/Charts";

import MyProfile from "../pages/profile/MyProfile/MyProfile";

import AccountSettings from "../pages/profile/AccountSettings/AccountSettings";

import ChangePassword from "../pages/profile/ChangePassword/ChangePassword";

import NotFound from "../pages/notfound/NotFound";

import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {

    const {
        isAuthenticated,
        loading,
    } = useAuthentication();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (

        <Routes>

            {/* Public Route */}

            <Route
                path="/"
                element={
                    isAuthenticated
                        ? <Navigate to="/dashboard" replace />
                        : <Login />
                }
            />

            {/* Protected Routes */}

            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/users"
                    element={<UserManagement />}
                />

                <Route
                    path="/areas"
                    element={<AreaManagement />}
                />

                <Route
                    path="/inventory"
                    element={<InventoryManagement />}
                />

                {/* Inventory Transaction History */}

                <Route
                    path="/inventory-transactions"
                    element={<InventoryTransactionHistory />}
                />

                <Route
    path="/bill-management"
    element={<BillManagement />}
/>

                <Route
                    path="/reports"
                    element={<Reports />}
                />

                <Route
                    path="/charts"
                    element={<Charts />}
                />

                {/* Profile */}

                <Route
                    path="/my-profile"
                    element={<MyProfile />}
                />

                <Route
                    path="/account-settings"
                    element={<AccountSettings />}
                />

                <Route
                    path="/change-password"
                    element={<ChangePassword />}
                />

            </Route>

            {/* 404 */}

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>

    );

}

export default AppRoutes;