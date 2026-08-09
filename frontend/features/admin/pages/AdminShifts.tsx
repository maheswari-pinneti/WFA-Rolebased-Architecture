import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Clock, Plus, Edit, ShieldAlert } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const AdminShifts: React.FC = () => {
  const [shifts] = useState([
    { id: 'shift-1', name: 'Regular Day Shift', time: '09:00 AM - 06:00 PM', grace: 15, active: true },
    { id: 'shift-2', name: 'Flexible Shift', time: '00:00 AM - 11:59 PM', grace: 0, active: true },
    { id: 'shift-3', name: 'Overnight Security', time: '09:00 PM - 06:00 AM', grace: 15, active: true },
  ]);

  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <Clock size={24} className="text-amber-400" />
              Shifts & Rosters Configuration
            </h2>
            <p className="text-sm text-slate-400">Configure corporate shift windows, rosters, and arrival grace periods.</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={16} /> Add Shift
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shifts.map((shift) => (
            <div key={shift.id} className="glass-panel p-6 space-y-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-100">{shift.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{shift.time}</p>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-800 pt-4">
                <span className="text-slate-400">Grace: {shift.grace} mins</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
};
