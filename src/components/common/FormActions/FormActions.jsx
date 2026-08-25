import "./FormActions.css";

const FormActions = ({
    saveText = "Save",
    cancelText = "Cancel",
    saveType = "submit",
    saveVariant = "primary",
    onCancel,
    onSave,
}) => {

    return (

        <div className="form-actions">

            <button
                type="button"
                className="form-btn form-btn-cancel"
                onClick={onCancel}
            >
                {cancelText}
            </button>

            <button
                type={saveType}
                className={`form-btn form-btn-${saveVariant}`}
                onClick={onSave}
            >
                {saveText}
            </button>

        </div>

    );

};

export default FormActions;