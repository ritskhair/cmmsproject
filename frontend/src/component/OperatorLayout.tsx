import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../utils/auth";

export default function OperatorLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
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