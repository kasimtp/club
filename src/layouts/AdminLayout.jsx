// Admin Dashboard Layout: Collapsible Sidebar, Header and Main content area
import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  FiTrendingUp, FiUsers, FiCalendar, FiImage, FiBookOpen, 
  FiLayers, FiFileText, FiSettings, FiLogOut, FiHome, FiMenu, FiX 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: FiTrendingUp },
    { name: 'Manage Members', path: '/admin/members', icon: FiUsers },
    { name: 'Manage Events', path: '/admin/events', icon: FiCalendar },
    { name: 'Manage Gallery', path: '/admin/gallery', icon: FiImage },
    { name: 'Manage News', path: '/admin/news', icon: FiBookOpen },
    { name: 'Manage Team', path: '/admin/team', icon: FiLayers },
    { name: 'Membership Requests', path: '/admin/requests', icon: FiFileText },
    { name: 'Profile Settings', path: '/admin/settings', icon: FiSettings }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('universal_club_jwt_token'); // Explicitly force token deletion
      showToast('Logged out of admin panel successfully', 'info');
      navigate('/admin/login');
    } catch (err) {
      localStorage.removeItem('universal_club_jwt_token'); // Force clean even on error
      showToast('Session cleared', 'info');
      navigate('/admin/login');
    }
  };

  return (
    <div className="flex h-screen bg-dark-bg text-gray-100 overflow-hidden">
      
      {/* Backdrops for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 glass border-r border-gray-800/80 flex flex-col justify-between transform transition-transform duration-300 lg:static lg:transform-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800/80 flex items-center justify-between shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <FiHome className="text-white text-sm" />
            </div>
            <span className="text-lg font-extrabold text-white uppercase tracking-wider">
              Universal<span className="text-primary font-normal">Panel</span>
            </span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg lg:hidden"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              end={item.path === '/admin/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10 border border-primary/20 shadow-xs shadow-emerald-500/5'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent'
                }`
              }
            >
              <item.icon className="text-lg shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer (Profile + Logout) */}
        <div className="p-4 border-t border-gray-800/80 shrink-0">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-800/50 mb-3">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80' } 
                alt="Admin avatar" 
                className="w-9 h-9 rounded-full object-cover border border-gray-700"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20"
          >
            <FiLogOut className="text-lg shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Dashboard Top Header */}
        <header className="h-16 border-b border-gray-850/80 flex items-center justify-between px-6 shrink-0 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white border border-gray-800 rounded-lg"
              aria-label="Open sidebar"
            >
              <FiMenu className="text-xl" />
            </button>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {/* Dynamic Header based on active path */}
              Admin Workspace
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-gray-800 hover:border-gray-700 text-xs font-semibold text-gray-400 hover:text-white rounded-lg transition-all"
            >
              <FiHome />
              View Site
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-900/40 hover:border-red-500 bg-red-500/10 hover:bg-red-500 text-xs font-bold text-red-400 hover:text-white rounded-lg transition-all cursor-pointer"
              title="Logout and delete auth session"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
            <div className="h-4 w-[1px] bg-gray-800 hidden sm:block"></div>
            <span className="hidden sm:inline-block text-xs font-semibold text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
              Admin Mode
            </span>
          </div>
        </header>

        {/* Viewport Outlet */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950 custom-scrollbar">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
