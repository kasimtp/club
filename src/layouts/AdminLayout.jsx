// Admin Layout: Desktop Left Sidebar, Mobile Drawer, Live Sync Status, and Top Bar
import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiGrid, FiUsers, FiFileText, FiAward, FiSliders, 
  FiCalendar, FiImage, FiLogOut, FiHome, FiMenu, FiX, 
  FiShield 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useClubData } from '../context/ClubDataContext';
import Avatar from '../components/ui/Avatar';
import clubLogo from '../assets/club-logo.webp';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { requests } = useClubData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { name: 'Registered Users', path: '/admin/users', icon: FiUsers },
    { 
      name: 'Applications Queue', 
      path: '/admin/requests', 
      icon: FiFileText,
      badge: pendingCount > 0 ? pendingCount : null
    },
    { name: 'Members Directory', path: '/admin/members', icon: FiAward },
    { name: 'Hero Slider CMS', path: '/admin/slides', icon: FiSliders },
    { name: 'Programs CMS', path: '/admin/programs', icon: FiCalendar },
    { name: 'Gallery CMS', path: '/admin/gallery', icon: FiImage },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F8F9] flex flex-col md:flex-row text-slate-900 font-sans">
      
      {/* Mobile Admin Header */}
      <div className="md:hidden bg-slate-950 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center">
            <img src={clubLogo} alt="Club Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase text-amber-400 leading-tight">Admin Console</h2>
            <p className="text-[9px] text-slate-400">Universal Club Management</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          aria-label="Toggle admin navigation"
        >
          {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar (Desktop Fixed & Mobile Slide Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white flex flex-col justify-between border-r border-slate-900 transition-transform duration-300 md:static md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top Brand & Title */}
        <div className="p-6 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md">
              <img src={clubLogo} alt="Club Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tight text-white">Universal Club</h2>
              <span className="inline-block px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 font-extrabold text-[9px] uppercase tracking-wider">
                Admin Center
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
            Operations & CMS
          </div>

          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-base shrink-0" />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive ? 'bg-slate-950 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-slate-900 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <Avatar src={user?.profilePhoto} name={user?.name || 'Admin'} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@universalclub.com'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
            >
              <FiHome className="text-sm" /> Public Site
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-xs font-bold transition-all"
            >
              <FiLogOut className="text-sm" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Admin Bar on Desktop */}
        <div className="hidden md:flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Universal Club Administration
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight capitalize">
              {location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-time Live Sync</span>
            </div>

            <Link
              to="/"
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
            >
              View Public Website →
            </Link>
          </div>
        </div>

        {/* Dynamic Admin Page Route Outlet */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </div>

      </div>

    </div>
  );
}
