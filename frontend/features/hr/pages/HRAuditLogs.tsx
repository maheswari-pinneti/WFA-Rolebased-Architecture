import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { ListFilter, Shield } from 'lucide-react';

export const HRAuditLogs: React.FC = () => {
  const [logs] = useState([
    { id: 'l-1', user: 'hr@thestackly.com', action: 'ROLE_UPDATE', details: 'Updated user Alex Mercer to EMPLOYEE', time: '2026-08-09T18:00:00Z' },
    { id: 'l-2', user: 'hr@thestackly.com', action: 'LEAVE_APPROVE', details: 'Approved leave for employee usr-emp-01', time: '2026-08-09T18:15:00Z' },
  ]);

  return (
    <RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Shield size={24} className="text-rose-400" />
            HR Audit Logs
          </h2>
          <p className="text-sm text-slate-400">Chronological history of administrative actions executed inside HR modules.</p>
        </div>

        <div className="glass-panel p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/40 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-4 font-bold text-slate-100">{l.user}</td>
                    <td className="py-3 px-4 font-mono text-xs text-rose-400 font-bold">{l.action}</td>
                    <td className="py-3 px-4 text-slate-300 text-xs">{l.details}</td>
                    <td className="py-3 px-4 text-slate-400 text-xs font-mono">{new Date(l.time).toLocaleString()}</td>
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
