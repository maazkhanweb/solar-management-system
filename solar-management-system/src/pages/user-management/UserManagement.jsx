import { useEffect, useState } from "react";

import authService from "../../services/authService";

import UserTable from "../../components/dashboard/user/UserTable";
import UserModal from "../../components/dashboard/user/UserModal";
import DeleteUserModal from "../../components/dashboard/user/DeleteUserModal";

import "./UserManagement.css";

function UserManagement() {

    const [users, setUsers] = useState([]);

    const [areas, setAreas] = useState([]);

    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {

        loadUsers();

        loadAreas();

    }, []);

    /**
     * Load Users
     */
    const loadUsers = async () => {

        try {

            setLoading(true);

            const response = await authService.getUsers();

            setUsers(response.users.data);

        } catch (error) {

            console.error(error);

            alert("Failed to load users.");

        } finally {

            setLoading(false);

        }

    };

    /**
     * Load Areas
     */
    const loadAreas = async () => {

        try {

            const response = await authService.getAreas();

            console.log("AREA RESPONSE:", response);

            setAreas(

                response.areas?.data ||

                response.data ||

                response.areas ||

                []

            );

        } catch (error) {

            console.error("AREA ERROR:", error);

        }

    };

    /**
     * Open Add User Modal
     */
    const openAddModal = () => {

        setSelectedUser(null);

        setIsModalOpen(true);

    };

    /**
     * Close User Modal
     */
    const closeModal = () => {

        setSelectedUser(null);

        setIsModalOpen(false);

    };

    /**
     * Save User
     */
    const handleSaveUser = async (userData) => {

        try {

            if (selectedUser) {

                await authService.updateUser(

                    selectedUser.id,

                    userData

                );

                alert("User updated successfully.");

            } else {

                await authService.createUser(userData);

                alert("User created successfully.");

            }

            await loadUsers();

            closeModal();

        } catch (error) {

            console.error(error);

            alert("Failed to save user.");

        }

    };

    /**
     * Add New Area
     */
    const handleAddArea = async (areaName) => {

        try {

            const areaData = {

                area_name: areaName,

                location: "-",

                manager: "-",

                phone: "-",

                status: "Active",

            };

            await authService.createArea(areaData);

            await loadAreas();

            return true;

        } catch (error) {

            console.error(error);

            alert("Failed to add area.");

            return false;

        }

    };

    /**
     * Edit User
     */
    const handleEdit = (user) => {

        setSelectedUser(user);

        setIsModalOpen(true);

    };

    /**
     * Delete User
     */
    const handleDelete = (user) => {

        setSelectedUser(user);

        setIsDeleteModalOpen(true);

    };

    /**
     * Confirm Delete
     */
    const confirmDelete = async () => {

        try {

            await authService.deleteUser(selectedUser.id);

            alert("User deleted successfully.");

            await loadUsers();

            closeDeleteModal();

        } catch (error) {

            console.error(error);

            alert("Failed to delete user.");

        }

    };

    /**
     * Close Delete Modal
     */
    const closeDeleteModal = () => {

        setSelectedUser(null);

        setIsDeleteModalOpen(false);

    };
        /**
     * Search Filter
     */
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

                <h2>

                    Loading users...

                </h2>

            </section>

        );

    }

    return (

        <section className="users">

            <div className="users-header">

                <div>

                    <h1>

                        User Management

                    </h1>

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
                onAddArea={handleAddArea}
                selectedUser={selectedUser}
                areas={areas}
            />

            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                selectedUser={selectedUser}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
            />

        </section>

    );

}

export default UserManagement;