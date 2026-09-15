import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Section 1 - Autentification/01 - Login";
import MaintenanceDashboard from "./Section 2 - Dashboard/01 - Main Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={<MaintenanceDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;