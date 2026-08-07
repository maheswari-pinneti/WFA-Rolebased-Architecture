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
  { sprint: 'Sprint 21', pointsCompleted: 82, target: 80 },
  { sprint: 'Sprint 22', pointsCompleted: 88, target: 85 },
  { sprint: 'Sprint 23', pointsCompleted: 91, target: 85 },
  { sprint: 'Sprint 24', pointsCompleted: 95, target: 90 },
  { sprint: 'Sprint 25', pointsCompleted: 98, target: 90 },
];

export const ProductivityVelocity: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[360px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">Sprint Velocity & Story Points</h3>
          <p className="text-xs text-slate-400">Bi-weekly team throughput & story point completion trend</p>
        </div>
        <span className="badge badge-success text-xs">+18% Velocity</span>
      </div>

      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="sprint" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
              formatter={(val: any) => [`${val} pts`, 'Story Points']}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
            <Bar dataKey="pointsCompleted" name="Completed Points" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            <Bar dataKey="target" name="Sprint Commitment" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
