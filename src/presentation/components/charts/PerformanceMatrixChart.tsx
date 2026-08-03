import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ReusableChartContainer } from './ReusableChartContainer';

export interface PerformancePoint {
  name: string;
  score: number;
  target: number;
}

const defaultData: PerformancePoint[] = [
  { name: 'Engineering', score: 94, target: 90 },
  { name: 'Product', score: 92, target: 88 },
  { name: 'Sales', score: 88, target: 85 },
  { name: 'HR Ops', score: 95, target: 90 },
  { name: 'Support', score: 89, target: 85 },
];

interface Props {
  data?: PerformancePoint[];
}

export const PerformanceMatrixChart: React.FC<Props> = ({ data = defaultData }) => {
  return (
    <ReusableChartContainer
      title="Department Performance Matrix"
      subtitle="Quarterly KPI achievement score vs target benchmark"
      badgeText="91.6% Avg Score"
      badgeVariant="purple"
    >
      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
              formatter={(val: any) => [`${val}%`, 'Score']}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
            <Bar dataKey="score" name="Achieved KPI %" fill="#6366f1" radius={[6, 6, 0, 0]} />
            <Bar dataKey="target" name="Target Benchmark %" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ReusableChartContainer>
  );
};
