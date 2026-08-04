import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE_HOME_PATHS } from '../../security/roles/roles';
import { StacklyLogo } from '../../components/common/StacklyLogo';
import {
  Mail,
  Users,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  Building2
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0B1120] text-slate-100 font-sans">
      
      {/* LEFT PANEL (50% WIDTH ON DESKTOP): Corporate Branding & 2-Column Feature Highlights */}
      <div className="w-full lg:w-1/2 p-8 lg:p-14 bg-gradient-to-br from-blue-900/90 via-indigo-950 to-slate-950 text-white flex flex-col justify-between relative overflow-hidden shrink-0 border-r border-slate-800/80">
        {/* Background Ambient Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <StacklyLogo size={38} />
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 my-8 space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold backdrop-blur-md">
            <Sparkles size={14} className="text-amber-400" /> Enterprise HR & Intelligence Platform
          </div>

          <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
            Smart workforce decisions powered by real-time analytics
          </h2>

          <p className="text-blue-100/90 text-xs lg:text-sm leading-relaxed font-medium">
            Manage employees, attendance, performance, and workforce insights in one intelligent platform used daily by enterprise teams.
          </p>

          {/* 2-Column Side-by-Side Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/30 text-blue-200 shrink-0">
                <Users size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white truncate">Employee Directory</p>
                <p className="text-[10px] text-blue-200 truncate">Lifecycle & Profiles</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/30 text-purple-200 shrink-0">
                <Clock size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white truncate">Real-Time Attendance</p>
                <p className="text-[10px] text-blue-200 truncate">Roster & Clock-Ins</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/30 text-emerald-200 shrink-0">
                <TrendingUp size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white truncate">Performance KPIs</p>
                <p className="text-[10px] text-blue-200 truncate">Quarterly Matrix</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/30 text-amber-200 shrink-0">
                <Building2 size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white truncate">Department DBAC</p>
                <p className="text-[10px] text-blue-200 truncate">Isolated Analytics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-200">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-400" /> 256-Bit SSL Encrypted Session
          </span>
          <span className="font-mono text-[11px]">v2.4 Enterprise</span>
        </div>
      </div>

      {/* RIGHT PANEL (50% WIDTH ON DESKTOP): Authentication Form Card */}
      <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-14 flex items-center justify-center bg-[#0B1120]">
        <div className="max-w-md w-full space-y-6 bg-slate-900/90 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl relative">
          
          {/* Card Header & Logo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <StacklyLogo size={34} />
              <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/30">
                SECURE AUTH
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Welcome Back
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Sign in with your official company credentials to access your dashboard.
              </p>
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Role Selection Pills */}
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
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  email === 'admin@thestackly.com'
                    ? '!bg-blue-600 !border-blue-500 !text-white shadow-md'
                    : '!bg-slate-800/90 !border-slate-700 !text-slate-300 hover:!bg-slate-700 hover:!text-white'
                }`}
              >
                Admin
              </button>

              <button
                type="button"
                onClick={() => handleDemoRoleSelect('hr@thestackly.com')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  email === 'hr@thestackly.com'
                    ? '!bg-purple-600 !border-purple-500 !text-white shadow-md'
                    : '!bg-slate-800/90 !border-slate-700 !text-slate-300 hover:!bg-slate-700 hover:!text-white'
                }`}
              >
                HR
              </button>

              <button
                type="button"
                onClick={() => handleDemoRoleSelect('manager@thestackly.com')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  email === 'manager@thestackly.com'
                    ? '!bg-emerald-600 !border-emerald-500 !text-white shadow-md'
                    : '!bg-slate-800/90 !border-slate-700 !text-slate-300 hover:!bg-slate-700 hover:!text-white'
                }`}
              >
                Manager
              </button>

              <button
                type="button"
                onClick={() => handleDemoRoleSelect('john.doe@thestackly.com')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                  email === 'john.doe@thestackly.com'
                    ? '!bg-amber-600 !border-amber-500 !text-white shadow-md'
                    : '!bg-slate-800/90 !border-slate-700 !text-slate-300 hover:!bg-slate-700 hover:!text-white'
                }`}
              >
                Employee
              </button>
            </div>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            {/* Email Field */}
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
                  className="w-full !bg-slate-950 !border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs !text-white placeholder-slate-500 focus:outline-none focus:!border-blue-500 transition-colors shadow-inner"
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
                  className="text-[11px] text-blue-400 hover:underline font-bold disabled:opacity-50 !bg-transparent !border-0 p-0"
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
                  className="w-full !bg-slate-950 !border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono !text-white placeholder-slate-500 focus:outline-none focus:!border-blue-500 transition-colors shadow-inner tracking-widest"
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
                  className="w-4 h-4 rounded border-slate-800 !bg-slate-950 text-blue-600 focus:ring-blue-500"
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
              className="w-full py-3 rounded-xl !bg-gradient-to-r !from-blue-600 !to-indigo-600 hover:!from-blue-500 hover:!to-indigo-500 !text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 border-0 cursor-pointer"
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

          {/* Quick Domain Hint */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 text-center font-mono">
            Demo OTP: <strong className="text-blue-400">849201</strong> • Mandatory Domain: <strong className="text-emerald-400">@thestackly.com</strong>
          </div>

        </div>
      </div>
    </div>
  );
};
