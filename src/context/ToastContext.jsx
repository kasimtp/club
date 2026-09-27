// Toast Notification Context
import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border animate-fade-in ${
              toast.type === 'success'
                ? 'bg-slate-950 border-emerald-500/40 text-white'
                : toast.type === 'error'
                ? 'bg-slate-950 border-red-500/40 text-white'
                : toast.type === 'warning'
                ? 'bg-slate-950 border-amber-500/40 text-white'
                : 'bg-slate-950 border-slate-700 text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <FiCheckCircle className="text-emerald-400 text-lg shrink-0" />}
              {toast.type === 'error' && <FiAlertCircle className="text-red-400 text-lg shrink-0" />}
              {toast.type === 'warning' && <FiAlertCircle className="text-amber-400 text-lg shrink-0" />}
              {toast.type === 'info' && <FiInfo className="text-sky-400 text-lg shrink-0" />}
              <span className="text-xs font-semibold text-slate-200">{toast.message}</span>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
            >
              <FiX className="text-sm" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
