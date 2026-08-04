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

const data = [
  { month: 'Sep', revenue: 30, sales: 20 },
  { month: 'Oct', revenue: 24, sales: 10 },
  { month: 'Nov', revenue: 36, sales: 22 },
  { month: 'Dec', revenue: 30, sales: 26 },
  { month: 'Jan', revenue: 45, sales: 12 },
  { month: 'Feb', headcount: 34, revenue: 34, sales: 21 },
  { month: 'Mar', revenue: 52, sales: 36 },
  { month: 'Apr', revenue: 42, sales: 20 },
  { month: 'May', revenue: 48, sales: 44 },
  { month: 'Jun', revenue: 31, sales: 21 },
  { month: 'Jul', revenue: 38, sales: 30 },
  { month: 'Aug', revenue: 50, sales: 44 },
];

export const WorkforceGrowthLine: React.FC = () => {
  return (
    <div className="w-full h-[280px] min-h-[280px] pt-2">
      <ResponsiveContainer width="100%" height={280} minWidth={200} minHeight={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
          />
          <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" dot={{ r: 4, fill: '#3B82F6' }} />
          <Area type="monotone" dataKey="sales" name="Total Sales" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" dot={{ r: 4, fill: '#06B6D4' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
