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
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('john.doe@thestackly.com');
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
    if (!email.toLowerCase().endsWith('@thestackly.com')) {
      setError('Only official @thestackly.com company email addresses are permitted.');
      return;
    }
    setCodeSent(true);
    setTimer(60);
    setVerificationCode('849201'); // Auto-fill demo OTP
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
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-slate-100 transition-colors duration-300 font-sans">
      {/* LEFT SIDE: Stackly Corporate Branding & Illustration */}
      <div className="lg:w-1/2 p-8 lg:p-16 bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-950 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
        {/* Background Glass Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding Header with Stackly Logo */}
        <div className="relative z-10 flex items-center gap-4">
          <StacklyLogo size={42} showText={true} />
        </div>

        {/* Middle Value Proposition Headline */}
        <div className="relative z-10 my-12 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold backdrop-blur-md">
            <Sparkles size={14} className="text-amber-400" /> Enterprise HR & Intelligence Platform
          </div>

          <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
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
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-slate-950">
        <div className="max-w-md w-full space-y-7 bg-slate-900/90 p-8 lg:p-10 rounded-3xl border border-slate-800 shadow-2xl transition-all relative">
          
          {/* Card Header with STACKLY Logo */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <StacklyLogo size={36} showText={true} />
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
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Role Selector Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                DEMO ROLE ACCOUNTS
              </label>
              <span className="text-[10px] text-blue-400 font-mono font-bold">
                Domain: @thestackly.com
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Admin', email: 'admin@thestackly.com' },
                { label: 'HR Manager', email: 'hr.manager@thestackly.com' },
                { label: 'Dept Head', email: 'dept.head@thestackly.com' },
                { label: 'Team Lead', email: 'team.lead@thestackly.com' },
                { label: 'Employee', email: 'john.doe@thestackly.com' },
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
                  className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all border ${
                    email === acc.email
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30'
                      : 'bg-slate-800/90 text-slate-200 border-slate-700/80 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Company Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-blue-400" /> Company Email
                </span>
                <span className="text-[10px] text-blue-400 font-mono font-bold">
                  @thestackly.com required
                </span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@thestackly.com"
                className="w-full px-4 py-3 text-xs rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
              />
            </div>

            {/* OTP Verification Code & Send Code Button */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Lock size={14} className="text-blue-400" /> Sign-In Verification Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="6-digit verification code"
                  className="flex-1 px-4 py-3 text-xs rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 font-mono tracking-widest placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
                />
                <button
                  type="button"
                  disabled={timer > 0}
                  onClick={handleSendCode}
                  className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white disabled:text-slate-500 text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Send size={14} />
                  {timer > 0 ? `${timer}s` : 'Send Code'}
                </button>
              </div>
              {codeSent && (
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
                  <CheckCircle2 size={12} /> Code dispatched to {email}
                </p>
              )}
            </div>

            {/* Remember Device Checkbox */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 text-blue-600 focus:ring-blue-500 bg-slate-950"
                />
                <span className="text-slate-300 font-medium">Remember device for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <CheckCircle2 size={16} /> Sign In to Stackly Dashboard <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <p className="text-[10px] text-slate-500 text-center leading-relaxed border-t border-slate-800/80 pt-4">
            Your company account is protected with secure enterprise multi-factor authentication.
          </p>
        </div>
      </div>
    </div>
  );
};
