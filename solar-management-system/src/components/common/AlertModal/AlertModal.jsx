/**
 * ============================================================================
 * File:
 * src/components/common/AlertModal/AlertModal.jsx
 *
 * Description:
 * Custom application alert popup for success and error messages.
 * ============================================================================
 */

import "./AlertModal.css";


function AlertModal({

    isOpen,

    message,

    type = "success",

    onClose,

}) {

    if (!isOpen) {

        return null;

    }


    return (

        <div className="alert-modal-overlay">

            <div className="alert-modal">

                <div className="alert-modal-content">

                    <div
                        className={`alert-icon ${type}`}
                    >

                        {

                            type === "success"

                                ? "✓"

                                : "!"

                        }

                    </div>


                    <h3>

                        {

                            type === "success"

                                ? "Success"

                                : "Error"

                        }

                    </h3>


                    <p>

                        {message}

                    </p>

                </div>


                <div className="alert-modal-footer">

                    <button
                        type="button"
                        className={`alert-ok-btn ${type}`}
                        onClick={onClose}
                    >

                        OK

                    </button>

                </div>

            </div>

        </div>

    );

}


export default AlertModal;