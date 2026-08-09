import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Lock, Shield, Settings, Key } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const AdminAccessControl: React.FC = () => {
  const [policies] = useState([
    { id: 'pol-1', role: 'ADMIN', clearance: 5, override: 'Allowed (Global)', mfa: 'Enforced' },
    { id: 'pol-2', role: 'HR', clearance: 4, override: 'Department Specific', mfa: 'Enforced' },
    { id: 'pol-3', role: 'MANAGER', clearance: 3, override: 'Department Specific', mfa: 'Enforced' },
    { id: 'pol-4', role: 'TEAM_LEAD', clearance: 2, override: 'Team Specific', mfa: 'Optional' },
    { id: 'pol-5', role: 'EMPLOYEE', clearance: 1, override: 'Self Only', mfa: 'Optional' },
  ]);

  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <Lock size={24} className="text-rose-400" />
              Advanced Access Control Policies
            </h2>
            <p className="text-sm text-slate-400">Configure administrative clearance levels and security verification overrides.</p>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/40 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Role Code</th>
                  <th className="py-3 px-4">Clearance Rank</th>
                  <th className="py-3 px-4">Data Access Boundary</th>
                  <th className="py-3 px-4">MFA Enforced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-4 font-bold text-slate-100">{p.role}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">Level {p.clearance}</td>
                    <td className="py-3 px-4 text-slate-300">{p.override}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${p.mfa === 'Enforced' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400'}`}>
                        {p.mfa}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
