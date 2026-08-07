import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  { metric: 'Work Culture', score: 92, target: 85 },
  { metric: 'Learning', score: 88, target: 85 },
  { metric: 'Performance', score: 94, target: 90 },
  { metric: 'Satisfaction', score: 90, target: 85 },
  { metric: 'Leadership', score: 86, target: 80 },
];

export const EmployeeEngagementRadar: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[360px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-[var(--text-primary)]">Employee Engagement Score</h3>
          <p className="text-xs text-slate-400">Quarterly engagement rating index across key organizational pillars</p>
        </div>
        <span className="badge badge-success text-xs">90% Engagement Score</span>
      </div>

      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="var(--border-color)" />
            <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={10} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
            <Radar name="Current Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
            <Radar name="Target Plan" dataKey="target" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeDasharray="4 4" />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
