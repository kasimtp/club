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

  // "Sense" theme: ember for the main action, white glass pills for the rest
  const variants = {
    primary: 'bg-ember hover:bg-[#E0582B] text-white rounded-full shadow-[0_10px_22px_-10px_rgba(242,104,58,0.7)]',
    secondary: 'bg-white/80 hover:bg-white text-ink rounded-full border border-white shadow-[0_6px_16px_-10px_rgba(70,50,90,0.35)]',
    outline: 'bg-white/50 border-[1.5px] border-white hover:bg-white text-ink rounded-full',
    ghost: 'text-ink-muted hover:text-ink hover:bg-white/60 rounded-full',
    danger: 'bg-red-500 hover:bg-red-600 text-white rounded-full shadow-[0_10px_22px_-10px_rgba(229,52,31,0.6)]',
    amber: 'bg-ember hover:bg-[#E0582B] text-white rounded-full shadow-[0_10px_22px_-10px_rgba(242,104,58,0.7)]',
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
