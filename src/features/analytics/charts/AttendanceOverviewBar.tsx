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
  { day: 'Mon', present: 1180, remote: 48, leave: 20 },
  { day: 'Tue', present: 1205, remote: 30, leave: 13 },
  { day: 'Wed', present: 1210, remote: 25, leave: 13 },
  { day: 'Thu', present: 1195, remote: 38, leave: 15 },
  { day: 'Fri', present: 1150, remote: 78, leave: 20 },
];

export const AttendanceOverviewBar: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[360px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-[var(--text-primary)]">Attendance Overview</h3>
          <p className="text-xs text-slate-400">Daily present vs remote WFH vs authorized leaves</p>
        </div>
        <span className="badge badge-primary text-xs">96.8% Weekly Avg</span>
      </div>

      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }} />
            <Bar dataKey="present" name="In-Office" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="remote" name="Remote WFH" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="leave" name="On Leave" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
