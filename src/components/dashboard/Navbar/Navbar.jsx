import {
    RiCloseLine,
    RiLogoutBoxRLine,
    RiMenuLine,
} from "react-icons/ri";

import { useNavigate } from "react-router-dom";

import useTheme from "../../../hooks/useTheme";
import useAuthentication from "../../../hooks/useAuth";

import authService from "../../../services/authService";

import "./Navbar.css";


const Navbar = ({ onMenuClick }) => {

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

            {/* ==================================================
                Left
            ================================================== */}

            <div className="navbar__left">

                <button
                    type="button"
                    className="navbar__menu-btn"
                    onClick={onMenuClick}
                    aria-label="Open navigation menu"
                    title="Menu"
                >

                    <RiMenuLine />

                </button>

            </div>


            {/* ==================================================
                Right
            ================================================== */}

            <div className="navbar__right">

                <button
                    type="button"
                    className="theme-btn"
                    onClick={toggleTheme}
                    title="Change Theme"
                    aria-label="Change Theme"
                >

                    {theme === "light"
                        ? "🌙"
                        : "☀️"
                    }

                </button>


                <button
                    type="button"
                    className="navbar__logout-btn"
                    onClick={handleLogout}
                    title="Logout"
                    aria-label="Logout"
                >

                    <RiLogoutBoxRLine />

                </button>

            </div>

        </header>

    );

};


export default Navbar;