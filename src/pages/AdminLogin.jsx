// Administrator Portal Sign-In Page
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCloud } from '../services/store';
import { TEST_ADMIN, testAdminEnabled } from '../services/authService';
import Button from '../components/ui/Button';
import clubLogo from '../assets/club-logo.webp';

export default function AdminLogin() {
  const { loginAdmin, isAdmin } = useAuth();
  // Temporary: pre-filled with the test admin while testing (see services/authService.js)
  const [username, setUsername] = useState(testAdminEnabled ? TEST_ADMIN.username : '');
  const [password, setPassword] = useState(testAdminEnabled ? TEST_ADMIN.password : '');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  if (isAdmin) {
    const destination = location.state?.from?.pathname || '/admin/dashboard';
    navigate(destination, { replace: true });
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-[30px] glass shadow-[0_14px_30px_-16px_rgba(70,50,90,0.35)] space-y-6 text-center">
        
        {/* Shield Hero Icon / Brand Crest */}
        <div className="space-y-3">
          <div className="w-20 h-20 rounded-[30px] glass p-2 flex items-center justify-center mx-auto shadow-[0_14px_30px_-16px_rgba(70,50,90,0.35)]">
            <img src={clubLogo} alt="Universal Club Crest" className="w-full h-full object-contain" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-ember-soft text-ember text-[10px] font-bold uppercase tracking-wider">
            Authorised Access Only
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Admin Console Login
          </h1>
          <p className="text-xs text-ink-muted max-w-xs mx-auto">
            Universal Arts & Sports Club Vellur — back-office portal and member management.
          </p>
        </div>

        {testAdminEnabled && (
          <p className="px-4 py-2.5 rounded-2xl bg-ember-soft text-[11px] font-medium text-ember text-left">
            Test login is on: clubadmin signs in as {TEST_ADMIN.email}. Turn it off before the site goes live.
          </p>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 animate-slide-up">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="form-label">{useCloud && !testAdminEnabled ? 'Admin email' : 'Admin email or username'}</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle text-base" />
              <input
                type={useCloud && !testAdminEnabled ? 'email' : 'text'}
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={useCloud ? 'you@example.com' : 'clubadmin'}
                className="form-input pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle text-base" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input pl-11 pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              type="submit"
              fullWidth
              loading={loading}
              iconRight={FiArrowRight}
            >
              Sign In to Admin Console
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-black/5 flex items-center justify-between text-xs text-ink-subtle">
          <Link to="/" className="hover:text-ink transition-colors">
            ← Back to Home
          </Link>
          <Link to="/login" className="hover:text-ink transition-colors">
            Member Login →
          </Link>
        </div>

      </div>
    </div>
  );
}
