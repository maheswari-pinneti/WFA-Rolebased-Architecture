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
  { month: 'Jan', headcount: 920, target: 900 },
  { month: 'Feb', headcount: 980, target: 950 },
  { month: 'Mar', headcount: 1040, target: 1000 },
  { month: 'Apr', headcount: 1120, target: 1050 },
  { month: 'May', headcount: 1190, target: 1120 },
  { month: 'Jun', headcount: 1248, target: 1200 },
];

export const WorkforceTrendLine: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-100">Workforce Trend</h3>
          <p className="text-xs text-slate-400">Monthly headcount growth & forecast line chart</p>
        </div>
        <span className="badge badge-success">+35.6% YTD</span>
      </div>

      <div className="w-full h-[250px] min-h-[250px]">
        <ResponsiveContainer width="100%" height={250} minWidth={200} minHeight={250}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey="headcount"
              name="Active Headcount"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 5, fill: '#3b82f6' }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Hiring Plan"
              stroke="#06b6d4"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
