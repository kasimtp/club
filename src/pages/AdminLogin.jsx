// Admin Login Page Component
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLock, FiUser, FiActivity, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminLogin = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');

  // Destination path (redirect back to where user was or default dashboard)
  const from = location.state?.from?.pathname || '/admin/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in both username and password fields.');
      return;
    }

    setLocalLoading(true);
    try {
      await login(username, password);
      showToast('Welcome back, Administrator!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
      showToast('Authentication failed', 'error');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-900 border border-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 mx-auto">
            <FiActivity className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Admin Portal Access</h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Universal Club Management</p>
          </div>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400">
            <FiAlertCircle className="text-lg shrink-0 mt-0.5" />
            <p className="text-xs font-medium leading-relaxed">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="form-label" htmlFor="username">Username or Email</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-3.5 text-gray-500" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input pl-10 text-sm"
                placeholder="clubadmin"
                disabled={localLoading || loading}
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="password">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-3.5 text-gray-500" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pl-10 text-sm"
                placeholder="••••••••"
                disabled={localLoading || loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={localLoading || loading}
            className="w-full py-3.5 bg-primary hover:bg-primary-hover disabled:bg-gray-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            {localLoading || loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Credentials Helper Callout */}
        <div className="pt-4 border-t border-gray-850 text-center">
          <p className="text-[10px] text-gray-500">
            Developer Notice: Use <span className="text-gray-400 font-semibold">clubadmin</span> & <span className="text-gray-400 font-semibold">adm12345</span> to bypass auth.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
