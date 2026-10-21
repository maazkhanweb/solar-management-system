
/**
 * ============================================================================
 * File: src/components/dashboard/user/UserTable.jsx
 *
 * Google-created users:
 * Name, Email, blank Phone, blank Area, Role, Status and Edit only.
 *
 * Admin-created users:
 * Existing columns and Edit/Delete actions.
 *
 * Protected Super Admin:
 * Cannot be deleted.
 * ============================================================================
 */

import "./UserTable.css";
import ActionButtons from "../../common/ActionButtons/ActionButtons";

const SUPER_ADMIN_EMAIL = "admin@solar.com";

function UserTable({ users = [], onEdit, onDelete }) {
    const isGoogleUser = (user) =>
        Boolean(
            user.is_google_user === true ||
            user.auth_provider === "google" ||
            user.google_id
        );

    return (
        <div className="users-table-container">
            <table className="users-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Area</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.length > 0 ? (
                        users.map((user, index) => {
                            const googleUser = isGoogleUser(user);

                            const isSuperAdmin =
                                user.email?.toLowerCase() ===
                                SUPER_ADMIN_EMAIL;

                            const status = String(
                                user.status ?? "Active"
                            );

                            return (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>

                                    <td>{user.name || "-"}</td>

                                    <td>{user.email || "-"}</td>

                                    {/* Phone is blank for Google users. */}
                                    <td>
                                        {googleUser
                                            ? ""
                                            : user.phone || "-"}
                                    </td>

                                    {/* Area is blank for Google users. */}
                                    <td>
                                        {googleUser
                                            ? ""
                                            : (
                                                user.area?.area_name ??
                                                user.area?.name ??
                                                user.area_name ??
                                                "All Areas"
                                            )}
                                    </td>

                                    <td>{user.role || "Public User"}</td>

                                    <td>
                                        <span
                                            className={`status ${status.toLowerCase()}`}
                                        >
                                            {status}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="table-actions">
                                            {googleUser ? (
                                                <button
                                                    type="button"
                                                    className="edit-btn"
                                                    title="Edit user"
                                                    aria-label={`Edit ${user.name || "user"}`}
                                                    onClick={() =>
                                                        onEdit(user)
                                                    }
                                                >
                                                    <span aria-hidden="true">
                                                        ✎
                                                    </span>
                                                </button>
                                            ) : (
                                                <ActionButtons
                                                    onEdit={() =>
                                                        onEdit(user)
                                                    }
                                                    onDelete={
                                                        isSuperAdmin
                                                            ? undefined
                                                            : () =>
                                                                  onDelete(user)
                                                    }
                                                    deleteDisabled={
                                                        isSuperAdmin
                                                    }
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td
                                colSpan={8}
                                style={{
                                    textAlign: "center",
                                    padding: "30px",
                                }}
                            >
                                No Users Found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default UserTable;
