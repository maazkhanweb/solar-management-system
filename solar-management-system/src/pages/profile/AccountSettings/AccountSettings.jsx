import { useState } from "react";
import "./AccountSettings.css";

const AccountSettings = () => {

    const initialSettings = {
        theme: "Light",
        language: "English",
        timezone: "Asia/Karachi",
        dateFormat: "DD/MM/YYYY",
        emailNotification: true,
        systemNotification: true,
        smsNotification: false,
    };

    const [settings, setSettings] = useState(initialSettings);
    const [originalSettings, setOriginalSettings] = useState(initialSettings);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

    };

    const handleEdit = () => {

        setOriginalSettings(settings);
        setIsEditing(true);

    };

    const handleCancel = () => {

        setSettings(originalSettings);
        setIsEditing(false);

    };

    const handleSave = () => {

        alert(
            "Demo Mode\n\nSettings updated successfully.\n\nBackend integration will be added later."
        );

        setOriginalSettings(settings);
        setIsEditing(false);

    };

    return (

        <div className="account-settings-page">

            <div className="page-header">
                <h1>Account Settings</h1>
                <p>Manage your application preferences.</p>
            </div>

            {isEditing && (
                <div className="demo-banner">
                    <strong>Demo Mode:</strong> Settings are stored temporarily.
                    Backend integration will be added later.
                </div>
            )}

            <div className="settings-card">

                {/* Appearance */}

                <div className="settings-section">

                    <h3>Appearance</h3>

                    <div className="form-group">

                        <label>Theme</label>

                        <select
                            name="theme"
                            value={settings.theme}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option>Light</option>
                            <option>Dark</option>
                        </select>

                    </div>

                </div>

                {/* Language */}

                <div className="settings-section">

                    <h3>Language</h3>

                    <div className="form-group">

                        <label>Select Language</label>

                        <select
                            name="language"
                            value={settings.language}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option>English</option>
                            <option>Urdu</option>
                        </select>

                    </div>

                </div>

                {/* Time Zone */}

                <div className="settings-section">

                    <h3>Time Zone</h3>

                    <div className="form-group">

                        <label>Select Time Zone</label>

                        <select
                            name="timezone"
                            value={settings.timezone}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option>Asia/Karachi</option>
                            <option>Asia/Dubai</option>
                            <option>UTC</option>
                        </select>

                    </div>

                </div>

                {/* Date Format */}

                <div className="settings-section">

                    <h3>Date Format</h3>

                    <div className="form-group">

                        <label>Date Format</label>

                        <select
                            name="dateFormat"
                            value={settings.dateFormat}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option>DD/MM/YYYY</option>
                            <option>MM/DD/YYYY</option>
                            <option>YYYY-MM-DD</option>
                        </select>

                    </div>

                </div>

                {/* Notifications */}

                <div className="settings-section">

                    <h3>Notification Preferences</h3>

                    <div className="checkbox-group">

                        <label>

                            <input
                                type="checkbox"
                                name="emailNotification"
                                checked={settings.emailNotification}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />

                            Email Notifications

                        </label>

                        <label>

                            <input
                                type="checkbox"
                                name="systemNotification"
                                checked={settings.systemNotification}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />

                            System Notifications

                        </label>

                        <label>

                            <input
                                type="checkbox"
                                name="smsNotification"
                                checked={settings.smsNotification}
                                onChange={handleChange}
                                disabled
                            />

                            SMS Notifications (Coming Soon)

                        </label>

                    </div>

                </div>

                {/* Buttons */}

                <div className="settings-actions">

                    {!isEditing ? (

                        <button
                            className="btn-primary"
                            onClick={handleEdit}
                        >
                            Edit Settings
                        </button>

                    ) : (

                        <>

                            <button
                                className="btn-primary"
                                onClick={handleSave}
                            >
                                Save Settings
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

export default AccountSettings;