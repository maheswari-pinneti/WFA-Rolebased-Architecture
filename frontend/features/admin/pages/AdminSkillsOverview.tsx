import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Award, Code, Database, Library } from 'lucide-react';

export const AdminSkillsOverview: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Award size={24} className="text-purple-400" />
            Skills Matrix Overview
          </h2>
          <p className="text-sm text-slate-400">Enterprise skills configuration and competence statistics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><Code size={20} /></div>
            <div>
              <h4 className="font-bold text-slate-100">Top Competency</h4>
              <p className="text-xs text-slate-400 mt-1">React/TypeScript (92% Coverage)</p>
            </div>
          </div>

          <div className="glass-panel p-6 flex items-start gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl"><Database size={20} /></div>
            <div>
              <h4 className="font-bold text-slate-100">Database & APIs</h4>
              <p className="text-xs text-slate-400 mt-1">SQL/Databases (78% Coverage)</p>
            </div>
          </div>

          <div className="glass-panel p-6 flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><Library size={20} /></div>
            <div>
              <h4 className="font-bold text-slate-100">Active Skills Mapped</h4>
              <p className="text-xs text-slate-400 mt-1">1,240 Skills across teams</p>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
