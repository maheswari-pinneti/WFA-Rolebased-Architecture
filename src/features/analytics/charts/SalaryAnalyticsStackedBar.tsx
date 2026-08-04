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
  { dept: 'Engineering', Junior: 4500, Mid: 8200, Senior: 12500 },
  { dept: 'HR Dept', Junior: 3200, Mid: 5800, Senior: 9200 },
  { dept: 'Finance', Junior: 3800, Mid: 6900, Senior: 10800 },
  { dept: 'Marketing', Junior: 3100, Mid: 5400, Senior: 8900 },
  { dept: 'Operations', Junior: 2900, Mid: 4800, Senior: 7800 },
];

export const SalaryAnalyticsStackedBar: React.FC = () => {
  return (
    <div className="w-full h-[280px] min-h-[280px] flex flex-col justify-between pt-2 font-sans">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-extrabold text-white">Department Salary Payroll Matrix</h3>
          <p className="text-xs text-slate-400">Horizontal tier breakdown (Junior, Mid, Senior Level)</p>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          $4.8M Budget
        </span>
      </div>

      <div className="w-full h-[220px] min-h-[220px]">
        <ResponsiveContainer width="100%" height={220} minWidth={200} minHeight={220}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis dataKey="dept" type="category" stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
              formatter={(value: any) => [`$${value}`, 'Avg Salary']}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
            <Bar dataKey="Junior" stackId="a" fill="#6366F1" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Mid" stackId="a" fill="#06B6D4" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Senior" stackId="a" fill="#3B82F6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
