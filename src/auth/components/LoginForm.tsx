import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role, ROLE_LABELS, ROLE_CATEGORIES } from '../../security/roles/roles';
import { StacklyLogo } from '../../components/common/StacklyLogo';
import { KeyRound, AlertCircle, ArrowRight, CheckCircle2, Shield } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('admin@company.com');
  const { login, isLoading, error, switchRole } = useAuth();

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  const demoAccounts = [
    { role: Role.ADMIN, email: 'admin@company.com', name: 'Sarah Connor', label: 'Admin (Complete Access)', level: 'Level 0 • Org Level Scope' },
    { role: Role.HR, email: 'hr@company.com', name: 'Elena Rostova', label: 'HR (Workforce Management)', level: 'Level 1 • Entire Organization' },
    { role: Role.MANAGER, email: 'manager@company.com', name: 'David Sterling', label: 'Manager (Department & Team)', level: 'Level 2 • Department Scope' },
    { role: Role.TEAM_LEAD, email: 'lead@company.com', name: 'Marcus Vance', label: 'Team Lead (TL Operational)', level: 'Level 3 • Direct Reports Scope' },
    { role: Role.EMPLOYEE, email: 'employee@company.com', name: 'Alex Mercer', label: 'Employee (Self Service)', level: 'Level 4 • Self Data Only' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="p-4 rounded-2xl bg-blue-900/30 border border-blue-500/30 shadow-2xl mb-4">
            <StacklyLogo size={48} showText={false} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Stackly Workforce Intelligence</h1>
          <p className="text-xs text-slate-400 mt-1">Enterprise RBAC Security Portal (5 Core Hierarchy Roles)</p>
        </div>

        <div className="glass-panel p-8 backdrop-blur-xl bg-slate-900/90 border-slate-800 shadow-2xl rounded-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            <KeyRound size={20} className="text-blue-400" />
            Sign in to Enterprise Workspace
          </h2>

          {error && (
            <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleCustomLogin} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Corporate Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="name@company.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg w-full"
            >
              {isLoading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-slate-800 pt-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield size={14} className="text-blue-400" /> Select Role Demo Profile (5 Core Hierarchy):
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {demoAccounts.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    login(account.email);
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
