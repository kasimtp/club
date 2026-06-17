// Public Layout: Navbar, Footer, and Content Wrapper
import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiActivity, FiUser, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Team', path: '/team' },
    { name: 'Membership', path: '/membership' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-gray-200">
      {/* Navigation Bar */}
      <nav className="glass-nav sticky top-0 z-40 border-b border-gray-850/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
                <FiActivity className="text-xl text-white font-bold" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-wider uppercase group-hover:text-primary transition-colors">
                  Universal<span className="text-primary font-normal">Club</span>
                </span>
                <span className="hidden sm:block text-[10px] tracking-widest text-gray-500 uppercase font-semibold">Arts & Sports</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-250 ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-850 text-sm font-semibold text-gray-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 rounded-lg transition-all"
              >
                <FiUser className="text-base" />
                {isAuthenticated ? 'Dashboard' : 'Admin'}
              </Link>
              <Link
                to="/membership"
                className="px-5 py-2.5 bg-gradient-to-r from-primary to-emerald-600 hover:from-emerald-500 hover:to-primary text-sm font-bold text-white rounded-lg shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-1"
              >
                Join Now <FiArrowRight className="text-base" />
              </Link>
            </div>

            {/* Mobile Hamburger Trigger */}
            <div className="lg:hidden flex items-center gap-3">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 border border-gray-850 text-gray-400 hover:text-primary rounded-lg transition-all"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-850/60 animate-fade-in">
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-base font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-400 hover:text-primary hover:bg-gray-950'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-gray-850 flex flex-col gap-3">
                <Link
                  to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 border border-gray-850 text-center text-sm font-semibold text-gray-400 hover:text-primary rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <FiUser className="text-base" />
                  {isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
                </Link>
                <Link
                  to="/membership"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-hover transition-all"
                >
                  Join Club
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-slate-900 border-t border-gray-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Card */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center">
                  <FiActivity className="text-lg text-white" />
                </div>
                <span className="text-lg font-extrabold text-white tracking-wider uppercase">
                  Universal<span className="text-primary font-normal">Club</span>
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Elevating active lifestyles through professional training, community wellness, and peerless social facilities. Join the pinnacle of athleticism.
              </p>
            </div>

            {/* Quick Navigation Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About History & Mission</Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-400 hover:text-primary transition-colors">Our Training Programs</Link>
                </li>
                <li>
                  <Link to="/events" className="text-gray-400 hover:text-primary transition-colors">Upcoming Events Listing</Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-gray-400 hover:text-primary transition-colors">Photo & Video Gallery</Link>
                </li>
              </ul>
            </div>

            {/* Facility Hours */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Hours of Operation</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between"><span>Weekdays:</span> <span className="text-gray-300">06:00 AM - 10:00 PM</span></li>
                <li className="flex justify-between"><span>Saturdays:</span> <span className="text-gray-300">07:00 AM - 08:00 PM</span></li>
                <li className="flex justify-between"><span>Sundays:</span> <span className="text-gray-300">08:00 AM - 06:00 PM</span></li>
                <li className="flex items-center gap-1.5 pt-2 border-t border-gray-850 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-xs">Facilities open now</span>
                </li>
              </ul>
            </div>

            {/* Contact Short Details */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Contact Info</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <p className="text-xs uppercase text-gray-500 font-bold">Location</p>
                  <p className="text-gray-300">Vellur, Vellur P.O., Malappuram, Kerala - 676517</p>
                </li>
                <li>
                  <p className="text-xs uppercase text-gray-500 font-bold">Email & Phone</p>
                  <p className="text-gray-300">info@universalclub.com</p>
                  <p className="text-gray-300">+91 (483) 273-4567</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright Sub-footer */}
          <div className="border-t border-gray-850 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Universal Club Management System. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/admin/login" className="hover:text-primary transition-colors">Admin Access Portal</Link>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
