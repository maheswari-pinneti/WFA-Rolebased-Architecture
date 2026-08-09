import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Users, Plus, Shield, Edit3, Trash2, Check, UserCheck } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

interface Team {
  id: string;
  name: string;
  department: string;
  lead: string;
  membersCount: number;
  status: string;
}

export const TeamsManagement: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    { id: 'team-1', name: 'Frontend Team', department: 'Engineering & Technology', lead: 'Marcus Vance', membersCount: 12, status: 'ACTIVE' },
    { id: 'team-2', name: 'Backend Services', department: 'Engineering & Technology', lead: 'David Sterling', membersCount: 18, status: 'ACTIVE' },
    { id: 'team-3', name: 'People Operations', department: 'Human Resources & Talent', lead: 'Elena Rostova', membersCount: 6, status: 'ACTIVE' },
    { id: 'team-4', name: 'UI/UX Design Group', department: 'Product & UX Design', lead: 'Sarah Connor', membersCount: 8, status: 'ACTIVE' },
    { id: 'team-5', name: 'Enterprise Core Sales', department: 'Enterprise Sales', lead: 'Alex Mercer', membersCount: 14, status: 'ACTIVE' },
  ]);

  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <Users className="text-blue-400" size={24} />
              Enterprise Teams Management
            </h2>
            <p className="text-sm text-slate-400">
              Create, configure, and monitor functional teams, lead assignments, and department memberships.
            </p>
          </div>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={16} /> Create New Team
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-5 border-l-4 border-blue-500">
            <div className="text-xs font-semibold text-slate-400">Total Active Teams</div>
            <div className="text-2xl font-black mt-1">{teams.length} Teams</div>
          </div>
          <div className="glass-panel p-5 border-l-4 border-indigo-500">
            <div className="text-xs font-semibold text-slate-400">Average Team Size</div>
            <div className="text-2xl font-black mt-1">11.6 Members</div>
          </div>
          <div className="glass-panel p-5 border-l-4 border-emerald-500">
            <div className="text-xs font-semibold text-slate-400">Assigned Team Leads</div>
            <div className="text-2xl font-black mt-1">{teams.filter(t => t.lead).length} Leads</div>
          </div>
        </div>

        {/* Team List Table */}
        <div className="glass-panel p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/40 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Team Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Team Lead</th>
                  <th className="py-3 px-4">Headcount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {teams.map((team) => (
                  <tr key={team.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-4 font-bold text-slate-100 flex items-center gap-2">
                      <Users size={16} className="text-blue-400" />
                      {team.name}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{team.department}</td>
                    <td className="py-3 px-4 font-medium text-slate-200 flex items-center gap-1.5">
                      <UserCheck size={14} className="text-indigo-400" />
                      {team.lead}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-300">{team.membersCount} Members</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Check size={10} /> {team.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Button variant="ghost" size="sm"><Edit3 size={14} /></Button>
                      <Button variant="ghost" size="sm" className="text-rose-400"><Trash2 size={14} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
