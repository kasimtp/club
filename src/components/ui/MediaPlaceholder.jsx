import React from 'react';

// Soft pastel stand-in for posts that have no photo yet (no stock imagery)
export default function MediaPlaceholder({ label, className = '' }) {
  return (
    <div className={`sense-canvas relative w-full h-full overflow-hidden flex items-center justify-center ${className}`}>
      <div className="dot-grid absolute inset-0" aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-3 px-4 text-center">
        <div className="orb w-12 h-12" aria-hidden="true" />
        {label && (
          <span className="font-display text-sm font-semibold text-ink-muted">{label}</span>
        )}
      </div>
    </div>
  );
}
