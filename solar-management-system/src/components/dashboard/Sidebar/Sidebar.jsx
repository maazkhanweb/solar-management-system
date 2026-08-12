import { NavLink, useNavigate } from "react-router-dom";
import { RiSunFoggyLine } from "react-icons/ri";

import menuData from "./menuData";
import "./Sidebar.css";

import useAuthentication from "../../../hooks/useAuth";
import authService from "../../../services/authService";

const Sidebar = () => {

    const navigate = useNavigate();

    const { logout } = useAuthentication();

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

        <aside className="sidebar">

            {/* Logo */}
            <div className="sidebar__logo">

                <div className="sidebar__logo-icon">
                    <RiSunFoggyLine />
                </div>

                <div className="sidebar__logo-text">
                    <h2>Solar Management</h2>
                    <span>by Maaz Khan</span>
                </div>

            </div>

            {/* Navigation */}
            <nav className="sidebar__navigation">

                {menuData.map((item) => {

                    const Icon = item.icon;

                    // Logout Item
                    if (item.title === "Logout") {

                        return (

                            <button
                                key={item.id}
                                type="button"
                                className="sidebar__link"
                                onClick={handleLogout}
                            >

                                <Icon className="sidebar__icon" />

                                <span className="sidebar__text">
                                    {item.title}
                                </span>

                            </button>

                        );

                    }

                    // Normal Navigation
                    return (

                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar__link sidebar__link--active"
                                    : "sidebar__link"
                            }
                        >

                            <Icon className="sidebar__icon" />

                            <span className="sidebar__text">
                                {item.title}
                            </span>

                        </NavLink>

                    );

                })}

            </nav>

            {/* Footer */}
            <div className="sidebar__footer">

                <p>Version 1.0.0</p>

                <span>© Maaz Khan</span>

            </div>

        </aside>

    );

};

export default Sidebar;