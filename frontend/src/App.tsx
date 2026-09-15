import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Section 1 - Autentification/01 - Login";
import MaintenanceDashboard from "./pages/Section 2 - Dashboard/01 - Main Dashboard";
import EquipmentList from "./pages/Section 3 - Equipment/01 - ListEquipment";
import EquipmentDetail from "./pages/Section 3 - Equipment/02 - DetailEquipment";
import WorkOrders from "./pages/Section 5 - Work Orders/01 - Maintenance Work Orders";
import OperatorWorkOrders from "./pages/Section 5 - Work Orders/02 - Operator Work Orders";
import UserManagement from "./pages/Section 4 - User Management/01 - User Management";

import DashboardLayout from "./component/DashboardLayout";
import OperatorLayout from "./component/OperatorLayout";
import RequireAdmin from "./component/RequireAdmin";
import RequireOperator from "./component/RequireOperator";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Halaman operator tanpa sidebar admin */}
        <Route element={<RequireOperator />}>
          <Route element={<OperatorLayout />}>
            <Route
              path="/operator/work-orders"
              element={<OperatorWorkOrders />}
            />
          </Route>
        </Route>

         {/* Halaman admin dengan sidebar */}
        <Route element={<RequireAdmin />}>
          <Route element={<RequireAdmin />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<MaintenanceDashboard />} />
            <Route path="/equipment" element={<EquipmentList />} />
            <Route path="/equipment/:equipmentId" element={<EquipmentDetail />} />
            <Route path="/work-orders" element={<WorkOrders />} />
            <Route path="/user-management" element={<UserManagement />} />
          </Route>
        </Route>
        </Route>

        {/* Route tidak ditemukan */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}