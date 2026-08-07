import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { AnalyticsChartContainer } from '../../../components/common/AnalyticsChartContainer';

interface WorkforceGrowthLineProps {
  data?: Array<{ name: string; headcount: number; hiring: number }>;
  isLoading?: boolean;
  error?: string | null;
}

export const WorkforceGrowthLine: React.FC<WorkforceGrowthLineProps> = ({
  data = [],
  isLoading = false,
  error = null
}) => {
  const isEmpty = !data || data.length === 0;

  return (
    <AnalyticsChartContainer
      title="Workforce Growth & Hiring Trend"
      subtitle="Monthly analysis of headcount expansion and recruitment metrics"
      isLoading={isLoading}
      error={error}
      isEmpty={isEmpty}
    >
      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHeadcount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorHiring" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
            />
            <Area type="monotone" dataKey="headcount" name="Total Headcount" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorHeadcount)" dot={{ r: 4, fill: '#3B82F6' }} />
            <Area type="monotone" dataKey="hiring" name="New Hires" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorHiring)" dot={{ r: 4, fill: '#06B6D4' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsChartContainer>
  );
};
