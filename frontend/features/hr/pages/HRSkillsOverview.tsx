import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Award, Code, Database } from 'lucide-react';

export const HRSkillsOverview: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Award size={24} className="text-purple-400" />
            Skills Matrix Overview
          </h2>
          <p className="text-sm text-slate-400">Track general competencies, developer skills mapping, and top languages.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><Code size={20} /></div>
            <div>
              <h4 className="font-bold text-slate-100">Top Technology</h4>
              <p className="text-xs text-slate-400 mt-1">React/TypeScript (92% Coverage)</p>
            </div>
          </div>

          <div className="glass-panel p-6 flex items-start gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl"><Database size={20} /></div>
            <div>
              <h4 className="font-bold text-slate-100">Database Administration</h4>
              <p className="text-xs text-slate-400 mt-1">SQL/Databases (78% Coverage)</p>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
