import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { clearAuthSession } from "../utils/auth";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Work Orders",
    path: "/work-orders",
  },
  {
    label: "Equipment",
    path: "/equipment",
  },
  {
    label: "User Management",
    path: "/user-management",
  },
];

export default function DashboardLayout() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <aside className="app-sidebar" aria-label="Main navigation">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="sidebar-brand-link">
              CMMS
            </span>

            <p className="sidebar-brand-subtitle">
              MAINTENANCE MANAGEMENT
            </p>
          </div>

          <nav className="sidebar-menu">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-menu-item${isActive ? " active" : ""}`
                }
              >
                <span className="sidebar-bullet" aria-hidden="true">
                  •
                </span>

                <span className="sidebar-menu-label">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-profile-wrapper">
          <button
            type="button"
            className="sidebar-profile"
            onClick={() => setIsProfileOpen((prev) => !prev)}
          >
            <span className="profile-initial">ADM</span>

            <div className="profile-information">
              <strong>ADMIN</strong>
              <span>Engineering</span>
            </div>
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <span>ACCOUNT</span>
              </div>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                <span className="logout-icon" aria-hidden="true">
                  ↪
                </span>

                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}