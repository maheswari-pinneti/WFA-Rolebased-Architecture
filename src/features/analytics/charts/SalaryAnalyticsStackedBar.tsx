import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  { dept: 'Eng', Junior: 4500, Mid: 8200, Senior: 12500 },
  { dept: 'HR', Junior: 3200, Mid: 5800, Senior: 9200 },
  { dept: 'Finance', Junior: 3800, Mid: 6900, Senior: 10800 },
  { dept: 'Marketing', Junior: 3100, Mid: 5400, Senior: 8900 },
  { dept: 'Ops', Junior: 2900, Mid: 4800, Senior: 7800 },
];

export const SalaryAnalyticsStackedBar: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[360px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-[var(--text-primary)]">Salary Analytics</h3>
          <p className="text-xs text-slate-400">Compensation distribution by tier across departments ($ USD)</p>
        </div>
        <span className="badge badge-primary text-xs">$4.8M Total Budget</span>
      </div>

      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="dept" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }}
              formatter={(value: any) => [`$${value}`, 'Avg Salary']}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }} />
            <Bar dataKey="Junior" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Mid" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Senior" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
