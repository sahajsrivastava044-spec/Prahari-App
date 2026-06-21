import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CommunityDashboard from "./pages/CommunityDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import ReportIncident from "./pages/Report";
import AlertsPage from "./pages/Alerts";
import ProtectedRoute from "./components/ProtectedRoute";
import RiskMapPage from "./pages/RiskMapPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/community-dashboard"
        element={
        <ProtectedRoute allowedRoles={["community"]}>
          <CommunityDashboard />
        </ProtectedRoute>
        }
      />

      <Route
        path="/officer-dashboard"
        element={
        <ProtectedRoute allowedRoles={["officer"]}>
          <OfficerDashboard />
        </ProtectedRoute>
        }
      />

      <Route
        path="/report"
        element={
        <ProtectedRoute allowedRoles={["community", "officer"]}>
          <ReportIncident />
        </ProtectedRoute>
        }
        />

      <Route
        path="/alerts"
        element={
          <ProtectedRoute allowedRoles={["community", "officer"]}>
            <AlertsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/risk-map" element={<RiskMapPage />} />
    </Routes>
  );
}

export default App;