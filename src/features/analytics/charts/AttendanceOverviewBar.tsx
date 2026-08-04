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
  { day: 'M', sales: 44, revenue: 12 },
  { day: 'T', sales: 55, revenue: 22 },
  { day: 'W', sales: 41, revenue: 20 },
  { day: 'T', sales: 67, revenue: 8 },
  { day: 'F', sales: 22, revenue: 12 },
  { day: 'S', sales: 43, revenue: 26 },
  { day: 'S', sales: 65, revenue: 14 },
];

export const AttendanceOverviewBar: React.FC = () => {
  return (
    <div className="w-full h-[260px] min-h-[260px]">
      <ResponsiveContainer width="100%" height={260} minWidth={180} minHeight={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={14}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }}
          />
          <Bar dataKey="sales" name="Sales" stackId="a" fill="#1D4ED8" radius={[0, 0, 0, 0]} />
          <Bar dataKey="revenue" name="Revenue" stackId="a" fill="#38BDF8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
