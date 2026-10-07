// Admin Layout ("Sense" soft-glass theme): glass sidebar, mobile drawer, and floating top bar
import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiGrid, FiUsers, FiFileText, FiAward, FiSliders,
  FiCalendar, FiImage, FiLogOut, FiHome, FiMenu, FiX, FiArrowUpRight, FiStar, FiFlag
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useClubData } from '../context/ClubDataContext';
import Avatar from '../components/ui/Avatar';
import clubLogo from '../assets/club-logo.webp';

const PAGE_TITLES = {
  dashboard: ['Overview', 'Dashboard'],
  users: ['People', 'Registered users'],
  requests: ['Membership', 'Applications'],
  members: ['Membership', 'Members directory'],
  slides: ['Website', 'Hero slides'],
  programs: ['Website', 'Programs'],
  gallery: ['Website', 'Gallery'],
  events: ['Website', 'Events'],
  news: ['Website', 'News'],
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { requests, loadError } = useClubData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const section = location.pathname.split('/')[2] || 'dashboard';
  const [eyebrow, pageTitle] = PAGE_TITLES[section] || ['Admin', section.replace('-', ' ')];

  const navGroups = [
    {
      label: 'General',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
        { name: 'Registered Users', path: '/admin/users', icon: FiUsers },
        { name: 'Applications', path: '/admin/requests', icon: FiFileText, badge: pendingCount > 0 ? pendingCount : null },
        { name: 'Members', path: '/admin/members', icon: FiAward },
      ],
    },
    {
      label: 'Website',
      items: [
        { name: 'Hero Slides', path: '/admin/slides', icon: FiSliders },
        { name: 'Events', path: '/admin/events', icon: FiFlag },
        { name: 'News', path: '/admin/news', icon: FiStar },
        { name: 'Programs', path: '/admin/programs', icon: FiCalendar },
        { name: 'Gallery', path: '/admin/gallery', icon: FiImage },
      ],
    },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="relative isolate min-h-screen flex text-ink font-sans">
      <div className="sense-canvas fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" />

      {/* Mobile drawer overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#2A292E]/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar: fixed drawer on mobile, sticky glass panel on desktop */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[280px] shrink-0 p-3 lg:p-4 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="glass h-full rounded-[32px] flex flex-col">
          {/* Brand */}
          <div className="p-5 pb-4 flex items-center justify-between gap-3">
            <Link to="/admin/dashboard" className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-full bg-white p-1.5 shrink-0 shadow-[0_8px_20px_-10px_rgba(242,104,58,0.6)]">
                <img src={clubLogo} alt="Club logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-bold leading-none text-ink">Universal</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle mt-1">Admin console</p>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden w-9 h-9 rounded-full bg-white text-ink-muted flex items-center justify-center"
              aria-label="Close navigation"
            >
              <FiX />
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-3 flex-1 overflow-y-auto custom-scrollbar space-y-5">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">{group.label}</p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between gap-3 h-12 px-4 rounded-full text-sm transition-all ${
                            isActive
                              ? 'bg-white text-ink font-bold shadow-[0_10px_22px_-14px_rgba(70,50,90,0.45)]'
                              : 'text-ink-muted font-medium hover:text-ink hover:bg-white/50'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span className="flex items-center gap-3 min-w-0">
                              <Icon className={`text-lg shrink-0 ${isActive ? 'text-ember' : ''}`} />
                              <span className="truncate">{item.name}</span>
                            </span>
                            {item.badge && (
                              <span className="min-w-6 h-6 px-1.5 rounded-full bg-ember text-white text-[11px] font-bold flex items-center justify-center">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Profile + actions */}
          <div className="p-3">
            <div className="rounded-[24px] bg-white/60 border border-white p-3 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar src={user?.profilePhoto} name={user?.name || 'Admin'} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-[11px] text-ink-subtle truncate">{user?.email || user?.username || 'Admin'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/"
                  className="h-9 rounded-full bg-white text-ink text-xs font-semibold flex items-center justify-center gap-1.5 hover:shadow-[0_6px_14px_-8px_rgba(70,50,90,0.4)] transition-all"
                >
                  <FiHome /> Site
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="h-9 rounded-full bg-white text-red-600 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-red-500 hover:text-white transition-all"
                >
                  <FiLogOut /> Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Floating top bar */}
        <header className="sticky top-0 z-30 px-3 sm:px-6 lg:pl-2 lg:pr-8 pt-3 lg:pt-4">
          <div className="glass rounded-full h-16 pl-2 sm:pl-6 pr-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden w-12 h-12 rounded-full bg-white text-ink flex items-center justify-center shrink-0"
                aria-label="Open navigation"
              >
                <FiMenu className="text-lg" />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle leading-none">{eyebrow}</p>
                <h1 className="font-display text-lg sm:text-xl font-semibold text-ink capitalize truncate leading-tight mt-1">{pageTitle}</h1>
              </div>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 h-12 pl-4 sm:pl-5 pr-1.5 rounded-full bg-white text-ink text-xs font-bold whitespace-nowrap shadow-[0_8px_20px_-12px_rgba(70,50,90,0.45)]"
            >
              <span className="hidden sm:inline">View website</span>
              <span className="sm:hidden">Site</span>
              <span className="w-9 h-9 rounded-full bg-ember text-white flex items-center justify-center">
                <FiArrowUpRight />
              </span>
            </Link>
          </div>
        </header>

        {/* Page outlet */}
        <main className="flex-1 px-3 sm:px-6 lg:pl-2 lg:pr-8 py-5 sm:py-6 overflow-x-hidden">
          {loadError && (
            <div role="alert" className="mb-5 rounded-[22px] bg-red-50 border border-red-100 px-5 py-4 text-sm text-red-700">
              <strong className="font-semibold">Couldn't load club data.</strong> {loadError}
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
