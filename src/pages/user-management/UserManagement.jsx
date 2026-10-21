
/*
==========================================================
File: src/pages/user-management/UserManagement.jsx
Description: User Management page with custom notifications.
==========================================================
*/

import { useCallback, useEffect, useState } from "react";

import authService from "../../services/authService";

import UserTable from "../../components/dashboard/user/UserTable";
import UserModal from "../../components/dashboard/user/UserModal";
import DeleteUserModal from "../../components/dashboard/user/DeleteUserModal";

import "./UserManagement.css";

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [notification, setNotification] = useState({
        isOpen: false,
        type: "success",
        message: "",
    });

    const showNotification = (message, type = "success") => {
        setNotification({
            isOpen: true,
            type,
            message,
        });
    };

    const closeNotification = () => {
        setNotification({
            isOpen: false,
            type: "success",
            message: "",
        });
    };

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);

            const response = await authService.getUsers();
            const responseUsers = response?.users?.data;

            if (!Array.isArray(responseUsers)) {
                throw new Error("Unexpected users API response.");
            }

            /*
             * Google users are identified by their stored google_id.
             * Do not identify accounts by role alone: an admin may
             * also create a user with the Public User role.
             */
            setUsers(
                responseUsers.map((user) => ({
                    ...user,
                    is_google_user: Boolean(
                        user.is_google_user ||
                        user.auth_provider === "google" ||
                        user.google_id
                    ),
                }))
            );
        } catch (error) {
            console.error("Failed to load users:", error);
            showNotification("Failed to load users.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const openAddModal = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const getErrorMessage = (error, fallbackMessage) => {
        const responseData = error?.response?.data;

        if (responseData?.message) {
            return responseData.message;
        }

        if (responseData?.errors) {
            const firstError = Object.values(responseData.errors)
                .flat()
                .find(Boolean);

            if (firstError) {
                return firstError;
            }
        }

        return fallbackMessage;
    };

    const handleSaveUser = async (userData) => {
        try {
            if (selectedUser) {
                await authService.updateUser(selectedUser.id, userData);
                showNotification("User updated successfully.");
            } else {
                await authService.createUser(userData);
                showNotification("User created successfully.");
            }

            await loadUsers();
            closeModal();
        } catch (error) {
            console.error("Failed to save user:", error);

            showNotification(
                getErrorMessage(error, "Failed to save user."),
                "error"
            );
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setSelectedUser(null);
        setIsDeleteModalOpen(false);
    };

    const confirmDelete = async () => {
        if (!selectedUser) return;

        try {
            await authService.deleteUser(selectedUser.id);
            showNotification("User deleted successfully.");

            closeDeleteModal();
            await loadUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);

            showNotification(
                getErrorMessage(error, "Failed to delete user."),
                "error"
            );
        }
    };

    const filteredUsers = users.filter((user) => {
        const search = searchTerm.trim().toLowerCase();

        return [
            user.name,
            user.email,
            user.role,
            user.status,
        ].some((value) =>
            String(value ?? "").toLowerCase().includes(search)
        );
    });

    if (loading) {
        return (
            <section className="users">
                <h2>Loading users...</h2>
            </section>
        );
    }

    return (
        <section className="users">
            <div className="users-header">
                <div>
                    <h1>User Management</h1>
                    <p>Manage all system users from one place.</p>
                </div>

                <button
                    type="button"
                    className="add-user-btn"
                    onClick={openAddModal}
                >
                    + Add User
                </button>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search User..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>

            <UserTable
                users={filteredUsers}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <UserModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={handleSaveUser}
                selectedUser={selectedUser}
            />

            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                selectedUser={selectedUser}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
            />

            {notification.isOpen && (
                <div className="user-notification-overlay">
                    <div
                        className={`user-notification ${
                            notification.type === "error"
                                ? "error"
                                : "success"
                        }`}
                    >
                        <div className="user-notification-content">
                            <div className="user-notification-icon">
                                {notification.type === "error" ? "!" : "✓"}
                            </div>

                            <p>{notification.message}</p>
                        </div>

                        <button
                            type="button"
                            className="user-notification-btn"
                            onClick={closeNotification}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default UserManagement;
