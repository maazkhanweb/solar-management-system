import { useState } from "react";
import "./ChangePassword.css";

const ChangePassword = () => {

    const initialState = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    };

    const [passwords, setPasswords] = useState(initialState);

    const [isEditing, setIsEditing] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);

    const [showNew, setShowNew] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setPasswords((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleEdit = () => {

        setIsEditing(true);

    };

    const handleCancel = () => {

        setPasswords(initialState);

        setIsEditing(false);

    };

    const handleSave = () => {

        alert(
            "Demo Mode\n\nPassword changed successfully.\n\nBackend integration will be added later."
        );

        setPasswords(initialState);

        setIsEditing(false);

    };

    return (

        <div className="change-password-page">

            <div className="page-header">

                <h1>Change Password</h1>

                <p>Update your account password securely.</p>

            </div>

            {isEditing && (

                <div className="demo-banner">

                    <strong>Demo Mode:</strong> Password is not actually changed.
                    Backend integration will be added later.

                </div>

            )}

            <div className="password-card">

                <div className="form-group">

                    <label>Current Password</label>

                    <div className="password-input">

                        <input
                            type={showCurrent ? "text" : "password"}
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handleChange}
                            readOnly={!isEditing}
                        />

                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                        >
                            {showCurrent ? "Hide" : "Show"}
                        </button>

                    </div>

                </div>

                <div className="form-group">

                    <label>New Password</label>

                    <div className="password-input">

                        <input
                            type={showNew ? "text" : "password"}
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            readOnly={!isEditing}
                        />

                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                        >
                            {showNew ? "Hide" : "Show"}
                        </button>

                    </div>

                </div>

                <div className="form-group">

                    <label>Confirm Password</label>

                    <div className="password-input">

                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            readOnly={!isEditing}
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? "Hide" : "Show"}
                        </button>

                    </div>

                </div>

                <div className="password-strength">

                    <label>Password Strength</label>

                    <div className="strength-bar">

                        <div className="strength-fill"></div>

                    </div>

                    <span>Weak (Demo)</span>

                </div>

                <div className="settings-actions">

                    {!isEditing ? (

                        <button
                            className="btn-primary"
                            onClick={handleEdit}
                        >
                            Change Password
                        </button>

                    ) : (

                        <>

                            <button
                                className="btn-primary"
                                onClick={handleSave}
                            >
                                Save Password
                            </button>

                            <button
                                className="btn-secondary"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                        </>

                    )}

                </div>

            </div>

        </div>

    );

};

export default ChangePassword;