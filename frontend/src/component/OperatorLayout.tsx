import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../utils/auth";
import { apiRequest } from "../utils/api";

export default function OperatorLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest<void>("/auth/logout", { method: "POST" });
    } finally {
      clearAuthSession();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="operator-layout">
      <header className="operator-header">
        <Link to="/login" className="operator-brand">
          CMMS
        </Link>

        <div className="operator-user-area">
          <span className="operator-label">Operator Mode</span>

          <button
            type="button"
            className="operator-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="operator-main">
        <Outlet />
      </main>
    </div>
  );
}