import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Network, ShieldAlert, Award, ChevronRight, Briefcase, Users, GitFork } from 'lucide-react';

interface OrgNodeProps {
  title: string;
  name: string;
  role: string;
  dept?: string;
}

const OrgNode: React.FC<OrgNodeProps> = ({ title, name, role, dept }) => (
  <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex flex-col items-center text-center space-y-1.5 shadow-lg max-w-xs w-full hover:border-indigo-500/50 transition-all">
    <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center border border-indigo-500/20">
      <Briefcase size={20} />
    </div>
    <div>
      <h4 className="font-extrabold text-sm text-slate-100">{name}</h4>
      <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold mt-0.5">{title}</p>
      <p className="text-[11px] text-slate-400 mt-1">{role}</p>
      {dept && <p className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full mt-1.5 inline-block">{dept}</p>}
    </div>
  </div>
);

export const OrganizationHierarchy: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <GitFork className="text-indigo-400" size={24} />
            Enterprise Organization Hierarchy
          </h2>
          <p className="text-sm text-slate-400">
            Interactive enterprise reporting lines, administrative clearance levels, and department structures.
          </p>
        </div>

        {/* Hierarchy Visualization */}
        <div className="glass-panel p-8 flex flex-col items-center space-y-8 overflow-x-auto min-w-full">
          {/* Level 1: CEO / Executive Admin */}
          <div className="flex flex-col items-center">
            <OrgNode title="System Administrator" name="Sarah Connor" role="ADMIN (Level 5)" dept="Executive" />
            <div className="w-0.5 h-8 bg-slate-800 my-2"></div>
          </div>

          {/* Level 2: HRVP / Dept Managers */}
          <div className="flex flex-wrap justify-center gap-8 relative w-full max-w-4xl">
            <div className="flex flex-col items-center">
              <OrgNode title="VP of HR Operations" name="Elena Rostova" role="HR (Level 4)" dept="Human Resources" />
            </div>

            <div className="flex flex-col items-center">
              <OrgNode title="Department Manager" name="David Sterling" role="MANAGER (Level 3)" dept="Engineering" />
            </div>
          </div>

          <div className="w-full max-w-2xl flex items-center justify-around my-2">
            <div className="w-0.5 h-8 bg-slate-800"></div>
            <div className="w-0.5 h-8 bg-slate-800"></div>
          </div>

          {/* Level 3: Team Lead / Lead Developers */}
          <div className="flex flex-wrap justify-center gap-8 w-full max-w-4xl">
            <div className="flex flex-col items-center">
              <OrgNode title="Team Lead" name="Marcus Vance" role="TEAM_LEAD (Level 2)" dept="Engineering" />
            </div>
            
            <div className="flex flex-col items-center">
              <OrgNode title="Full Stack Developer" name="Alex Mercer" role="EMPLOYEE (Level 1)" dept="Engineering" />
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
