import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { History, ShieldAlert, Download, Search, Filter, Terminal } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const AuditLogsPage: React.FC = () => {
  const [logs] = useState([
    { id: 'log-101', timestamp: '2026-08-02 22:45:12', actor: 'Admin (David Sterling)', role: 'ADMIN', action: 'UPDATE_ROLE_PERMISSIONS', target: 'Role: MANAGER', ip: '192.168.1.45', status: 'SUCCESS' },
    { id: 'log-102', timestamp: '2026-08-02 21:12:04', actor: 'Elena Rostova', role: 'HR', action: 'EXPORT_PAYROLL_REPORT', target: 'Report: Q2 Payroll', ip: '10.0.4.12', status: 'SUCCESS' },
    { id: 'log-103', timestamp: '2026-08-02 19:30:50', actor: 'Unknown Actor', role: 'UNKNOWN', action: 'FAILED_LOGIN_ATTEMPT', target: 'User: admin@corp.com', ip: '185.220.101.5', status: 'FAILURE' },
    { id: 'log-104', timestamp: '2026-08-02 18:15:22', actor: 'Marcus Vance', role: 'MANAGER', action: 'APPROVE_LEAVE_REQUEST', target: 'Emp: Alex Mercer', ip: '172.16.0.8', status: 'SUCCESS' },
    { id: 'log-105', timestamp: '2026-08-02 16:04:11', actor: 'System Auto-Job', role: 'SYSTEM', action: 'DATABASE_BACKUP_COMPLETED', target: 'Cluster: Primary-DB', ip: '127.0.0.1', status: 'SUCCESS' },
  ]);

  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <History className="text-amber-400" size={24} />
              Enterprise Security Audit Log Trail
            </h2>
            <p className="text-sm text-slate-400">
              Immutable forensic log stream tracking all authentication, RBAC policy edits, and data accesses.
            </p>
          </div>
          <Button variant="secondary" className="flex items-center gap-2">
            <Download size={16} /> Export Audit Log (.CSV)
          </Button>
        </div>

        {/* Audit Log Table */}
        <div className="glass-panel p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action Triggered</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-100">{log.actor}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-indigo-300">{log.action}</td>
                    <td className="py-3 px-4 text-slate-400">{log.target}</td>
                    <td className="py-3 px-4 text-slate-400">{log.ip}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          log.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {log.status}
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
