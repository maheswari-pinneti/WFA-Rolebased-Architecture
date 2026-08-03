import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../../security/roles/roles';
import { StacklyLogo } from '../../components/common/StacklyLogo';
import { KeyRound, AlertCircle, ArrowRight, CheckCircle2, Shield, Smartphone, Lock, Building2 } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('••••••••••••');
  const [mfaCode, setMfaCode] = useState('');
  const [step, setStep] = useState<'CREDENTIALS' | 'MFA'>('CREDENTIALS');
  const [domainError, setDomainError] = useState<string | null>(null);

  const { login, isLoading, error, switchRole } = useAuth();

  const isCompanyEmail = (emailStr: string): boolean => {
    const allowedDomains = ['@company.com', '@stackly.io', '@enterprise.com'];
    return allowedDomains.some((domain) => emailStr.toLowerCase().endsWith(domain));
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDomainError(null);

    // Official Company Email Domain Verification
    if (!isCompanyEmail(email)) {
      setDomainError(
        'Access Denied: Only official corporate email addresses (@company.com) are permitted. Public email providers (@gmail.com, @yahoo.com) are rejected by security policy.'
      );
      return;
    }

    // Advance to MFA Step
    setStep('MFA');
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  const demoAccounts = [
    { role: Role.ADMIN, email: 'admin@company.com', name: 'Sarah Connor', label: 'Admin (Complete Access)', level: 'Level 1 • Org Level Scope' },
    { role: Role.HR, email: 'hr@company.com', name: 'Elena Rostova', label: 'HR Manager (Workforce Management)', level: 'Level 2 • Entire Organization' },
    { role: Role.MANAGER, email: 'manager@company.com', name: 'David Sterling', label: 'Department Manager (Eng/Fin/Sales)', level: 'Level 3 • Department Scope' },
    { role: Role.TEAM_LEAD, email: 'lead@company.com', name: 'Marcus Vance', label: 'Team Lead (Operational TL)', level: 'Level 4 • Direct Reports Scope' },
    { role: Role.EMPLOYEE, email: 'employee@company.com', name: 'Alex Mercer', label: 'Employee (Self Service)', level: 'Level 5 • Self Data Only' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30 shadow-2xl mb-4">
            <StacklyLogo size={48} showText={false} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Workforce Analytics Platform</h1>
          <p className="text-xs text-slate-400 mt-1">Enterprise RBAC & DBAC Security Portal (5-Tier Hierarchy)</p>
        </div>

        <div className="glass-panel p-8 backdrop-blur-xl bg-slate-900/90 border-slate-800 shadow-2xl rounded-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            <KeyRound size={20} className="text-blue-400" />
            {step === 'CREDENTIALS' ? 'Sign in with Corporate Identity' : 'Multi-Factor Authentication (MFA)'}
          </h2>

          {(error || domainError) && (
            <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>{domainError || error}</div>
            </div>
          )}

          {step === 'CREDENTIALS' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Official Company Email ID</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <Building2 size={12} /> @company.com Required
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="employee@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Account Password</span>
                  <span className="text-[10px] text-blue-400 font-semibold">MFA Enabled</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="••••••••••••"
                    required
                  />
                  <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-full mt-2"
              >
                <span>Verify Company Email & Continue</span>
                <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-4 mb-6">
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/50 text-xs text-blue-300 flex items-center gap-3">
                <Smartphone size={24} className="text-blue-400 shrink-0" />
                <div>
                  <p className="font-bold text-slate-100">Microsoft Authenticator / SMS OTP Required</p>
                  <p className="text-[11px] text-slate-300">Enter 6-digit authentication code sent to your registered device for {email}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  6-Digit MFA Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 font-mono tracking-widest text-center text-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="123456"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('CREDENTIALS')}
                  className="btn btn-secondary btn-md flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-md flex-1"
                >
                  {isLoading ? 'Issuing JWT Session...' : 'Authenticate & Issue JWT Token'}
                </button>
              </div>
            </form>
          )}

          <div className="border-t border-slate-800 pt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield size={14} className="text-blue-400" /> Select Role Demo Profile (5-Tier Hierarchy):
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setStep('MFA');
                    switchRole(account.role);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-left transition-all flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-3">
                    <span className="badge badge-info text-[10px] uppercase font-bold">
                      {account.role}
                    </span>
                    <div>
                      <p className="font-bold text-slate-100">{account.label}</p>
                      <p className="text-[10px] text-slate-400">{account.name} • {account.level}</p>
                    </div>
                  </div>
                  <CheckCircle2 size={18} className="text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
