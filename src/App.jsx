// Main App Entry File
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ClubDataProvider } from './context/ClubDataContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Protected Route Shield
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Membership from './pages/Membership';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ManageMembers from './pages/admin/ManageMembers';
import ManageEvents from './pages/admin/ManageEvents';
import ManageGallery from './pages/admin/ManageGallery';
import ManageNews from './pages/admin/ManageNews';
import ManageTeam from './pages/admin/ManageTeam';
import ManageRequests from './pages/admin/ManageRequests';
import ProfileSettings from './pages/admin/ProfileSettings';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ClubDataProvider>
          <BrowserRouter>
            <Routes>
              
              {/* Public Website Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="services" element={<Services />} />
                <Route path="events" element={<Events />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="team" element={<Team />} />
                <Route path="membership" element={<Membership />} />
                <Route path="contact" element={<Contact />} />
                <Route path="admin/login" element={<AdminLogin />} />
              </Route>

              {/* Protected Admin Dashboard Panel */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                {/* Redirect /admin to /admin/dashboard */}
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="members" element={<ManageMembers />} />
                <Route path="events" element={<ManageEvents />} />
                <Route path="gallery" element={<ManageGallery />} />
                <Route path="news" element={<ManageNews />} />
                <Route path="team" element={<ManageTeam />} />
                <Route path="requests" element={<ManageRequests />} />
                <Route path="settings" element={<ProfileSettings />} />
              </Route>

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </BrowserRouter>
        </ClubDataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
