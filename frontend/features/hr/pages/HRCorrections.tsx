import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const HRCorrections: React.FC = () => {
  const [corrections] = useState([
    { id: 'corr-1', employee: 'Alex Mercer', date: '2026-08-09', reason: 'Mobile app crash on startup', requested: '09:00 AM' },
  ]);

  return (
    <RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <ShieldCheck size={24} className="text-emerald-400" />
            Corrections Register
          </h2>
          <p className="text-sm text-slate-400">Review, approve, or reject attendance corrections requests.</p>
        </div>

        <div className="glass-panel p-6">
          <div className="space-y-4">
            {corrections.map((corr) => (
              <div key={corr.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="font-bold text-slate-100">{corr.employee}</span>
                  <p className="text-xs text-slate-400 mt-1">Requested check-in: {corr.requested} on {corr.date}</p>
                  <p className="text-xs text-slate-400 mt-1 italic">"{corr.reason}"</p>
                </div>
                <div className="flex gap-2">
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
