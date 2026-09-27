import React from 'react';
import { accentFor, accents } from '../../theme/colors';

export default function Chip({ 
  label, 
  variant = 'auto', // 'auto' | 'amber' | 'sky' | 'mint' | 'coral' | 'violet' | 'rose' | 'slate' | 'solid'
  active = false,
  onClick, 
  size = 'md',
  className = '',
  icon: Icon
}) {
  let fg = '#121214';
  let bg = '#F2F2F4';

  if (variant === 'auto') {
    const acc = accentFor(label);
    fg = acc.fg;
    bg = acc.bg;
  } else if (accents[variant]) {
    fg = accents[variant].fg;
    bg = accents[variant].bg;
  } else if (variant === 'slate') {
    fg = '#5C5C66';
    bg = '#F2F2F4';
  }

  const isInteractive = Boolean(onClick);

  const sizeStyles = size === 'sm' 
    ? 'px-2.5 py-0.5 text-xs' 
    : 'px-3.5 py-1.5 text-xs font-semibold';

  if (active) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 rounded-full bg-black text-white font-bold transition-all shadow-xs ${sizeStyles} ${className}`}
      >
        {Icon && <Icon className="text-xs" />}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isInteractive}
      style={{
        backgroundColor: bg,
        color: fg,
        cursor: isInteractive ? 'pointer' : 'default',
      }}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all ${
        isInteractive ? 'hover:opacity-85 hover:scale-[1.02] active:scale-95' : ''
      } ${sizeStyles} ${className}`}
    >
      {Icon && <Icon className="text-xs" />}
      <span>{label}</span>
    </button>
  );
}
