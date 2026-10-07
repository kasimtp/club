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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-safe">
      <nav className="glass-strong flex items-center justify-around h-16 px-2 mb-3 rounded-full">
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
                  ? 'text-ink font-bold'
                  : 'text-ink-subtle hover:text-ink-muted font-medium'
              }`}
            >
              <Icon className={`text-xl ${isActive ? 'text-ember' : ''}`} />
              <span className="text-[10px] tracking-tight mt-1">
                {tab.name}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
