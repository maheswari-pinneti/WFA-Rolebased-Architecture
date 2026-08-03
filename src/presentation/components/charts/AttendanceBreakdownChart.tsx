import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ReusableChartContainer } from './ReusableChartContainer';

export interface AttendanceStatusPoint {
  name: string;
  value: number;
  color: string;
}

const defaultData: AttendanceStatusPoint[] = [
  { name: 'Present in Office', value: 64, color: '#10b981' },
  { name: 'Remote / WFH', value: 28, color: '#6366f1' },
  { name: 'Approved Leave', value: 5, color: '#f59e0b' },
  { name: 'Unexcused / Absent', value: 3, color: '#ef4444' },
];

interface Props {
  data?: AttendanceStatusPoint[];
}

export const AttendanceBreakdownChart: React.FC<Props> = ({ data = defaultData }) => {
  return (
    <ReusableChartContainer
      title="Daily Workforce Status Breakdown"
      subtitle="Real-time attendance & shift location distribution"
      badgeText="92% Active Duty"
      badgeVariant="emerald"
    >
      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
              formatter={(val: any) => [`${val}%`, 'Workforce Ratio']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: '11px', color: '#cbd5e1', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ReusableChartContainer>
  );
};
