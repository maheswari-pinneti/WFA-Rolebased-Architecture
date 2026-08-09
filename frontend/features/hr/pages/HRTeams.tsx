import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Users, UserPlus, Check } from 'lucide-react';

export const HRTeams: React.FC = () => {
  const [teams] = useState([
    { id: 'team-1', name: 'Frontend Tech', lead: 'Marcus Vance', count: 12, dept: 'Engineering' },
    { id: 'team-2', name: 'Backend Services', lead: 'David Sterling', count: 18, dept: 'Engineering' },
    { id: 'team-3', name: 'Compensation Ops', lead: 'Elena Rostova', count: 6, dept: 'Human Resources' },
  ]);

  return (
    <RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Users size={24} className="text-blue-400" />
            Functional Teams Structure
          </h2>
          <p className="text-sm text-slate-400">Manage collaborative divisions, reporting hierarchies, and project teams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teams.map((t) => (
            <div key={t.id} className="glass-panel p-6 space-y-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-100">{t.name}</h3>
                <span className="text-[10px] bg-slate-800 text-indigo-400 px-2 py-0.5 rounded-full mt-1.5 inline-block">{t.dept}</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1.5 border-t border-slate-800 pt-4">
                <div className="flex justify-between"><span>Lead:</span> <strong className="text-slate-100 font-bold">{t.lead}</strong></div>
                <div className="flex justify-between"><span>Members:</span> <strong className="text-slate-100 font-bold">{t.count} staff</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
};
