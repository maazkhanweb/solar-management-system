import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // Restore Login
    // ==========================================

    useEffect(() => {

        const token =
            localStorage.getItem("token") ||
            sessionStorage.getItem("token");

        const savedUser =
            localStorage.getItem("user") ||
            sessionStorage.getItem("user");

        if (token && savedUser) {

            setUser(JSON.parse(savedUser));

        }

        setLoading(false);

    }, []);

    // ==========================================
    // Login
    // ==========================================

    const login = (userData, token, rememberMe) => {

        if (rememberMe) {

            // Save permanently
            localStorage.setItem("token", token);

            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );

            // Clear session
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

        } else {

            // Save only for current browser session
            sessionStorage.setItem("token", token);

            sessionStorage.setItem(
                "user",
                JSON.stringify(userData)
            );

            // Clear local
            localStorage.removeItem("token");
            localStorage.removeItem("user");

        }

        setUser(userData);

    };

    // ==========================================
    // Logout
    // ==========================================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberedEmail");

        setUser(null);

    };

    // ==========================================
    // Helpers
    // ==========================================

    const isAuthenticated = !!user;

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;