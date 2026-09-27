import React, { useState } from 'react';

export default function Avatar({ src, name = 'User', size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-bold',
    '2xl': 'w-24 h-24 text-2xl font-extrabold',
  };

  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        className={`rounded-full object-cover shrink-0 border border-slate-200 shadow-xs ${sizeClasses[size] || sizeClasses.md} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-semibold flex items-center justify-center shrink-0 select-none shadow-xs ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
