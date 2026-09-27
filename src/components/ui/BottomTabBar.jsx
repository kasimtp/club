import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiCalendar, FiImage, FiAward, FiInfo } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function BottomTabBar() {
  const { isMember } = useAuth();
  const location = useLocation();

  // Hide bottom tab bar inside admin panel routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const tabs = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Events', path: '/events', icon: FiCalendar },
    { name: 'Gallery', path: '/gallery', icon: FiImage },
    { name: isMember ? 'My Card' : 'Join', path: '/membership', icon: FiAward },
    { name: 'About', path: '/about', icon: FiInfo },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe">
      <nav className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(tab.path);

          return (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all select-none ${
                isActive 
                  ? 'text-slate-950 font-bold' 
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-full transition-all ${
                isActive ? 'bg-slate-100 text-slate-950 scale-110' : ''
              }`}>
                <Icon className="text-xl" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">
                {tab.name}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
