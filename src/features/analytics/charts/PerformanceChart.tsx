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
  { name: 'Engineering', score: 94, target: 90 },
  { name: 'Product', score: 92, target: 88 },
  { name: 'Sales', score: 88, target: 85 },
  { name: 'HR Ops', score: 95, target: 90 },
  { name: 'Support', score: 89, target: 85 },
];

export const PerformanceChart: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[360px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">Department Performance Matrix</h3>
          <p className="text-xs text-slate-400">Quarterly KPI achievement score vs target benchmark</p>
        </div>
        <span className="badge badge-success text-xs">91.6% Avg Score</span>
      </div>

      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
              formatter={(val: any) => [`${val}%`, 'KPI Rate']}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
            <Bar dataKey="score" name="Achieved KPI %" fill="#6366f1" radius={[6, 6, 0, 0]} />
            <Bar dataKey="target" name="Target Benchmark %" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
