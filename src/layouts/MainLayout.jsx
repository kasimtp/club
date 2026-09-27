// Public Layout: Responsive Navbar, Mobile Top Header, Docked Bottom Tabs, and Footer
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  FiAward, FiUser, FiLogOut, FiShield, 
  FiPhone, FiMail, FiMapPin, FiChevronDown
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useClubData } from '../context/ClubDataContext';
import Avatar from '../components/ui/Avatar';
import BottomTabBar from '../components/ui/BottomTabBar';
import clubLogo from '../assets/club-logo.webp';

export default function MainLayout() {
  const { user, isAdmin, isMember, logout } = useAuth();
  const { clubInfo } = useClubData();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Programs', path: '/programs' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Membership', path: '/membership' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
  ];

  const closeDropdown = () => setProfileDropdownOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8F9] text-slate-900 font-sans selection:bg-amber-300 selection:text-slate-950">
      
      {/* Top Announcement Ribbon */}
      <div className="bg-black text-white text-xs py-2 px-4 text-center font-medium hidden sm:flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>Universal Sports & Arts Club Membership 2026-2027 is now open • Annual fee only ₹200</span>
        <Link to="/membership" className="font-bold underline hover:text-amber-400 ml-1">
          Apply Now →
        </Link>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Brand Crest & Title */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-md shadow-black/5 group-hover:scale-105 transition-transform overflow-hidden">
                <img src={clubLogo} alt="Universal Club Crest" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-950 uppercase">
                    Universal<span className="text-amber-500">Club</span>
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  Arts & Sports • Kerala
                </p>
              </div>
            </Link>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-3.5 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-black text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right: Actions / Auth Profile */}
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-400/20 border border-amber-400/50 text-slate-950 text-xs font-extrabold hover:bg-amber-400/30 transition-all shadow-xs"
                >
                  <FiShield className="text-sm text-amber-600" />
                  <span>Admin Panel</span>
                </Link>
              )}

              {user ? (
                /* Authenticated User Menu */
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200"
                    aria-label="User profile menu"
                  >
                    <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate hidden sm:inline-block">
                      {user.name?.split(' ')[0] || 'Member'}
                    </span>
                    <Avatar src={user.profilePhoto || user.photoURL} name={user.name} size="sm" />
                    <FiChevronDown className="text-xs text-slate-500 mr-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-scale-in">
                      <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <div className="mt-1.5">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            isMember ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isMember ? `Member (${user.membershipId || 'Active'})` : 'Registered User'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <Link
                          to="/membership"
                          onClick={closeDropdown}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <FiAward className="text-amber-500" />
                          <span>My Digital ID Card</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={closeDropdown}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <FiUser className="text-sky-500" />
                          <span>My Profile & Settings</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={closeDropdown}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-amber-50 text-amber-900 transition-colors"
                          >
                            <FiShield className="text-amber-600" />
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
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
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
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-950 transition-colors"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/membership"
                    className="px-5 py-2.5 rounded-full bg-black hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm transition-all"
                  >
                    Join Club (₹200)
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1 pb-20 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile Docked Bottom Tab Navigation */}
      <BottomTabBar />

      {/* Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-900 pt-16 pb-24 md:pb-16 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            
            {/* Col 1 & 2: Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center">
                  <img src={clubLogo} alt="Universal Club Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight text-white uppercase">Universal Club</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Arts & Sports Association</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                A community sanctuary dedicated to athletic development, fitness excellence, and socio-cultural camaraderie in Malappuram, Kerala.
              </p>
              <div className="pt-2 text-xs text-slate-400 space-y-1.5">
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-amber-400 shrink-0" />
                  <span>{clubInfo.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-amber-400 shrink-0" />
                  <span>{clubInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="text-amber-400 shrink-0" />
                  <span>{clubInfo.email}</span>
                </div>
              </div>
            </div>

            {/* Col 3: Quick Navigation */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li><Link to="/" className="hover:text-white transition-colors">Home Feed</Link></li>
                <li><Link to="/events" className="hover:text-white transition-colors">Calendar & Events</Link></li>
                <li><Link to="/programs" className="hover:text-white transition-colors">Upcoming Programs</Link></li>
                <li><Link to="/gallery" className="hover:text-white transition-colors">Club Photo Gallery</Link></li>
                <li><Link to="/membership" className="hover:text-white transition-colors">Apply for Membership</Link></li>
              </ul>
            </div>

            {/* Col 4: Club Exploration */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-4">About USAC</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li><Link to="/about" className="hover:text-white transition-colors">History & Heritage</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Sports Facilities</Link></li>
                <li><Link to="/team" className="hover:text-white transition-colors">Leadership & Committee</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact & Enquiries</Link></li>
              </ul>
            </div>

            {/* Col 5: Member & Admin Access */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-4">Portals</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-medium">
                <li><Link to="/login" className="hover:text-white transition-colors">Member Sign In</Link></li>
                <li><Link to="/admin/login" className="hover:text-amber-400 font-bold transition-colors">Admin Login</Link></li>
                {isAdmin && <li><Link to="/admin/dashboard" className="text-amber-400 font-bold hover:underline">Admin Dashboard</Link></li>}
              </ul>
              <div className="mt-6 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Annual Membership</span>
                <span className="text-sm font-extrabold text-white">₹200 / Year</span>
              </div>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Universal Sports & Arts Club. All rights reserved.</p>
            <p className="text-[11px]">{clubInfo.affiliation}</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
