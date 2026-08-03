import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE_HOME_PATHS } from '../../security/roles/roles';
import { StacklyLogo } from '../../components/common/StacklyLogo';
import {
  Mail,
  Lock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Users,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('john.doe@stackly.com');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const homePath = ROLE_HOME_PATHS[role] || '/employee/dashboard';
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
    if (!email.toLowerCase().endsWith('@stackly.com')) {
      setError('Only official @stackly.com company email addresses are permitted.');
      return;
    }
    setCodeSent(true);
    setTimer(60);
    setVerificationCode('849201'); // Auto-fill demo OTP
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.toLowerCase().endsWith('@stackly.com')) {
      setError('Only official @stackly.com company email addresses are permitted.');
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
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 font-sans">
      {/* LEFT SIDE: Stackly Corporate Branding & Illustration */}
      <div className="lg:w-1/2 p-8 lg:p-16 bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Background Glass Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding Header */}
        <div className="relative z-10 flex items-center gap-3">
          <StacklyLogo size={38} showText={false} />
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none uppercase text-white">
              Stackly
            </h1>
            <p className="text-xs font-semibold text-blue-200 tracking-wider">
              Workforce Analytics
            </p>
          </div>
        </div>

        {/* Middle Value Proposition Headline */}
        <div className="relative z-10 my-12 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold backdrop-blur-md">
            <Sparkles size={14} className="text-amber-400" /> Enterprise HR & Intelligence Platform
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Smart workforce decisions powered by real-time analytics
          </h2>

          <p className="text-blue-100/90 text-sm leading-relaxed">
            Manage employees, attendance, performance, and workforce insights in one intelligent platform used daily by enterprise teams.
          </p>

          {/* Interactive Feature Pills */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/30 text-blue-200">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Employee Lifecycle</p>
                <p className="text-[10px] text-blue-200">Directory & Profiles</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/30 text-purple-200">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Real-Time Attendance</p>
                <p className="text-[10px] text-blue-200">Roster & Approvals</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/30 text-emerald-200">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Performance KPIs</p>
                <p className="text-[10px] text-blue-200">Quarterly Reviews</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/30 text-amber-200">
                <Building2 size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Department Analytics</p>
                <p className="text-[10px] text-blue-200">Org Structure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Footer */}
        <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-blue-200">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-400" /> 256-Bit SSL Encrypted Session
          </span>
          <span className="font-mono text-[11px]">v2.4 Enterprise</span>
        </div>
      </div>

      {/* RIGHT SIDE: Corporate Sign-In Authentication Form Card */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="max-w-md w-full space-y-8 bg-[var(--bg-secondary)] p-8 lg:p-10 rounded-3xl border border-[var(--border-color)] shadow-2xl transition-all">
          {/* Header Title */}
          <div>
            <h3 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Welcome Back
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Sign in with your official company credentials to access your dashboard.
            </p>
          </div>

          {/* Quick Demo Role Selector Pills */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Demo Role Accounts
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Admin', email: 'admin@stackly.com' },
                { label: 'HR Manager', email: 'hr.manager@stackly.com' },
                { label: 'Dept Head', email: 'dept.head@stackly.com' },
                { label: 'Team Lead', email: 'team.lead@stackly.com' },
                { label: 'Employee', email: 'john.doe@stackly.com' },
              ].map((acc) => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setCodeSent(true);
                    setVerificationCode('849201');
                    setError('');
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                    email === acc.email
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] text-slate-400 hover:text-[var(--text-primary)]'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Error Box */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Field 1: Company Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
                <span>Company Email</span>
                <span className="text-[10px] text-blue-500 font-mono">Domain: @stackly.com</span>
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="employee@stackly.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors font-medium"
                />
              </div>
            </div>

            {/* Field 2: Sign-In Verification Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
                <span>Sign-In Verification Code</span>
                {timer > 0 && (
                  <span className="text-[10px] text-amber-500 font-mono font-bold">Resend code in {timer}s</span>
                )}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="6-digit verification code"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] tracking-widest font-mono font-bold focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <button
                  type="button"
                  disabled={timer > 0}
                  onClick={handleSendCode}
                  className="px-3.5 py-2.5 text-xs font-bold rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-500 hover:bg-blue-600 hover:text-white disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Send size={14} /> {codeSent ? 'Resent' : 'Send Code'}
                </button>
              </div>
            </div>

            {/* Remember Device Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-400 font-medium">Remember device for 30 days</span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Verifying Authentication...</span>
              ) : (
                <>
                  <CheckCircle2 size={18} /> Sign In to Stackly Dashboard
                </>
              )}
            </button>
          </form>

          {/* Security Message */}
          <div className="pt-4 border-t border-[var(--border-color)] text-center text-[11px] text-slate-400">
            Your company account is protected with secure enterprise multi-factor authentication.
          </div>
        </div>
      </div>
    </div>
  );
};
