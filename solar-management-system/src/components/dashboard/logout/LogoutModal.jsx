import "./LogoutModal.css";

function LogoutModal({ isOpen, onClose, onLogout }) {

    if (!isOpen) return null;

    return (

        <div className="logout-overlay">

            <div className="logout-modal">

                <h2>Logout</h2>

                <p>
                    Are you sure you want to logout from the Solar Management System?
                </p>

                <div className="logout-actions">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="logout-btn"
                        onClick={onLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>

    );

}

export default LogoutModal;