import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react';

export const ApprovalsPage: React.FC = () => {
  const [approvals, setApprovals] = useState([
    { id: 'REQ-101', employee: 'Alex Mercer', type: 'Annual Leave Request', duration: '3 Days (Aug 5 - Aug 8)', reason: 'Family vacation', date: '2 hours ago', status: 'PENDING' },
    { id: 'REQ-102', employee: 'Samantha Wu', type: 'Equipment Expense', duration: '$450.00', reason: 'Ergonomic Chair & Monitor Arm', date: '5 hours ago', status: 'PENDING' },
    { id: 'REQ-103', employee: 'Marcus Vance', type: 'Overtime Claim', duration: '12 Hours (Project Launch)', reason: 'Q3 Release Deployment', date: '1 day ago', status: 'APPROVED' },
    { id: 'REQ-104', employee: 'Rachel Kim', type: 'Remote Work Request', duration: '2 Weeks (Aug 15 - Aug 30)', reason: 'Relocation transition', date: '2 days ago', status: 'REJECTED' },
  ]);

  const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <span className="badge badge-manager mb-1">Manager & Leadership Desk</span>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Pending Approvals & Request Desk
          </h1>
          <p className="text-xs text-slate-400">
            Review and approve leave requests, expense claims, overtime hours, and remote work authorizations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold">
            2 Action Items Pending
          </span>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Clock size={18} className="text-amber-400" /> Active Team Approval Requests
          </h3>
        </div>

        <div className="space-y-3">
          {approvals.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400">{req.id}</span>
                  <span className="font-bold text-sm text-[var(--text-primary)]">{req.employee}</span>
                  <span className="badge badge-info text-[9px] uppercase">{req.type}</span>
                </div>
                <p className="text-xs text-slate-300">
                  <span className="font-semibold text-blue-400">{req.duration}</span> — {req.reason}
                </p>
                <p className="text-[10px] text-slate-400">Submitted {req.date}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {req.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleAction(req.id, 'APPROVED')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <CheckCircle2 size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'REJECTED')}
                      className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                ) : (
                  <span className={`badge ${req.status === 'APPROVED' ? 'badge-success' : 'badge-danger'} text-xs uppercase font-bold`}>
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
