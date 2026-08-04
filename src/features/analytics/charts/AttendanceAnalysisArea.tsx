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
  { day: 'Mon', Present: 14850, Absent: 320, Leave: 250 },
  { day: 'Tue', Present: 14920, Absent: 280, Leave: 220 },
  { day: 'Wed', Present: 15100, Absent: 180, Leave: 140 },
  { day: 'Thu', Present: 15020, Absent: 210, Leave: 190 },
  { day: 'Fri', Present: 14780, Absent: 380, Leave: 260 },
];

export const AttendanceAnalysisArea: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[360px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-[var(--text-primary)]">Attendance Analysis</h3>
          <p className="text-xs text-slate-400">Daily workforce attendance (Present vs Absent vs Authorized Leave)</p>
        </div>
        <span className="badge badge-success text-xs">96.5% Average Rate</span>
      </div>

      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 16000]} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }} />
            <Area type="monotone" dataKey="Present" stroke="#10b981" fillOpacity={1} fill="url(#colorPresent)" strokeWidth={3} />
            <Area type="monotone" dataKey="Absent" stroke="#ef4444" fillOpacity={1} fill="url(#colorAbsent)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
