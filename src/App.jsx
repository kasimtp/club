// Main App Router & Entry Point
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

// Public & Member Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Events from './pages/Events';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Membership from './pages/Membership';
import MemberProfile from './pages/MemberProfile';
import Contact from './pages/Contact';
import MemberLogin from './pages/MemberLogin';
import AdminLogin from './pages/AdminLogin';

// Admin CMS & Management Pages
import Dashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRequests from './pages/admin/AdminRequests';
import AdminMembers from './pages/admin/AdminMembers';
import AdminSlides from './pages/admin/AdminSlides';
import AdminPrograms from './pages/admin/AdminPrograms';
import AdminGallery from './pages/admin/AdminGallery';
import AdminContent from './pages/admin/AdminContent';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ClubDataProvider>
          <BrowserRouter>
            <Routes>
              
              {/* Public & Member Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="services" element={<Services />} />
                <Route path="events" element={<Events />} />
                <Route path="programs" element={<Programs />} />
                <Route path="programs/:id" element={<ProgramDetail />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="team" element={<Team />} />
                <Route path="membership" element={<Membership />} />
                <Route path="profile" element={<MemberProfile />} />
                <Route path="contact" element={<Contact />} />
                <Route path="login" element={<MemberLogin />} />
                <Route path="admin/login" element={<AdminLogin />} />
              </Route>

              {/* Protected Administrator Console */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="requests" element={<AdminRequests />} />
                <Route path="members" element={<AdminMembers />} />
                <Route path="slides" element={<AdminSlides />} />
                <Route path="programs" element={<AdminPrograms />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="events" element={<AdminContent key="events" kind="events" />} />
                <Route path="news" element={<AdminContent key="news" kind="news" />} />
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
