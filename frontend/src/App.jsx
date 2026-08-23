import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppShell from './layout/AppShell.jsx';

// Public Pages
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Authenticated Pages
import Dashboard from './pages/Dashboard.jsx';
import InvestigateAccount from './pages/InvestigateAccount.jsx';
import NetworkGraph from './pages/NetworkGraph.jsx';
import DetectionPatterns from './pages/DetectionPatterns.jsx';
import RecentInvestigations from './pages/RecentInvestigations.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Authenticated Application Shell */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Dashboard />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/investigate"
            element={
              <ProtectedRoute>
                <AppShell>
                  <InvestigateAccount />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/investigate/:id"
            element={
              <ProtectedRoute>
                <AppShell>
                  <InvestigateAccount />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/graph"
            element={
              <ProtectedRoute>
                <AppShell>
                  <NetworkGraph />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/graph/:id"
            element={
              <ProtectedRoute>
                <AppShell>
                  <NetworkGraph />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patterns"
            element={
              <ProtectedRoute>
                <AppShell>
                  <DetectionPatterns />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/recent"
            element={
              <ProtectedRoute>
                <AppShell>
                  <RecentInvestigations />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Settings />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
