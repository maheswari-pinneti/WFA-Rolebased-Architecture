import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Building2, Plus, Edit, Users } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const HRDepartments: React.FC = () => {
  const [departments] = useState([
    { id: 'dept-1', name: 'Engineering & Technology', head: 'David Sterling', headcount: 142 },
    { id: 'dept-2', name: 'Human Resources', head: 'Elena Rostova', headcount: 28 },
    { id: 'dept-3', name: 'Product Management', head: 'Sarah Connor', headcount: 45 },
  ]);

  return (
    <RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <Building2 size={24} className="text-indigo-400" />
              Departments View
            </h2>
            <p className="text-sm text-slate-400">View business units hierarchy and cost center structures.</p>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/40 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Department Head</th>
                  <th className="py-3 px-4">Staff Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-4 font-bold text-slate-100">{dept.name}</td>
                    <td className="py-3 px-4 text-slate-300 font-medium">{dept.head}</td>
                    <td className="py-3 px-4 text-slate-200 font-semibold">{dept.headcount} Employees</td>
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
