/**
 * ============================================================================
 * File:
 * src/components/dashboard/user/UserTable.jsx
 *
 * Description:
 * User Table with automatic serial numbering.
 * Displays Name, Email, Phone, Area, Role and Status.
 *
 * IMPORTANT:
 * The Super Admin (admin@solar.com) cannot be deleted.
 * The delete action is disabled for this protected account.
 * ============================================================================
 */

import "./UserTable.css";

import ActionButtons from "../../common/ActionButtons/ActionButtons";


/*
|--------------------------------------------------------------------------
| PROTECTED SUPER ADMIN EMAIL
|--------------------------------------------------------------------------
|
| This account must never be deleted from the system.
|
*/

const SUPER_ADMIN_EMAIL = "admin@solar.com";


function UserTable({

    users,

    onEdit,

    onDelete,

}) {

    return (

        <div className="users-table-container">

            <table className="users-table">

                {/* =========================================================
                    TABLE HEADER
                ========================================================= */}

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


                {/* =========================================================
                    TABLE BODY
                ========================================================= */}

                <tbody>

                    {

                        users.length > 0 ? (

                            users.map((user, index) => {

                                /*
                                |--------------------------------------------------------------------------
                                | CHECK PROTECTED SUPER ADMIN
                                |--------------------------------------------------------------------------
                                */

                                const isSuperAdmin =
                                    user.email?.toLowerCase() ===
                                    SUPER_ADMIN_EMAIL;


                                return (

                                    <tr key={user.id}>

                                        {/* SERIAL NUMBER */}

                                        <td>

                                            {index + 1}

                                        </td>


                                        {/* NAME */}

                                        <td>

                                            {user.name}

                                        </td>


                                        {/* EMAIL */}

                                        <td>

                                            {user.email}

                                        </td>


                                        {/* PHONE */}

                                        <td>

                                            {

                                                user.phone
                                                    ? user.phone
                                                    : "-"

                                            }

                                        </td>


                                        {/* AREA */}

                                        <td>

                                            {

                                                user.area
                                                    ? user.area.area_name
                                                    : "All Areas"

                                            }

                                        </td>


                                        {/* ROLE */}

                                        <td>

                                            {user.role}

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`
                                                    status
                                                    ${user.status.toLowerCase()}
                                                `}
                                            >

                                                {user.status}

                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="table-actions">

                                                <ActionButtons

                                                    /*
                                                    |--------------------------------------------------------------------------
                                                    | EDIT
                                                    |--------------------------------------------------------------------------
                                                    |
                                                    | Super Admin can still be edited.
                                                    |
                                                    */

                                                    onEdit={() =>
                                                        onEdit(user)
                                                    }


                                                    /*
                                                    |--------------------------------------------------------------------------
                                                    | DELETE
                                                    |--------------------------------------------------------------------------
                                                    |
                                                    | Super Admin cannot be deleted.
                                                    |
                                                    */

                                                    onDelete={
                                                        isSuperAdmin
                                                            ? undefined
                                                            : () =>
                                                                onDelete(user)
                                                    }

                                                    /*
                                                    |--------------------------------------------------------------------------
                                                    | DELETE DISABLED
                                                    |--------------------------------------------------------------------------
                                                    */

                                                    deleteDisabled={
                                                        isSuperAdmin
                                                    }

                                                />

                                            </div>

                                        </td>

                                    </tr>

                                );

                            })

                        ) : (

                            <tr>

                                <td
                                    colSpan="8"
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