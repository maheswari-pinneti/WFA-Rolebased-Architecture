import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { ShieldAlert, Award, ChevronRight, Check } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const AdminApprovals: React.FC = () => {
  const [approvals] = useState([
    { id: 'app-1', requester: 'Elena Rostova', type: 'SSO Config Change', details: 'Okta Identity integration update', date: '2026-08-08' },
    { id: 'app-2', requester: 'David Sterling', type: 'Geofence Expansion', details: 'Add additional BLR-RND coordinates', date: '2026-08-09' },
  ]);

  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <ShieldAlert size={24} className="text-indigo-400" />
            Admin Approvals Queue
          </h2>
          <p className="text-sm text-slate-400">Authorize configuration overrides, security boundaries, and high-clearance access.</p>
        </div>

        <div className="glass-panel p-6">
          <div className="space-y-4">
            {approvals.map((app) => (
              <div key={app.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="text-xs font-mono text-indigo-400">{app.type}</div>
                  <div className="font-bold text-slate-100 mt-1">{app.details}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Requested by {app.requester} on {app.date}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="flex items-center gap-1.5"><Check size={14} /> Authorize</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
