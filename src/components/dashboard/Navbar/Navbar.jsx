import { RiLogoutBoxRLine } from "react-icons/ri";

import { useNavigate } from "react-router-dom";

import useTheme from "../../../hooks/useTheme";
import useAuthentication from "../../../hooks/useAuth";

import authService from "../../../services/authService";

import "./Navbar.css";

const Navbar = () => {

    const { theme, toggleTheme } = useTheme();

    const { logout } = useAuthentication();

    const navigate = useNavigate();

    const handleLogout = async () => {

        try {

            await authService.logout();

        } catch (error) {

            console.log(error);

        }

        logout();

        navigate("/");

    };

    return (

        <header className="navbar">

            <div className="navbar__left"></div>

            <div className="navbar__right">

                {/* Theme */}

                <button
                    className="theme-btn"
                    onClick={toggleTheme}
                    title="Change Theme"
                >

                    {theme === "light" ? "🌙" : "☀️"}

                </button>

                {/* Logout */}

                <button
                    className="navbar__logout-btn"
                    onClick={handleLogout}
                    title="Logout"
                >

                    <RiLogoutBoxRLine />

                </button>

            </div>

        </header>

    );

};

export default Navbar;