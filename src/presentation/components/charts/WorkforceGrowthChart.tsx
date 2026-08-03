import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ReusableChartContainer } from './ReusableChartContainer';

export interface GrowthPoint {
  label: string;
  value: number;
}

const defaultData: GrowthPoint[] = [
  { label: 'Jan', value: 920 },
  { label: 'Feb', value: 980 },
  { label: 'Mar', value: 1040 },
  { label: 'Apr', value: 1120 },
  { label: 'May', value: 1190 },
  { label: 'Jun', value: 1248 },
];

interface Props {
  data?: GrowthPoint[];
}

export const WorkforceGrowthChart: React.FC<Props> = ({ data = defaultData }) => {
  return (
    <ReusableChartContainer
      title="Workforce Growth Trend"
      subtitle="Total active headcount progression (YTD)"
      badgeText="+35.6% YTD"
      badgeVariant="cyan"
    >
      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="growthGradReuse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
              formatter={(val: any) => [`${val} Headcount`, 'Active Staff']}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Active Staff"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#growthGradReuse)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ReusableChartContainer>
  );
};
