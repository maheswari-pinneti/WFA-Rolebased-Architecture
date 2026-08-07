import React from 'react';
import { FileText, Plus, CheckCircle2, Clock } from 'lucide-react';

export const EmployeeRequestsPage: React.FC = () => {
  const requests = [
    { id: 'REQ-501', title: 'Vacation Leave (3 Days)', date: 'Aug 10 - Aug 13', status: 'PENDING' },
    { id: 'REQ-490', title: 'Remote Work Week', date: 'Jul 15 - Jul 20', status: 'APPROVED' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <span className="badge badge-success mb-1">Employee Self Service</span>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
            My Self-Service Requests & Submissions
          </h1>
          <p className="text-xs text-slate-400">
            Submit leave requests, expense reimbursements, and remote work permissions.
          </p>
        </div>
        <button className="btn btn-primary btn-sm flex items-center gap-2">
          <Plus size={14} /> Submit New Request
        </button>
      </div>

      {/* Request History */}
      <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
        <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
          <FileText size={18} className="text-amber-400" /> Submitted Request History
        </h3>

        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-[10px] text-slate-400">{r.id}</span>
                <h4 className="font-bold text-sm text-[var(--text-primary)]">{r.title}</h4>
                <p className="text-xs text-slate-400">{r.date}</p>
              </div>
              <span className={`badge ${r.status === 'APPROVED' ? 'badge-success' : 'badge-info'} text-[10px] uppercase font-bold`}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
