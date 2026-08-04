import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleType } from '../../context/SecurityContext';
import { Zap, Lock, Mail, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<RoleType>('ADMIN');
  const [email, setEmail] = useState('maheswaripinneti@thestackly.com');
  const [otpCode, setOtpCode] = useState('849201');
  const [isOtpSent, setIsOtpSent] = useState(true);

  const demoRoles: { label: string; role: RoleType; email: string }[] = [
    { label: 'Admin', role: 'ADMIN', email: 'maheswaripinneti@thestackly.com' },
    { label: 'HR Manager', role: 'HR_MANAGER', email: 'hr.manager@thestackly.com' },
    { label: 'Manager', role: 'DEPT_MANAGER', email: 'dept.manager@thestackly.com' },
    { label: 'Team Lead', role: 'TEAM_LEAD', email: 'team.lead@thestackly.com' },
    { label: 'Employee', role: 'EMPLOYEE', email: 'employee@thestackly.com' },
  ];

  const handleRoleSelect = (item: typeof demoRoles[0]) => {
    setSelectedRole(item.role);
    setEmail(item.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans select-none relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 blur-3xl rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <header className="h-16 px-8 border-b border-slate-800/80 flex items-center justify-between z-10 shrink-0 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5 font-black text-xl text-white">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-lg shadow-blue-500/20">
            <Zap size={20} className="fill-white" />
          </div>
          <span className="tracking-tight">STACKLY</span>
        </div>

        <a
          href="#"
          className="text-xs font-bold text-slate-400 hover:text-blue-400 flex items-center gap-1.5 transition-colors"
        >
          <span>New to Stackly? Click here for homepage!</span>
          <ExternalLink size={13} />
        </a>
      </header>

      {/* Main Centered Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 rounded-3xl p-8 shadow-2xl shadow-black/80 backdrop-blur-xl space-y-6">
          {/* Logo & Title Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto shadow-md">
              <Zap size={24} className="fill-blue-400" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Sign in to Stackly</h1>
            <p className="text-xs text-slate-400 font-semibold">Workforce Analytics Platform</p>
          </div>

          {/* QUICK DEMO ROLES Segmented Controls */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>✨ QUICK DEMO ROLES</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              {demoRoles.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleRoleSelect(item)}
                  className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all ${
                    selectedRole === item.role
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Corporate Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Corporate Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@thestackly.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono font-medium"
                />
              </div>
            </div>

            {/* Verification Code (OTP) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Verification Code (OTP)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="849201"
                    maxLength={6}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono font-bold tracking-widest text-center"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsOtpSent(true)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors border border-slate-700"
                >
                  {isOtpSent ? 'Sent ✓' : 'Send Code'}
                </button>
              </div>
            </div>

            {/* Primary Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Login to Dashboard</span>
              <ArrowRight size={16} />
            </button>

            {/* Secondary SSO Button */}
            <button
              type="button"
              onClick={() => login(email, selectedRole)}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl font-bold text-xs border border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Sign in with Stackly SSO</span>
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-slate-500 text-xs font-medium z-10 border-t border-slate-900">
        © 2026 STACKLY Enterprise Platform • Designed by Maheswari Pinneti, Frontend Developer
      </footer>
    </div>
  );
};
