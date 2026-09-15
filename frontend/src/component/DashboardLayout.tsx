import { NavLink, Outlet, Link } from "react-router-dom";

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
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <Link to="/login" className="sidebar-brand-link">
              CMMS
            </Link>
            <p>MAINTENANCE MANAGEMENT</p>
          </div>

          <nav className="sidebar-menu">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-menu-item ${isActive ? "active" : ""}`
                }
              >
                <span className="sidebar-bullet">•</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-profile">
          <span className="profile-initial">SA</span>

          <div>
            <strong>Syamsabillah</strong>
            <span>Engineering</span>
          </div>
        </div>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}