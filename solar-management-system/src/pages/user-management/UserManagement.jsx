/*
==========================================================
File: src/pages/user-management/UserManagement.jsx
Description: User Management page with custom success and error notifications.
==========================================================
*/

import { useEffect, useState } from "react";

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

    useEffect(() => {

        loadUsers();

    }, []);

    const loadUsers = async () => {

        try {

            setLoading(true);

            const response = await authService.getUsers();

            setUsers(response.users.data);

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to load users.",
                "error"
            );

        } finally {

            setLoading(false);

        }

    };

    const openAddModal = () => {

        setSelectedUser(null);

        setIsModalOpen(true);

    };

    const closeModal = () => {

        setIsModalOpen(false);

        setSelectedUser(null);

    };

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

                await authService.updateUser(
                    selectedUser.id,
                    userData
                );

                showNotification(
                    "User updated successfully."
                );

            } else {

                await authService.createUser(userData);

                showNotification(
                    "User created successfully."
                );

            }

            await loadUsers();

            closeModal();

        } catch (error) {

            console.error(error);

            showNotification(
                getErrorMessage(
                    error,
                    "Failed to save user."
                ),
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

    const confirmDelete = async () => {

        try {

            await authService.deleteUser(
                selectedUser.id
            );

            showNotification(
                "User deleted successfully."
            );

            await loadUsers();

            closeDeleteModal();

        } catch (error) {

            console.error(error);

            showNotification(
                "Failed to delete user.",
                "error"
            );

        }

    };

    const closeDeleteModal = () => {

        setSelectedUser(null);

        setIsDeleteModalOpen(false);

    };

    const filteredUsers = users.filter((user) => {

        const search = searchTerm.toLowerCase();

        return (

            user.name.toLowerCase().includes(search) ||

            user.email.toLowerCase().includes(search) ||

            user.role.toLowerCase().includes(search) ||

            user.status.toLowerCase().includes(search)

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

                    <p>
                        Manage all system users from one place.
                    </p>

                </div>

                <button
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
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
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

                                {notification.type === "error"
                                    ? "!"
                                    : "✓"
                                }

                            </div>

                            <p>
                                {notification.message}
                            </p>

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