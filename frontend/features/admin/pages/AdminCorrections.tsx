import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const AdminCorrections: React.FC = () => {
  const [corrections] = useState([
    { id: 'corr-1', employee: 'John Doe', date: '2026-08-04', type: 'Clock In Missed', note: 'Forgot to check-in on mobile app while starting remote work.', status: 'Pending' },
    { id: 'corr-2', employee: 'Jane Smith', date: '2026-08-05', type: 'Clock Out Adjustment', note: 'Session didn\'t stop due to local network timeout.', status: 'Pending' },
  ]);

  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <ShieldCheck size={24} className="text-emerald-400" />
            Attendance Corrections Requests
          </h2>
          <p className="text-sm text-slate-400">Review and authorize clock adjustments submitted by staff.</p>
        </div>

        <div className="glass-panel p-6">
          <div className="space-y-4">
            {corrections.map((corr) => (
              <div key={corr.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100">{corr.employee}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">{corr.date}</span>
                  </div>
                  <div className="text-xs text-indigo-400 font-semibold mt-1">{corr.type}</div>
                  <p className="text-xs text-slate-400 mt-2 max-w-xl">"{corr.note}"</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" className="text-emerald-400"><CheckCircle2 size={16} /> Approve</Button>
                  <Button variant="ghost" size="sm" className="text-rose-400"><XCircle size={16} /> Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
