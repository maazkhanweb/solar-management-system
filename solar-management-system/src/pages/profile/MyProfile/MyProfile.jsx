import { useState } from "react";

import "./MyProfile.css";

import adminImage from "../../../assets/images/admin.jpg";

const initialProfile = {
    firstName: "Admin",
    lastName: "User",
    email: "admin@gmail.com",
    phone: "+92 312 3456789",
    role: "System Administrator",
    status: "Active",
};

const MyProfile = () => {

    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState(initialProfile);

    const [originalProfile, setOriginalProfile] = useState(initialProfile);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleEdit = () => {

        setOriginalProfile(profile);

        setIsEditing(true);

    };

    const handleCancel = () => {

        setProfile(originalProfile);

        setIsEditing(false);

    };

    const handleSave = () => {

        alert(
            "Demo Mode\n\nProfile updated successfully.\n\nBackend integration will be added later."
        );

        setOriginalProfile(profile);

        setIsEditing(false);

    };

    return (

        <div className="profile-page">

            <div className="profile-header">

                <h1>My Profile</h1>

                <p>Manage your personal information.</p>

            </div>

            {isEditing && (

                <div className="demo-banner">

                    <strong>Demo Mode:</strong> You can edit the profile UI,
                    but changes are not permanently saved until backend integration.

                </div>

            )}

            <div className="profile-card">

                <div className="profile-left">

                    <img
                        src={adminImage}
                        alt="Admin"
                        className="profile-image"
                    />

                    <button
                        className="change-photo-btn"
                        disabled={!isEditing}
                    >
                        Change Photo
                    </button>

                </div>

                <div className="profile-right">

                    <div className="profile-grid">

                        <div className="form-group">

                            <label>First Name</label>

                            <input
                                type="text"
                                name="firstName"
                                value={profile.firstName}
                                onChange={handleChange}
                                readOnly={!isEditing}
                            />

                        </div>

                        <div className="form-group">

                            <label>Last Name</label>

                            <input
                                type="text"
                                name="lastName"
                                value={profile.lastName}
                                onChange={handleChange}
                                readOnly={!isEditing}
                            />

                        </div>

                        <div className="form-group">

                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                readOnly={!isEditing}
                            />

                        </div>

                        <div className="form-group">

                            <label>Phone</label>

                            <input
                                type="text"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                readOnly={!isEditing}
                            />

                        </div>

                        <div className="form-group">

                            <label>Role</label>

                            <input
                                type="text"
                                name="role"
                                value={profile.role}
                                readOnly
                            />

                        </div>

                        <div className="form-group">

                            <label>Status</label>

                            <input
                                type="text"
                                name="status"
                                value={profile.status}
                                readOnly
                            />

                        </div>

                    </div>

                    <div className="profile-actions">

                        {!isEditing ? (

                            <button
                                className="btn-primary"
                                onClick={handleEdit}
                            >
                                Edit Profile
                            </button>

                        ) : (

                            <>
                                <button
                                    className="btn-primary"
                                    onClick={handleSave}
                                >
                                    Save Changes
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

        </div>

    );

};

export default MyProfile;