// Toast Notification Context
import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg border animate-fade-in ${
              toast.type === 'success'
                ? 'bg-slate-900 border-emerald-500/30 text-emerald-400'
                : toast.type === 'error'
                ? 'bg-slate-900 border-red-500/30 text-red-400'
                : toast.type === 'warning'
                ? 'bg-slate-900 border-amber-500/30 text-amber-400'
                : 'bg-slate-900 border-indigo-500/30 text-indigo-400'
            }`}
            style={{
              animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <FiCheckCircle className="text-xl shrink-0" />}
              {toast.type === 'error' && <FiAlertCircle className="text-xl shrink-0" />}
              {toast.type === 'warning' && <FiAlertCircle className="text-xl shrink-0" />}
              {toast.type === 'info' && <FiInfo className="text-xl shrink-0" />}
              <span className="text-sm font-medium text-gray-200">{toast.message}</span>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors p-0.5 rounded hover:bg-gray-800"
            >
              <FiX className="text-base" />
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
