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
    fg = '#6E6C75';
    bg = 'rgba(255, 255, 255, 0.35)';
  }

  const isInteractive = Boolean(onClick);

  const sizeStyles = 'whitespace-nowrap shrink-0 ' + (size === 'sm' 
    ? 'px-2.5 py-0.5 text-xs' 
    : 'px-3.5 py-1.5 text-xs font-semibold');

  if (active) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 rounded-full bg-white text-ink font-bold border-[1.5px] border-white shadow-[0_8px_18px_-10px_rgba(70,50,90,0.4)] transition-all ${sizeStyles} ${className}`}
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
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border-[1.5px] ${variant === 'slate' ? 'border-white/80' : 'border-transparent'} transition-all ${
        isInteractive ? 'hover:opacity-85 hover:scale-[1.02] active:scale-95' : ''
      } ${sizeStyles} ${className}`}
    >
      {Icon && <Icon className="text-xs" />}
      <span>{label}</span>
    </button>
  );
}
