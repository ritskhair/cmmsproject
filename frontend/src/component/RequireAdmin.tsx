import { Navigate, Outlet } from "react-router-dom";
import { getAuthSession } from "../utils/auth";

export default function RequireAdmin() {
  const session = getAuthSession();

  if (!session || !session.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (session.role !== "admin" || session.backendRole === "operator") {
    return <Navigate to="/work-orders" replace />;
  }

  return <Outlet />;
}