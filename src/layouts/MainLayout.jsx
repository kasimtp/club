// Public Layout: Floating glass header, docked bottom tabs, and glass footer ("Sense" soft-glass theme)
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiAward, FiUser, FiLogOut, FiShield,
  FiPhone, FiMail, FiMapPin, FiChevronDown, FiArrowUpRight, FiInstagram, FiFacebook,
  FiMenu, FiX, FiHome, FiCalendar, FiImage, FiStar, FiInfo, FiFlag, FiUsers, FiMessageCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useClubData } from '../context/ClubDataContext';
import Avatar from '../components/ui/Avatar';
import BottomTabBar from '../components/ui/BottomTabBar';
import clubLogo from '../assets/club-logo.webp';

export default function MainLayout() {
  const { user, isAdmin, isMember, logout } = useAuth();
  const { clubInfo } = useClubData();
  // Only one header menu is open at a time: 'profile' | 'more' | 'menu' | null
  const [openMenu, setOpenMenu] = useState(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) setOpenMenu(null);
    };
    const handleEscape = (e) => { if (e.key === 'Escape') setOpenMenu(null); };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Main pages in the bar; the rest live under "More" (desktop) or "Menu" (tablet / phone)
  const primaryLinks = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Events', path: '/events', icon: FiCalendar },
    { name: 'Gallery', path: '/gallery', icon: FiImage },
    { name: 'What We Do', path: '/services', icon: FiStar },
    { name: 'About', path: '/about', icon: FiInfo },
  ];
  const moreLinks = [
    { name: 'Programs', path: '/programs', icon: FiFlag, hint: 'Tournaments & upcoming programmes' },
    { name: 'Membership', path: '/membership', icon: FiAward, hint: `Join the club · ${clubInfo.membershipFee}` },
    { name: 'Committee', path: '/team', icon: FiUsers, hint: 'The people who run the club' },
    { name: 'Contact', path: '/contact', icon: FiMessageCircle, hint: 'Instagram, Facebook & clubhouse' },
  ];

  const toggleMenu = (name) => setOpenMenu((current) => (current === name ? null : name));
  const closeDropdown = () => setOpenMenu(null);
  const profileDropdownOpen = openMenu === 'profile';

  const menuLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-colors ${
      isActive ? 'bg-white text-ink' : 'text-ink hover:bg-white/70'
    }`;

  return (
    <div className="relative isolate flex flex-col min-h-screen text-ink font-sans selection:bg-ember-soft selection:text-ink">

      {/* Fixed soft-gradient canvas behind every public page */}
      <div className="sense-canvas fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" />

      {/* Top Announcement Ribbon */}
      <div className="hidden sm:flex items-center justify-center gap-2 pt-3 px-4 text-xs text-ink-muted font-medium">
        <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
        <span>Join Universal Vellur · Membership {clubInfo.membershipFee}</span>
        <Link to="/membership" className="font-bold text-ink hover:text-ember transition-colors ml-1">
          Apply now →
        </Link>
      </div>

      {/* Floating Glass Header */}
      <header ref={headerRef} className="sticky top-0 z-40 px-3 sm:px-6 lg:px-8 pt-3">
        <div className="glass max-w-[76rem] mx-auto rounded-full pl-2 pr-2 sm:pr-3">
          <div className="flex items-center justify-between h-16 gap-3">

            {/* Left: Brand Crest & Title */}
            <Link to="/" className="flex items-center gap-3 group shrink-0 min-w-0">
              <div className="w-12 h-12 rounded-full bg-white p-1.5 flex items-center justify-center shadow-[0_8px_20px_-10px_rgba(242,104,58,0.6)] group-hover:scale-105 transition-transform overflow-hidden">
                <img src={clubLogo} alt="Universal Club Crest" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <span className="block font-display text-xl font-bold tracking-tight text-ink leading-none">
                  Universal
                </span>
                <p className="text-[10px] font-semibold text-ink-subtle uppercase tracking-[0.14em] leading-none mt-1">
                  Arts & Sports · Vellur
                </p>
              </div>
            </Link>

            {/* Center: main pages + "More" (desktop) */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `pill !h-9 !px-4 !text-xs ${isActive ? 'pill-active' : '!border-transparent !bg-transparent hover:!bg-white/50'}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu('more')}
                  aria-expanded={openMenu === 'more'}
                  aria-haspopup="true"
                  className={`pill !h-9 !px-4 !text-xs ${openMenu === 'more' ? 'pill-active' : '!border-transparent !bg-transparent hover:!bg-white/50'}`}
                >
                  More
                  <FiChevronDown className={`transition-transform ${openMenu === 'more' ? 'rotate-180' : ''}`} />
                </button>

                {openMenu === 'more' && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-80 rounded-[26px] bg-[#F7F6F8] border-[1.5px] border-white shadow-[0_24px_48px_-20px_rgba(70,50,90,0.4)] p-2 animate-scale-in">
                    {moreLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <NavLink key={link.name} to={link.path} onClick={closeDropdown} className={menuLinkClass}>
                          <span className="w-9 h-9 rounded-full bg-white text-ember flex items-center justify-center shrink-0">
                            <Icon />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold">{link.name}</span>
                            <span className="block text-[11px] text-ink-muted truncate">{link.hint}</span>
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Right: Actions / Auth Profile */}
            <div className="flex items-center gap-2">

              {user ? (
                /* Authenticated User Menu */
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleMenu('profile')}
                    aria-expanded={profileDropdownOpen}
                    className="flex items-center gap-2 p-1 pl-3 rounded-full bg-white/80 hover:bg-white transition-all border border-white"
                    aria-label="User profile menu"
                  >
                    <span className="text-xs font-bold text-ink max-w-[100px] truncate hidden sm:inline-block">
                      {isAdmin ? 'Admin' : user.name?.split(' ')[0] || 'Member'}
                    </span>
                    <Avatar src={user.profilePhoto || user.photoURL} name={user.name} size="sm" />
                    <FiChevronDown className="text-xs text-ink-subtle mr-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="glass-strong absolute right-0 mt-3 w-64 rounded-3xl p-2 z-50 animate-scale-in">
                      <div className="px-3 py-2.5 border-b border-black/5 mb-1">
                        <p className="text-xs font-bold text-ink truncate">{user.name}</p>
                        <p className="text-[11px] text-ink-muted truncate">{user.email}</p>
                        <div className="mt-1.5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isMember ? 'bg-emerald-100 text-emerald-800' : 'bg-ember-soft text-ember'
                          }`}>
                            {isMember ? `Member (${user.membershipId || 'Active'})` : 'Registered User'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <Link
                          to="/membership"
                          onClick={closeDropdown}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-semibold text-ink hover:bg-black/5 transition-colors"
                        >
                          <FiAward className="text-ember" />
                          <span>My Digital ID Card</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={closeDropdown}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-semibold text-ink hover:bg-black/5 transition-colors"
                        >
                          <FiUser className="text-ink-muted" />
                          <span>My Profile & Settings</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={closeDropdown}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-semibold text-ink hover:bg-black/5 transition-colors"
                          >
                            <FiShield className="text-ink-muted" />
                            <span>Admin Portal</span>
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            closeDropdown();
                            logout();
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Unauthenticated Guest Actions */
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex items-center h-10 px-4 rounded-full whitespace-nowrap text-xs font-semibold text-ink-muted hover:text-ink hover:bg-white/60 transition-colors"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/membership"
                    className="hidden sm:inline-flex items-center gap-1.5 h-11 pl-5 pr-1.5 rounded-full whitespace-nowrap bg-white text-ink text-xs font-bold shadow-[0_8px_20px_-12px_rgba(70,50,90,0.45)] hover:shadow-[0_10px_24px_-10px_rgba(242,104,58,0.5)] transition-all"
                  >
                    Join · ₹200
                    <span className="w-8 h-8 rounded-full bg-ember text-white flex items-center justify-center">
                      <FiArrowUpRight className="text-sm" />
                    </span>
                  </Link>
                </div>
              )}

              {/* Tablet / phone: every page in one menu */}
              <button
                type="button"
                onClick={() => toggleMenu('menu')}
                aria-expanded={openMenu === 'menu'}
                aria-label={openMenu === 'menu' ? 'Close menu' : 'Open menu'}
                className="lg:hidden w-11 h-11 rounded-full bg-white text-ink flex items-center justify-center shrink-0 shadow-[0_8px_20px_-12px_rgba(70,50,90,0.45)]"
              >
                {openMenu === 'menu' ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
              </button>
            </div>

          </div>
        </div>

        {openMenu === 'menu' && (
          <nav
            aria-label="All pages"
            className="lg:hidden absolute left-3 right-3 sm:left-6 sm:right-6 mt-3 rounded-[28px] bg-[#F7F6F8] border-[1.5px] border-white shadow-[0_30px_60px_-24px_rgba(70,50,90,0.45)] p-3 animate-scale-in max-h-[calc(100dvh-190px)] overflow-y-auto"
          >
            <p className="px-3 pt-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">Pages</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {[...primaryLinks, ...moreLinks].map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink key={link.name} to={link.path} end={link.path === '/'} onClick={closeDropdown} className={menuLinkClass}>
                    <span className="w-9 h-9 rounded-full bg-white text-ember flex items-center justify-center shrink-0">
                      <Icon />
                    </span>
                    <span className="text-sm font-semibold">{link.name}</span>
                  </NavLink>
                );
              })}
            </div>
            {!user && (
              <Link
                to="/login"
                onClick={closeDropdown}
                className="mt-2 flex items-center justify-center h-11 rounded-full bg-white text-sm font-semibold text-ink"
              >
                Sign in
              </Link>
            )}
          </nav>
        )}
      </header>

      {/* Main Page Body */}
      <main className="flex-1 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile Docked Bottom Tab Navigation */}
      <BottomTabBar />

      {/* Glass Footer */}
      <footer className="hidden sm:block px-4 sm:px-6 lg:px-8 pb-8">
        <div className="glass max-w-[76rem] mx-auto rounded-[36px] p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

            {/* Col 1 & 2: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white p-1.5 flex items-center justify-center">
                  <img src={clubLogo} alt="Universal Club Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-ink">Universal Vellur</h3>
                  <p className="text-[10px] text-ink-subtle uppercase font-semibold tracking-[0.14em]">Arts & Sports Club</p>
                </div>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed max-w-sm">
                {clubInfo.tagline}
              </p>
              <div className="pt-2 text-xs text-ink-muted space-y-2">
                <div className="flex items-center gap-2.5">
                  <FiMapPin className="text-ember shrink-0" />
                  <span>{clubInfo.address}</span>
                </div>
                {clubInfo.phone && (
                  <div className="flex items-center gap-2.5">
                    <FiPhone className="text-ember shrink-0" />
                    <span>{clubInfo.phone}</span>
                  </div>
                )}
                {clubInfo.email && (
                  <div className="flex items-center gap-2.5">
                    <FiMail className="text-ember shrink-0" />
                    <span>{clubInfo.email}</span>
                  </div>
                )}
                <a href={clubInfo.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-ink transition-colors">
                  <FiInstagram className="text-ember shrink-0" />
                  <span>{clubInfo.socials.instagramHandle}</span>
                </a>
                <a href={clubInfo.socials.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-ink transition-colors">
                  <FiFacebook className="text-ember shrink-0" />
                  <span>Universal Arts &amp; Sports Club Vellur</span>
                </a>
              </div>
            </div>

            {/* Col 3: Quick Navigation */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle mb-4">Explore</h4>
              <ul className="space-y-2.5 text-sm text-ink font-medium">
                <li><Link to="/" className="hover:text-ember transition-colors">Home</Link></li>
                <li><Link to="/events" className="hover:text-ember transition-colors">Calendar & Events</Link></li>
                <li><Link to="/programs" className="hover:text-ember transition-colors">Upcoming Programs</Link></li>
                <li><Link to="/gallery" className="hover:text-ember transition-colors">Photo Gallery</Link></li>
                <li><Link to="/membership" className="hover:text-ember transition-colors">Membership</Link></li>
              </ul>
            </div>

            {/* Col 4: Club Exploration */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle mb-4">About</h4>
              <ul className="space-y-2.5 text-sm text-ink font-medium">
                <li><Link to="/about" className="hover:text-ember transition-colors">About the Club</Link></li>
                <li><Link to="/services" className="hover:text-ember transition-colors">What We Do</Link></li>
                <li><Link to="/team" className="hover:text-ember transition-colors">Committee</Link></li>
                <li><Link to="/contact" className="hover:text-ember transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Col 5: Member & Admin Access */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle mb-4">Portals</h4>
              <ul className="space-y-2.5 text-sm text-ink font-medium">
                <li><Link to="/login" className="hover:text-ember transition-colors">Member Sign In</Link></li>
                <li><Link to="/admin/login" className="hover:text-ember transition-colors">Admin Login</Link></li>
                {isAdmin && <li><Link to="/admin/dashboard" className="text-ember hover:underline">Admin Dashboard</Link></li>}
              </ul>
              <div className="mt-6 p-3.5 rounded-2xl bg-white/70 border border-white">
                <span className="text-[10px] text-ink-subtle block uppercase font-semibold tracking-wider">Annual Membership</span>
                <span className="font-display text-lg font-bold text-ink">₹200 / year</span>
              </div>
            </div>

          </div>

          <div className="mt-10 pt-6 border-t border-black/5 text-xs text-ink-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} {clubInfo.name}. All rights reserved.</p>
            {clubInfo.affiliation && <p className="text-[11px]">{clubInfo.affiliation}</p>}
          </div>
        </div>
      </footer>

    </div>
  );
}
