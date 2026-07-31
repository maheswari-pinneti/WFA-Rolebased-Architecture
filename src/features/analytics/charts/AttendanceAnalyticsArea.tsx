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
  { day: 'Mon', present: 1160, remote: 40 },
  { day: 'Tue', present: 1180, remote: 35 },
  { day: 'Wed', present: 1195, remote: 30 },
  { day: 'Thu', present: 1175, remote: 45 },
  { day: 'Fri', present: 1150, remote: 65 },
];

export const AttendanceAnalyticsArea: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-100">Attendance Analytics</h3>
          <p className="text-xs text-slate-400">Weekly shift attendance & leave trends area chart</p>
        </div>
        <span className="badge badge-success">98.2% Avg</span>
      </div>

      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="remoteGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Area
              type="monotone"
              dataKey="present"
              name="On-site Shift"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#presentGrad)"
            />
            <Area
              type="monotone"
              dataKey="remote"
              name="Approved Remote"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#remoteGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
