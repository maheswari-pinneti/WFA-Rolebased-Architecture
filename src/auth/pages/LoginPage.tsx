import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE_HOME_PATHS } from '../../security/roles/roles';
import { StacklyLogo } from '../../components/common/StacklyLogo';
import {
  Mail,
  AlertCircle,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  UserPlus,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@thestackly.com');
  const [verificationCode, setVerificationCode] = useState('849201');
  const [timer, setTimer] = useState(0);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const homePath = ROLE_HOME_PATHS[role] || '/admin/dashboard';
      navigate(homePath);
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendCode = () => {
    setError('');
    if (!email.toLowerCase().endsWith('@thestackly.com')) {
      setError('Only official @thestackly.com company email addresses are permitted.');
      return;
    }
    setTimer(60);
    setVerificationCode('849201');
  };

  const handleDemoRoleSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setVerificationCode('849201');
    setError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.toLowerCase().endsWith('@thestackly.com')) {
      setError('Only official @thestackly.com company email addresses are permitted.');
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      const homePath = ROLE_HOME_PATHS[role] || '/admin/dashboard';
      navigate(homePath);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Subtle Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* PREMIUM ELEGANT CENTERED AUTH CARD */}
      <div className="w-full max-w-[440px] mx-auto space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 sm:p-9 rounded-3xl shadow-xl dark:shadow-2xl shadow-slate-900/10 relative z-10">
        
        {/* Header & Logo */}
        <div className="space-y-3 text-center flex flex-col items-center">
          <div className="p-2 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 shadow-sm">
            <StacklyLogo size={42} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign in to Stackly
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Workforce Analytics & Intelligence Platform
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle size={16} className="shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Quick Demo Roles Segmented Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles size={13} className="text-amber-500" /> Quick Demo Roles
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold">
              @thestackly.com
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleDemoRoleSelect('admin@thestackly.com')}
              className={`py-2 text-xs font-bold rounded-xl transition-all border-0 cursor-pointer ${
                email === 'admin@thestackly.com'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent'
              }`}
            >
              Admin
            </button>

            <button
              type="button"
              onClick={() => handleDemoRoleSelect('hr@thestackly.com')}
              className={`py-2 text-xs font-bold rounded-xl transition-all border-0 cursor-pointer ${
                email === 'hr@thestackly.com'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent'
              }`}
            >
              HR
            </button>

            <button
              type="button"
              onClick={() => handleDemoRoleSelect('manager@thestackly.com')}
              className={`py-2 text-xs font-bold rounded-xl transition-all border-0 cursor-pointer ${
                email === 'manager@thestackly.com'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent'
              }`}
            >
              Manager
            </button>

            <button
              type="button"
              onClick={() => handleDemoRoleSelect('john.doe@thestackly.com')}
              className={`py-2 text-xs font-bold rounded-xl transition-all border-0 cursor-pointer ${
                email === 'john.doe@thestackly.com'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-transparent'
              }`}
            >
              Employee
            </button>
          </div>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
          {/* Corporate Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Corporate Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@thestackly.com"
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Verification Code Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Verification Code (OTP)
              </label>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={timer > 0}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold disabled:opacity-50 border-0 bg-transparent p-0 cursor-pointer"
              >
                {timer > 0 ? `Resend in ${timer}s` : 'Send Code'}
              </button>
            </div>

            <div className="relative flex items-center">
              <KeyRound size={16} className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <input
                type="text"
                required
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="6-digit verification code"
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner tracking-widest"
              />
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium">Remember this browser</span>
            </label>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-500" /> Auto-Verified
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 border-0 cursor-pointer active:scale-[0.99]"
          >
            {isLoading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer & Registration Link */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col items-center gap-3 text-center">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-bold inline-flex items-center gap-1">
              <UserPlus size={13} /> Sign Up
            </Link>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 font-mono w-full">
            Demo OTP: <strong className="text-blue-600 dark:text-blue-400">849201</strong> • Domain: <strong className="text-emerald-600 dark:text-emerald-400">@thestackly.com</strong>
          </div>
        </div>

      </div>
    </div>
  );
};
