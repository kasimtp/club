import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'amber'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-bold transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary: 'bg-black hover:bg-slate-800 text-white rounded-full shadow-sm',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full',
    outline: 'border border-slate-300 hover:border-slate-800 hover:bg-slate-50 text-slate-800 rounded-full',
    ghost: 'text-slate-700 hover:bg-slate-100 rounded-full',
    danger: 'bg-red-500 hover:bg-red-600 text-white rounded-full shadow-sm',
    amber: 'bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-full shadow-sm font-extrabold',
  };

  const sizes = {
    sm: 'h-10 px-4 text-xs tracking-tight gap-1.5',
    md: 'h-12 px-6 text-sm tracking-tight gap-2',
    lg: 'h-14 px-8 text-base tracking-tight gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : Icon ? (
        <Icon className="text-lg shrink-0" />
      ) : null}
      <span>{children}</span>
      {!loading && IconRight && <IconRight className="text-lg shrink-0" />}
    </button>
  );
}
