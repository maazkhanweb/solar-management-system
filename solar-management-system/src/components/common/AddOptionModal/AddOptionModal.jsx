import { useEffect, useState } from "react";

import FormActions from "../FormActions";

import "./AddOptionModal.css";

function AddOptionModal({

    isOpen,

    title,

    label,

    onClose,

    onSave,

}) {

    const [value, setValue] = useState("");

    useEffect(() => {

        if (isOpen) {

            setValue("");

        }

    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!value.trim()) return;

        onSave(value.trim());

        setValue("");

    };

    return (

        <div className="modal-overlay">

            <div className="add-option-modal">

                <div className="modal-header">

                    <h2>{title}</h2>

                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <form
                    className="add-option-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>{label}</label>

                        <input
                            type="text"
                            value={value}
                            placeholder={`Enter ${label}`}
                            onChange={(e) =>
                                setValue(e.target.value)
                            }
                            autoFocus
                            required
                        />

                    </div>

                    <FormActions

                        saveText="Save"

                        cancelText="Cancel"

                        onCancel={onClose}

                    />

                </form>

            </div>

        </div>

    );

}

export default AddOptionModal;