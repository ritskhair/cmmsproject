import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { canAccess, clearAuthSession, getAuthSession, getUserInitials, type AppPermission, type UserRole } from "../utils/auth";
import EwoNotificationStack from "./EwoNotificationStack";

type SidebarIconName = "dashboard" | "work-orders" | "equipment" | "user-management" | "silo-monitoring";

function SidebarIcon({ name }: { name: SidebarIconName }) {
  const paths: Record<SidebarIconName, string> = {
    dashboard: "M4 13h6V4H4v9Zm10 7h6v-9h-6v9ZM4 20h6v-3H4v3Zm10-12h6V4h-6v4Z",
    "work-orders": "M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 5h8M8 12h8M8 16h5",
    equipment: "M4 7h16M6 4h12v16H6V4Zm3 7h6m-6 4h4",
    "user-management": "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 8a5 5 0 0 1 10 0M15 8h5m-5 4h5m-5 4h5",
    "silo-monitoring": "M4 19V9m5 10V5m5 14v-7m5 7V3M3 19h18",
  };

  return (
    <svg className="sidebar-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg className="profile-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`profile-chevron${open ? " open" : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="m7 10 5 5 5-5" />
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
  {
    label: "Silo Dependency",
    path: "/silo-monitoring",
    permission: "silo-monitoring" as AppPermission,
    icon: "silo-monitoring" as SidebarIconName,
  },
];

const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  general_manager: "General Manager",
  manager: "Manager",
  team_leader: "Team Leader",
  teknisi: "Teknisi",
  operator: "Operator",
};

export default function DashboardLayout() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const session = getAuthSession();
  const roleLabel = session?.role && roleLabels[session.role] ? roleLabels[session.role] : "USER";
  const accountName = session?.email?.trim() || "Pengguna";
  const accountInitial = getUserInitials(session);

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
    if (window.innerWidth <= 680) {
      mobileMenuButtonRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!isMobileSidebarOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.querySelector<HTMLAnchorElement>("#admin-sidebar .sidebar-menu-item")?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileSidebarOpen(false);
        mobileMenuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableItems = document.querySelectorAll<HTMLElement>(
        "#admin-sidebar a[href], #admin-sidebar button:not([disabled])"
      );
      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];
      const focusIsOutsideSidebar = !document.getElementById("admin-sidebar")?.contains(document.activeElement);

      if (event.shiftKey && (document.activeElement === firstItem || focusIsOutsideSidebar)) {
        event.preventDefault();
        lastItem?.focus();
      } else if (!event.shiftKey && (document.activeElement === lastItem || focusIsOutsideSidebar)) {
        event.preventDefault();
        firstItem?.focus();
      }
    };

    const closeOnDesktopResize = () => {
      if (window.innerWidth > 680) {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeOnDesktopResize);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeOnDesktopResize);
    };
  }, [isMobileSidebarOpen]);

  useEffect(() => {
    if (!isProfileOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <div className="app-layout">
      <button
        ref={mobileMenuButtonRef}
        type="button"
        className="mobile-menu-toggle"
        onClick={() => setIsMobileSidebarOpen((open) => !open)}
        aria-label={isMobileSidebarOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
        aria-expanded={isMobileSidebarOpen}
        aria-controls="admin-sidebar"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {isMobileSidebarOpen ? (
            <path d="m6 6 12 12M18 6 6 18" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isMobileSidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={closeMobileSidebar}
          aria-label="Tutup menu navigasi"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`app-sidebar${isMobileSidebarOpen ? " is-open" : ""}`}
        role={isMobileSidebarOpen ? "dialog" : undefined}
        aria-modal={isMobileSidebarOpen || undefined}
        aria-label="Main navigation"
      >
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
                onClick={closeMobileSidebar}
              >
                <SidebarIcon name={item.icon} />

                <span className="sidebar-menu-label">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-profile-wrapper" ref={profileRef}>
          <button
            type="button"
            className="sidebar-profile"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={isProfileOpen}
            aria-controls="sidebar-account-menu"
          >
            <span className="profile-initial" aria-hidden="true">{accountInitial}</span>

            <div className="profile-information">
              <strong>{accountName}</strong>
              <span className="profile-role">{roleLabel}</span>
              <span className="profile-status"><i aria-hidden="true" />Aktif</span>
            </div>
            <ChevronIcon open={isProfileOpen} />
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown" id="sidebar-account-menu" role="menu">
              <div className="profile-dropdown-header">
                <span className="profile-dropdown-icon"><ProfileIcon /></span>
                <div>
                  <strong>{accountName}</strong>
                  <span>Akun aktif</span>
                </div>
              </div>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
                role="menuitem"
              >
                <span className="logout-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />
                  </svg>
                </span>

                <span>Keluar dari aplikasi</span>
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