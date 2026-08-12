import { useEffect, useState } from "react";
import "./MasterSelect.css";

const AddMasterModal = ({
    isOpen,
    title,
    placeholder,
    onSave,
    onClose,
}) => {

    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {

        if (isOpen) {

            setValue("");
            setError("");

        }

    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {

        const text = value.trim();

        if (!text) {

            setError("This field is required.");

            return;

        }

        onSave(text);

    };

    return (

        <div className="ms-overlay">

            <div className="ms-modal">

                <div className="ms-header">

                    <h2>{title}</h2>

                </div>

                <div className="ms-body">

                    <label>

                        {placeholder}

                    </label>

                    <input
                        type="text"
                        value={value}
                        placeholder={placeholder}
                        onChange={(e) => {

                            setValue(e.target.value);

                            if (error) {

                                setError("");

                            }

                        }}
                    />

                    {error && (

                        <span className="ms-error">

                            {error}

                        </span>

                    )}

                </div>

                <div className="ms-footer">

                    <button
                        type="button"
                        className="ms-cancel-btn"
                        onClick={onClose}
                    >

                        Cancel

                    </button>

                    <button
                        type="button"
                        className="ms-save-btn"
                        onClick={handleSave}
                    >

                        Save

                    </button>

                </div>

            </div>

        </div>

    );

};

export default AddMasterModal;