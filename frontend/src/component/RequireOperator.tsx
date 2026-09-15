import { Navigate, Outlet } from "react-router-dom";
import { getAuthSession } from "../utils/auth";

export default function RequireOperator() {
  const session = getAuthSession();

  if (!session || !session.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (session.role !== "operator") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}