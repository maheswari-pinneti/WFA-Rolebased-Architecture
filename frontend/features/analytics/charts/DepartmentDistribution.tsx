import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { useDepartmentAccess } from '../../../hooks/useDepartmentAccess';

const allDepartmentsData = [
  { id: 'D002', name: 'Engineering', value: 450, color: '#6366f1' },
  { id: 'D004', name: 'Marketing', value: 320, color: '#06b6d4' },
  { id: 'D005', name: 'Operations', value: 188, color: '#10b981' },
  { id: 'D003', name: 'Finance', value: 180, color: '#a855f7' },
  { id: 'D001', name: 'HR', value: 110, color: '#f59e0b' },
];

export const DepartmentDistribution: React.FC = () => {
  const { canAccessDepartment } = useDepartmentAccess();

  const filteredData = allDepartmentsData.filter((dep) =>
    canAccessDepartment(dep.id) || canAccessDepartment(dep.name)
  );

  const totalHeadcount = filteredData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="glass-panel p-6 min-h-[360px] flex flex-col justify-between font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-[var(--text-primary)]">Department Distribution (DBAC Protected)</h3>
          <p className="text-xs text-slate-400">Workforce ratio across authorized department scopes</p>
        </div>
        <span className="badge badge-primary text-xs">{totalHeadcount} Allowed Headcount</span>
      </div>

      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <PieChart>
            <Pie
              data={filteredData.length > 0 ? filteredData : [{ name: 'Restricted', value: 1, color: '#64748b' }]}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }}
              formatter={(val: any) => [`${val} employees`, 'Allocation']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
