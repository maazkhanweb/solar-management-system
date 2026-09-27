import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {

    const {

        isAuthenticated,

        loading,

    } = useAuth();

    // Wait until authentication is restored
    if (loading) {

        return (

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    fontSize: "20px",
                    fontWeight: "600",
                }}
            >
                Loading...
            </div>

        );

    }

    // User is not authenticated
    if (!isAuthenticated) {

        return <Navigate to="/" replace />;

    }

    // User is authenticated
    return children;

};

export default ProtectedRoute;