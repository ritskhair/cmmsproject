import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { canAccess, clearAuthSession, getAuthSession, type AppPermission, type UserRole } from "../utils/auth";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    permission: "dashboard" as AppPermission,
  },
  {
    label: "Work Orders",
    path: "/work-orders",
    permission: "work-orders" as AppPermission,
  },
  {
    label: "Equipment",
    path: "/equipment",
    permission: "equipment" as AppPermission,
  },
  {
    label: "User Management",
    path: "/user-management",
    permission: "user-management" as AppPermission,
  },
];

const roleLabels: Record<UserRole, string> = {
  super_admin: "SUPER ADMIN",
  general_manager: "GENERAL MANAGER",
  manager: "MANAGER",
  team_leader: "TEAM LEADER",
  teknisi: "TEKNISI",
  operator: "OPERATOR",
};

export default function DashboardLayout() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const session = getAuthSession();
  const roleLabel = session?.role && roleLabels[session.role] ? roleLabels[session.role] : "USER";

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
            {menuItems.filter((item) => canAccess(session?.role, item.permission)).map((item) => (
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
            <span className="profile-initial">{roleLabel.slice(0, 3)}</span>

            <div className="profile-information">
              <strong>{roleLabel}</strong>
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