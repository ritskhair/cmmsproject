import { Navigate, Outlet } from "react-router-dom";
import { canAccess, getAuthSession, type AppPermission } from "../utils/auth";

export function RequireRoleAccess({ permission }: { permission: AppPermission }) {
  const session = getAuthSession();

  if (!session || !session.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccess(session.role, permission)) {
    return <Navigate to={session.role === "operator" ? "/operator/work-orders" : "/work-orders"} replace />;
  }

  return <Outlet />;
}

export default function RequireAdmin() {
  const session = getAuthSession();

  if (!session || !session.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (session.role === "operator") {
    return <Navigate to="/work-orders" replace />;
  }

  return <Outlet />;
}