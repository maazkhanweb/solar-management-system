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
import ComparisonACDC from "../pages/dashboard/comparison/ComparisonACDC";
import SavingsAnalysis from "../pages/dashboard/comparison/SavingsAnalysis";

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
        user,
    } = useAuthentication();
    const isPublicUser = String(user?.role || "").toLowerCase() === "public user";

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
                    path="/users" element={isPublicUser ? <Navigate to="/dashboard" replace /> : <UserManagement />}
                />

                <Route
                    path="/areas" element={isPublicUser ? <Navigate to="/dashboard" replace /> : <AreaManagement />}
                />

                <Route
                    path="/inventory" element={isPublicUser ? <Navigate to="/dashboard" replace /> : <InventoryManagement />}
                />

                {/* Inventory Transaction History */}

                <Route
                    path="/inventory-transactions" element={isPublicUser ? <Navigate to="/dashboard" replace /> : <InventoryTransactionHistory />}
                />

                <Route
    path="/bill-management" element={isPublicUser ? <Navigate to="/dashboard" replace /> : <BillManagement />}
/>

                <Route
                    path="/reports" element={isPublicUser ? <Navigate to="/dashboard" replace /> : <Reports />}
                />

                <Route
                    path="/comparison-ac-dc"
                    element={<ComparisonACDC />}
                />

                <Route
                    path="/comparison-ac-dc/savings-analysis"
                    element={<SavingsAnalysis />}
                />

                <Route
                    path="/savings-analysis"
                    element={<SavingsAnalysis />}
                />

                <Route
                    path="/charts" element={isPublicUser ? <Navigate to="/dashboard" replace /> : <Charts />}
                />

                {/* Profile */}

                <Route
                    path="/my-profile" element={isPublicUser ? <Navigate to="/dashboard" replace /> : <MyProfile />}
                />

                <Route
                    path="/account-settings" element={isPublicUser ? <Navigate to="/dashboard" replace /> : <AccountSettings />}
                />

                <Route
                    path="/change-password" element={isPublicUser ? <Navigate to="/dashboard" replace /> : <ChangePassword />}
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