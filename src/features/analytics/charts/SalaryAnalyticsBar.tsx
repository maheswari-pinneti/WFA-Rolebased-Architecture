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
  { band: '$60k - $80k', employees: 210 },
  { band: '$80k - $110k', employees: 420 },
  { band: '$110k - $140k', employees: 380 },
  { band: '$140k - $180k', employees: 178 },
  { band: '$180k+', employees: 60 },
];

export const SalaryAnalyticsBar: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-100">Salary Analytics</h3>
          <p className="text-xs text-slate-400">Compensation tier distribution bar chart</p>
        </div>
        <span className="badge badge-hr">Compensation Overview</span>
      </div>

      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="band" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Bar dataKey="employees" name="Employees in Band" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
