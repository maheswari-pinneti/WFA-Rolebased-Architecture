import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  { quarter: 'Q1-W1', score: 84, benchmark: 80, target: 90 },
  { quarter: 'Q1-W2', score: 87, benchmark: 80, target: 90 },
  { quarter: 'Q1-W3', score: 89, benchmark: 82, target: 92 },
  { quarter: 'Q1-W4', score: 91, benchmark: 85, target: 95 },
  { quarter: 'Q2-W1', score: 94, benchmark: 85, target: 95 },
  { quarter: 'Q2-W2', score: 96, benchmark: 88, target: 98 },
];

export const PerformanceAreaChart: React.FC = () => {
  return (
    <div className="w-full h-[280px] min-h-[280px] flex flex-col justify-between pt-2 font-sans">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-base font-extrabold text-white">Quarterly Performance Composed Analysis</h3>
          <p className="text-xs text-slate-400">Actual KPI score (Bar) vs Target Target (Line)</p>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
          96% Target Achieved
        </span>
      </div>

      <div className="w-full h-[220px] min-h-[220px]">
        <ResponsiveContainer width="100%" height={220} minWidth={200} minHeight={220}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="quarter" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} domain={[70, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
            <Bar dataKey="score" name="Actual KPI Score" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
            <Line type="monotone" dataKey="target" name="Executive Target" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: '#F59E0B' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
