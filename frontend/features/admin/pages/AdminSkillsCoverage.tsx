import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { ShieldAlert, BookOpen, AlertTriangle } from 'lucide-react';

export const AdminSkillsCoverage: React.FC = () => {
  const gaps = [
    { id: 'gap-1', skill: 'Cloud Architecture (AWS)', index: '40% Gap Index', priority: 'HIGH' },
    { id: 'gap-2', skill: 'Kubernetes/Docker', index: '35% Gap Index', priority: 'MEDIUM' },
    { id: 'gap-3', skill: 'AI/Machine Learning', index: '50% Gap Index', priority: 'HIGH' },
  ];

  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <BookOpen size={24} className="text-indigo-400" />
            Skills Coverage & Gap Analysis
          </h2>
          <p className="text-sm text-slate-400">Identify critical talent shortage gaps and schedule developer trainings.</p>
        </div>

        <div className="glass-panel p-6">
          <div className="space-y-4">
            {gaps.map((gap) => (
              <div key={gap.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-100">{gap.skill}</h4>
                  <p className="text-xs text-rose-400 font-semibold mt-1">{gap.index}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${gap.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {gap.priority} PRIORITY
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
