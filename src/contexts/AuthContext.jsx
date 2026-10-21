
import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useMemo,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore the existing login session on app startup.
    useEffect(() => {
        try {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            const savedUser =
                localStorage.getItem("user") ||
                sessionStorage.getItem("user");

            if (token && savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error("Unable to restore login session:", error);

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    }, []);

    // Store the login session and update the authenticated user.
    const login = useCallback(
        (userData, token, rememberMe = true) => {
            const storage = rememberMe
                ? localStorage
                : sessionStorage;

            const otherStorage = rememberMe
                ? sessionStorage
                : localStorage;

            otherStorage.removeItem("token");
            otherStorage.removeItem("user");

            storage.setItem("token", token);
            storage.setItem("user", JSON.stringify(userData));

            setUser(userData);
        },
        []
    );

    // Clear the login session from both storage locations.
    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberedEmail");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setUser(null);
    }, []);

    const isAuthenticated = Boolean(user);

    // Keep the context value stable when its dependencies have not changed.
    const contextValue = useMemo(
        () => ({
            user,
            loading,
            isAuthenticated,
            login,
            logout,
        }),
        [user, loading, isAuthenticated, login, logout]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
