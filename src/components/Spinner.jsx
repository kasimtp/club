// Spinner Component
import React from 'react';

const Spinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3 animate-fade-in">
      <div className={`relative ${sizeClasses[size] || sizeClasses.md}`}>
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-gray-700/60"></div>
        {/* Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-t-transparent border-primary animate-spin"></div>
      </div>
      {text && (
        <span className="text-gray-400 text-sm font-medium animate-pulse">{text}</span>
      )}
    </div>
  );
};

export default Spinner;
