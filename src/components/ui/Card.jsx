import React from 'react';

export default function Card({
  children,
  className = '',
  variant = 'default', // 'default' | 'sunken' | 'muted' | 'bordered' | 'dark'
  interactive = false,
  onClick,
  ...props
}) {
  const variants = {
    default: 'bg-white border border-slate-200 shadow-xs',
    sunken: 'bg-slate-50 border border-slate-200',
    muted: 'bg-slate-100 border border-transparent',
    bordered: 'bg-transparent border border-slate-300',
    dark: 'bg-slate-950 text-white border border-slate-800',
  };

  const interactiveClasses = interactive
    ? 'hover:border-slate-400 hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99]'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 md:p-6 ${variants[variant] || variants.default} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
