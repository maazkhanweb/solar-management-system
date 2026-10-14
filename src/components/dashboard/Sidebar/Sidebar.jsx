import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { RiSunFoggyLine, RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import menuData from "./menuData";
import "./Sidebar.css";
import useAuthentication from "../../../hooks/useAuth";
import authService from "../../../services/authService";

const Sidebar = ({ isOpen = false, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthentication();
  const [expanded, setExpanded] = useState({
    management: location.pathname !== "/dashboard" || location.pathname === "/inventory",
    comparisons: ["/bill-management", "/reports", "/comparison-ac-dc"].includes(location.pathname),
  });

  const handleLogout = async () => {
    try { await authService.logout(); } catch (error) { console.error(error); }
    logout();
    onClose?.();
    navigate("/");
  };

  const handleNavigation = () => onClose?.();

  return (
    <aside className={isOpen ? "sidebar sidebar--open" : "sidebar"}>
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon"><RiSunFoggyLine /></div>
        <div className="sidebar__logo-text"><h2>Solar Management</h2><span>by Maaz Khan</span></div>
      </div>

      <nav className="sidebar__navigation">
        {menuData.map((item) => {
          const Icon = item.icon;
          if (item.type === "group") {
            const expandedIcon = expanded[item.id] ? RiArrowDownSLine : RiArrowRightSLine;
            return (
              <div className="sidebar__group" key={item.id}>
                <button type="button" className="sidebar__link sidebar__group-toggle" aria-expanded={Boolean(expanded[item.id])} onClick={() => setExpanded((current) => ({ ...current, [item.id]: !current[item.id] }))}>
                  <Icon className="sidebar__icon" />
                  <span className="sidebar__text">{item.title}</span>
                  {(() => { const Arrow = expandedIcon; return <Arrow className="sidebar__group-arrow" />; })()}
                </button>
                {expanded[item.id] && (
                  <div className="sidebar__submenu">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <NavLink key={child.id} to={child.path} onClick={handleNavigation} className={({ isActive }) => `sidebar__link sidebar__sublink${isActive && (child.id !== "view-comparison" || location.search.includes("viewComparison=1")) ? " sidebar__link--active" : ""}`}>
                          <ChildIcon className="sidebar__icon" />
                          <span className="sidebar__text">{child.title}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          const ItemIcon = item.icon;
          return (
            <NavLink key={item.id} to={item.path} end onClick={handleNavigation} className={({ isActive }) => isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"}>
              <ItemIcon className="sidebar__icon" /><span className="sidebar__text">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar__footer"><p>Version 1.0.0</p><span>© Maaz Khan</span></div>
    </aside>
  );
};

export default Sidebar;
