import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Section 1 - Autentification/01 - Login";
import MaintenanceDashboard from "./pages/Section 2 - Dashboard/01 - Main Dashboard";
import EquipmentList from "./pages/Section 3 - Equipment/01 - ListEquipment";
import EquipmentDetail from "./pages/Section 3 - Equipment/02 - DetailEquipment";
import WorkOrders from "./pages/Section 5 - Work Orders/01 - Maintenance Work Orders";
import OperatorWorkOrders from "./pages/Section 5 - Work Orders/02 - Operator Work Orders";
import OperatorChoice from "./pages/Section 5 - Work Orders/00 - Operator Choice";
import OperatorApproval from "./pages/Section 5 - Work Orders/03 - Operator Approval";
import UserManagement from "./pages/Section 4 - User Management/01 - User Management";

import DashboardLayout from "./component/DashboardLayout";
import OperatorLayout from "./component/OperatorLayout";
import RequireAdmin, { RequireRoleAccess } from "./component/RequireAdmin";
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
              path="/operator"
              element={<OperatorChoice />}
            />
            <Route path="/operator/request" element={<OperatorWorkOrders />} />
            <Route path="/operator/approve" element={<OperatorApproval />} />
          </Route>
        </Route>

        {/* Halaman admin dengan sidebar */}
        <Route element={<RequireAdmin />}>
          <Route element={<DashboardLayout />}>
            <Route element={<RequireRoleAccess permission="dashboard" />}>
              <Route path="/dashboard" element={<MaintenanceDashboard />} />
            </Route>
            <Route element={<RequireRoleAccess permission="equipment" />}>
              <Route path="/equipment" element={<EquipmentList />} />
              <Route path="/equipment/:equipmentId" element={<EquipmentDetail />} />
            </Route>
            <Route element={<RequireRoleAccess permission="work-orders" />}>
              <Route path="/work-orders" element={<WorkOrders />} />
            </Route>
            <Route element={<RequireRoleAccess permission="user-management" />}>
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