import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import { Layout } from "./components/Layout";
import { LoginView } from "./features/auth/LoginView";
// import { ComingSoon } from "./components/ComingSoon"; // Removed as per instruction

// Lazy loading or direct imports
// For now direct imports to keep it simple
import { DashboardView } from "./features/dashboard/DashboardView"; // We will create this next
import { VillagesList } from "./features/villages/VillagesList";
import { VillageProfile } from "./features/villages/VillageProfile";
import { WaterResourcesView } from "./features/water/WaterResourcesView";
import { LivestockView } from "./features/livestock/LivestockView";
import { NGOActivitiesView } from "./features/ngos/NGOActivitiesView";
import { AlertsView } from "./features/alerts/AlertsView";
import { ComingSoon } from "./components/ComingSoon"; // Re-added for other routes that still use it

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="drip-ui-theme">
      <AuthProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/login" element={<LoginView />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardView />} />
              {/* Village Routes */}
              <Route path="villages" element={<VillagesList />} />
              <Route path="villages/:id" element={<VillageProfile />} />
              <Route path="water" element={<WaterResourcesView />} />
              <Route path="livestock" element={<LivestockView />} />
              <Route path="ngos" element={<NGOActivitiesView />} />
              <Route path="coverage" element={<NGOActivitiesView />} />{" "}
              {/* Reusing for now */}
              <Route path="alerts" element={<AlertsView />} />
              <Route
                path="settings"
                element={<ComingSoon title="System Settings" />}
              />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
