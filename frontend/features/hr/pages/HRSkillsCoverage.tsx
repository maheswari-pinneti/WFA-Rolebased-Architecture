import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { BookOpen } from 'lucide-react';

export const HRSkillsCoverage: React.FC = () => {
  const gaps = [
    { id: 'gap-1', skill: 'Cloud Architecture (AWS)', index: '40% Gap Index' },
    { id: 'gap-2', skill: 'Kubernetes/Docker', index: '35% Gap Index' },
  ];

  return (
    <RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <BookOpen size={24} className="text-indigo-400" />
            Skills Coverage Analysis
          </h2>
          <p className="text-sm text-slate-400">Map competencies and developer gap indices across departments.</p>
        </div>

        <div className="glass-panel p-6">
          <div className="space-y-4">
            {gaps.map((gap) => (
              <div key={gap.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-100">{gap.skill}</h4>
                  <p className="text-xs text-rose-400 font-semibold mt-1">{gap.index}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
