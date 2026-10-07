import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

// Rendered into <body> through a portal: page wrappers use transform animations
// (animate-fade-in), and a transformed ancestor would otherwise trap this
// `position: fixed` overlay inside the page area, under sticky headers.
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
  showClose = true
}) {
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2A292E]/35 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Surface: bottom sheet on mobile, centered card on tablet/desktop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={`relative z-10 w-full ${maxWidth} bg-[#F7F6F8] rounded-t-[32px] sm:rounded-[32px] border-[1.5px] border-white shadow-[0_40px_80px_-30px_rgba(70,50,90,0.45)] overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-slide-up sm:animate-scale-in`}
      >
        {/* Mobile pull handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 bg-black/10 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 sm:px-7 py-4 sm:py-5 border-b border-black/5 shrink-0">
          <h3 className="font-display text-xl font-semibold text-ink tracking-tight">{title}</h3>
          {showClose && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white hover:bg-ember hover:text-white text-ink-muted flex items-center justify-center transition-colors shadow-[0_6px_14px_-8px_rgba(70,50,90,0.35)]"
              aria-label="Close"
            >
              <FiX className="text-lg" />
            </button>
          )}
        </div>

        {/* Scrollable body */}
        <div className="p-6 sm:p-7 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
