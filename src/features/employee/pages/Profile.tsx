import React from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { Mail, Briefcase, Building, Shield, Calendar } from 'lucide-react';
import { getRoleBadgeClass } from '../../../shared/utils/helpers';

export const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Employee Profile</h2>
        <p className="text-sm text-slate-400">View personal details, security credentials, and active permissions</p>
      </div>

      <div className="glass-panel p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-800 pb-8">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/50 shadow-xl"
          />
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <p className="text-sm text-slate-400">{user?.title}</p>
            <div className="pt-2">
              <span className={`badge ${getRoleBadgeClass(user?.role || '')}`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 text-sm">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Email Address</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Building size={18} className="text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Department</p>
              <p className="font-semibold">{user?.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase size={18} className="text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Employee Code</p>
              <p className="font-semibold font-mono">WFA-1005</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Join Date</p>
              <p className="font-semibold">Feb 1, 2023</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 mt-8">
          <h4 className="text-sm font-bold flex items-center gap-2 mb-3">
            <Shield size={16} className="text-emerald-400" />
            Granted RBAC Permissions
          </h4>
          <div className="flex flex-wrap gap-2">
            {user?.permissions.map((perm) => (
              <span key={perm} className="text-[11px] font-mono bg-slate-800 border border-slate-700/80 px-2.5 py-1 rounded text-slate-300">
                {perm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
