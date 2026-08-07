import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  { name: 'On-Site Office', value: 780, color: '#3b82f6' },
  { name: 'Remote Workspace', value: 340, color: '#06b6d4' },
  { name: 'Hybrid Flex', value: 128, color: '#10b981' },
];

export const EmployeeDistributionPie: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-100">Employee Distribution</h3>
          <p className="text-xs text-slate-400">Work mode & location pie chart</p>
        </div>
        <span className="badge badge-manager">Workplace Mode</span>
      </div>

      <div className="w-full h-[250px] min-h-[250px]">
        <ResponsiveContainer width="100%" height={250} minWidth={200} minHeight={250}>
          <PieChart>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={75}
              dataKey="value"
              nameKey="name"
              label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
