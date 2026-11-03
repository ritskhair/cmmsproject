import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { canAccess, clearAuthSession, getAuthSession, type AppPermission, type UserRole } from "../utils/auth";
import EwoNotificationStack from "./EwoNotificationStack";

type SidebarIconName = "dashboard" | "work-orders" | "equipment" | "user-management";

function SidebarIcon({ name }: { name: SidebarIconName }) {
  const paths: Record<SidebarIconName, string> = {
    dashboard: "M4 13h6V4H4v9Zm10 7h6v-9h-6v9ZM4 20h6v-3H4v3Zm10-12h6V4h-6v4Z",
    "work-orders": "M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 5h8M8 12h8M8 16h5",
    equipment: "M4 7h16M6 4h12v16H6V4Zm3 7h6m-6 4h4",
    "user-management": "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 8a5 5 0 0 1 10 0M15 8h5m-5 4h5m-5 4h5",
  };

  return (
    <svg className="sidebar-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    permission: "dashboard" as AppPermission,
    icon: "dashboard" as SidebarIconName,
  },
  {
    label: "Work Orders",
    path: "/work-orders",
    permission: "work-orders" as AppPermission,
    icon: "work-orders" as SidebarIconName,
  },
  {
    label: "Equipment",
    path: "/equipment",
    permission: "equipment" as AppPermission,
    icon: "equipment" as SidebarIconName,
  },
  {
    label: "User Management",
    path: "/user-management",
    permission: "user-management" as AppPermission,
    icon: "user-management" as SidebarIconName,
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
            <img className="sidebar-brand-logo" src="/Logo SAMKO.jpeg" alt="SAMKO" />
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
                <SidebarIcon name={item.icon} />

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
      <EwoNotificationStack />
    </div>
  );
}