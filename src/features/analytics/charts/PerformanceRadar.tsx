import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  { subject: 'Code Quality', A: 94, B: 85 },
  { subject: 'Velocity', A: 98, B: 88 },
  { subject: 'SLA', A: 99, B: 90 },
  { subject: 'Collaboration', A: 92, B: 82 },
  { subject: 'Innovation', A: 89, B: 78 },
  { subject: 'Security', A: 100, B: 95 },
];

export const PerformanceRadar: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-100">Performance Analysis</h3>
          <p className="text-xs text-slate-400">Multi-dimensional capability & competency radar chart</p>
        </div>
        <span className="badge badge-purple">4.8 / 5.0 Rating</span>
      </div>

      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart cx="50%" cy="50%" outerRadius={75} data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Radar name="Org Average" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
            <Radar name="Benchmark SLA" dataKey="B" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
