import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const data = [
  { name: 'TypeScript / React', proficiency: 94 },
  { name: 'Node.js / Go Services', proficiency: 88 },
  { name: 'Cloud & K8s Infra', proficiency: 85 },
  { name: 'Data Intelligence', proficiency: 78 },
  { name: 'Security & RBAC', proficiency: 96 },
];

export const SkillMatrixChart: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[360px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100">Workforce Skill & Capability Index</h3>
          <p className="text-xs text-slate-400">Technical competency proficiency score by domain</p>
        </div>
        <span className="badge badge-info text-xs">Level 4 Target</span>
      </div>

      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[0, 100]} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={120} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
              formatter={(val: any) => [`${val}%`, 'Proficiency']}
            />
            <Bar dataKey="proficiency" name="Competency Score" fill="#06b6d4" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
