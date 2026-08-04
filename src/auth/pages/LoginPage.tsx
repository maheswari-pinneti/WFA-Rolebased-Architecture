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
  UserPlus
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@thestackly.com');
  const [verificationCode, setVerificationCode] = useState('849201');
  const [codeSent, setCodeSent] = useState(true);
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
    setCodeSent(true);
    setTimer(60);
    setVerificationCode('849201');
  };

  const handleDemoRoleSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setVerificationCode('849201');
    setCodeSent(true);
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#0B1120] text-slate-100 font-sans relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* PERFECTLY CENTERED PROPER MAX-WIDTH AUTH CARD */}
      <div className="w-full max-w-[460px] mx-auto space-y-6 bg-slate-900 border border-slate-800 p-7 sm:p-9 rounded-3xl shadow-2xl relative z-10 backdrop-blur-xl">
        
        {/* Brand Header */}
        <div className="space-y-3 text-center flex flex-col items-center">
          <StacklyLogo size={36} />
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Sign In to Workforce
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium max-w-xs mx-auto">
              Enter your official corporate credentials to access your dashboard.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Role Selector Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
              QUICK DEMO ROLES
            </label>
            <span className="text-[10px] text-blue-400 font-mono font-bold">
              @thestackly.com
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleDemoRoleSelect('admin@thestackly.com')}
              style={{
                backgroundColor: email === 'admin@thestackly.com' ? '#2563EB' : '#1E293B',
                borderColor: email === 'admin@thestackly.com' ? '#3B82F6' : '#334155',
                color: '#FFFFFF'
              }}
              className="py-2 px-2 rounded-xl text-xs font-extrabold border transition-all text-center cursor-pointer shadow-sm"
            >
              Admin
            </button>

            <button
              type="button"
              onClick={() => handleDemoRoleSelect('hr@thestackly.com')}
              style={{
                backgroundColor: email === 'hr@thestackly.com' ? '#9333EA' : '#1E293B',
                borderColor: email === 'hr@thestackly.com' ? '#A855F7' : '#334155',
                color: '#FFFFFF'
              }}
              className="py-2 px-2 rounded-xl text-xs font-extrabold border transition-all text-center cursor-pointer shadow-sm"
            >
              HR
            </button>

            <button
              type="button"
              onClick={() => handleDemoRoleSelect('manager@thestackly.com')}
              style={{
                backgroundColor: email === 'manager@thestackly.com' ? '#059669' : '#1E293B',
                borderColor: email === 'manager@thestackly.com' ? '#10B981' : '#334155',
                color: '#FFFFFF'
              }}
              className="py-2 px-2 rounded-xl text-xs font-extrabold border transition-all text-center cursor-pointer shadow-sm"
            >
              Manager
            </button>

            <button
              type="button"
              onClick={() => handleDemoRoleSelect('john.doe@thestackly.com')}
              style={{
                backgroundColor: email === 'john.doe@thestackly.com' ? '#D97706' : '#1E293B',
                borderColor: email === 'john.doe@thestackly.com' ? '#F59E0B' : '#334155',
                color: '#FFFFFF'
              }}
              className="py-2 px-2 rounded-xl text-xs font-extrabold border transition-all text-center cursor-pointer shadow-sm"
            >
              Employee
            </button>
          </div>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
          {/* Corporate Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">
              Corporate Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@thestackly.com"
                style={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  color: '#FFFFFF'
                }}
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Verification Code Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-300">
                Verification Code (OTP)
              </label>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={timer > 0}
                style={{ backgroundColor: 'transparent', border: 'none', padding: 0 }}
                className="text-[11px] text-blue-400 hover:underline font-bold disabled:opacity-50 cursor-pointer"
              >
                {timer > 0 ? `Resend in ${timer}s` : 'Send Code'}
              </button>
            </div>

            <div className="relative flex items-center">
              <KeyRound size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="6-digit verification code"
                style={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  color: '#FFFFFF'
                }}
                className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner tracking-widest"
              />
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember this browser</span>
            </label>

            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-400" /> Auto-Verified
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
              color: '#FFFFFF',
              border: 'none'
            }}
            className="w-full py-3 rounded-xl font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer hover:opacity-95"
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

        {/* Account Registration Link & Demo Info */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col items-center gap-3 text-center">
          <div className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:underline font-bold inline-flex items-center gap-1">
              <UserPlus size={13} /> Sign Up
            </Link>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 font-mono w-full">
            Demo OTP: <strong className="text-blue-400">849201</strong> • Domain: <strong className="text-emerald-400">@thestackly.com</strong>
          </div>
        </div>

      </div>
    </div>
  );
};
