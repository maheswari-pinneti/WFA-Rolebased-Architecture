import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  { month: 'Q1-W1', score: 84, benchmark: 80 },
  { month: 'Q1-W2', score: 87, benchmark: 80 },
  { month: 'Q1-W3', score: 89, benchmark: 82 },
  { month: 'Q1-W4', score: 91, benchmark: 85 },
  { month: 'Q2-W1', score: 94, benchmark: 85 },
  { month: 'Q2-W2', score: 96, benchmark: 88 },
];

export const PerformanceAreaChart: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[360px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-[var(--text-primary)]">Employee Performance Score</h3>
          <p className="text-xs text-slate-400">Quarterly KPI achievement velocity vs benchmark</p>
        </div>
        <span className="badge badge-success text-xs">96% Index Rating</span>
      </div>

      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} domain={[70, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }} />
            <Area type="monotone" dataKey="score" name="Performance Score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPerf)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
