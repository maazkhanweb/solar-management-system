/**
 * ============================================================================
 * File:
 * src/components/dashboard/user/UserTable.jsx
 *
 * Description:
 * User Table
 * ============================================================================
 */

import "./UserTable.css";
import ActionButtons from "../../common/ActionButtons/ActionButtons";

function UserTable({
    users,
    onEdit,
    onDelete,
}) {

    return (

        <div className="users-table-container">

            <table className="users-table">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>Name</th>

                        <th>Email</th>

                        <th>Area</th>

                        <th>Role</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        users.length > 0 ? (

                            users.map((user) => (

                                <tr key={user.id}>

                                    <td>

                                        {user.id}

                                    </td>

                                    <td>

                                        {user.name}

                                    </td>

                                    <td>

                                        {user.email}

                                    </td>

                                    <td>

                                        {

                                            user.area
                                                ? user.area.area_name
                                                : "All Areas"

                                        }

                                    </td>

                                    <td>

                                        {user.role}

                                    </td>

                                    <td>

                                        <span
                                            className={`status ${user.status.toLowerCase()}`}
                                        >

                                            {user.status}

                                        </span>

                                    </td>

                                    <td>

                                        <div className="table-actions">

                                            <ActionButtons
                                                onEdit={() => onEdit(user)}
                                                onDelete={() => onDelete(user)}
                                            />

                                        </div>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="7"
                                    style={{
                                        textAlign: "center",
                                        padding: "30px",
                                    }}
                                >

                                    No Users Found.

                                </td>

                            </tr>

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}

export default UserTable;