import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface WorkforceTrendProps {
  data?: { label: string; value: number }[];
}

export const WorkforceTrend: React.FC<WorkforceTrendProps> = ({
  data = [
    { label: 'Jan', value: 920 },
    { label: 'Feb', value: 980 },
    { label: 'Mar', value: 1040 },
    { label: 'Apr', value: 1120 },
    { label: 'May', value: 1190 },
    { label: 'Jun', value: 1248 },
  ]
}) => {
  return (
    <div className="glass-panel p-6 min-h-[360px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">Workforce Growth Trend</h3>
          <p className="text-xs text-slate-400">Total active headcount progression (YTD)</p>
        </div>
        <span className="badge badge-success text-xs">+35.6% YTD Growth</span>
      </div>

      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
              formatter={(val: any) => [`${val} Headcount`, 'Active Staff']}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Active Staff"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#growthGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
