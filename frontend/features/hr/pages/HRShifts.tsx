import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Clock, Sliders, Calendar } from 'lucide-react';

export const HRShifts: React.FC = () => {
  const [shifts] = useState([
    { id: 'sh-1', name: 'Regular Shift', start: '09:00 AM', end: '06:00 PM', grace: 15 },
    { id: 'sh-2', name: 'Overnight Shift', start: '09:00 PM', end: '06:00 AM', grace: 15 },
  ]);

  return (
    <RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Clock size={24} className="text-amber-400" />
            Shift Scheduling
          </h2>
          <p className="text-sm text-slate-400">Configure corporate shift windows and calendar rosters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shifts.map((s) => (
            <div key={s.id} className="glass-panel p-6 space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-100">{s.name}</h3>
                <p className="text-xs text-slate-400 mt-1">Roster: {s.start} - {s.end}</p>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-800 pt-4">
                <span className="text-slate-400">Grace Limit: {s.grace} mins</span>
                <span className="text-emerald-400 font-bold">Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
};
