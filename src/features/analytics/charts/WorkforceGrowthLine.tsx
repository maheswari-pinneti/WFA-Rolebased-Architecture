import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  { month: 'Jan', headcount: 980, target: 950 },
  { month: 'Feb', headcount: 1020, target: 1000 },
  { month: 'Mar', headcount: 1080, target: 1050 },
  { month: 'Apr', headcount: 1120, target: 1100 },
  { month: 'May', headcount: 1190, target: 1150 },
  { month: 'Jun', headcount: 1248, target: 1200 },
];

export const WorkforceGrowthLine: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[360px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-[var(--text-primary)]">Workforce Growth Trend</h3>
          <p className="text-xs text-slate-400">Monthly headcount scaling vs projected hiring target</p>
        </div>
        <span className="badge badge-success text-xs">+27.3% Annual Growth</span>
      </div>

      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }} />
            <Line type="monotone" dataKey="headcount" name="Actual Headcount" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="target" name="Target Plan" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
