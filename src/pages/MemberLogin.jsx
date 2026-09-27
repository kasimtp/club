// Member Sign-In Page
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import clubLogo from '../assets/club-logo.webp';

export default function MemberLogin() {
  const { loginWithGoogle, loginWithMockGoogle, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    const destination = location.state?.from?.pathname || '/profile';
    navigate(destination, { replace: true });
    return null;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/membership');
    } catch (err) {
      alert('Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (name, email) => {
    setLoading(true);
    try {
      await loginWithMockGoogle({ name, email });
      navigate('/membership');
    } catch (err) {
      alert('Sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-8 text-center">
        
        {/* Brand Crest Hero */}
        <div className="space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 p-2 flex items-center justify-center mx-auto shadow-lg shadow-black/5">
            <img src={clubLogo} alt="Universal Club Crest" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Universal Member Portal
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Sign in with your Google account to access your digital membership ID card and event registrations.
          </p>
        </div>

        {/* Benefits Checklist */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs text-slate-700 font-medium">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-amber-500 text-sm shrink-0" />
            <span>Instant Digital ID Pass synchronization</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-amber-500 text-sm shrink-0" />
            <span>Priority access to tournaments & facilities</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-amber-500 text-sm shrink-0" />
            <span>Upload and bookmark club gallery media</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-12 rounded-full border border-slate-300 hover:border-slate-900 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-xs active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9c0-.2 0-.2 0 0z"/>
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Quick Demo Sign-in buttons */}
          <div className="pt-2 text-[11px] text-slate-400 space-y-1">
            <p>Or test with sample accounts:</p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn('Alexander Wright', 'alex.wright@universalclub.com')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px]"
              >
                Sample Member
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn('Rahul Krishnan', 'rahul.krishnan@gmail.com')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px]"
              >
                Pending Applicant
              </button>
            </div>
          </div>
        </div>

        {/* Footer Admin Link */}
        <div className="pt-4 border-t border-slate-100">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <FiShield className="text-amber-600" /> Sign in as club administrator →
          </Link>
        </div>

      </div>
    </div>
  );
}
