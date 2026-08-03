import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ReusableChartContainer } from './ReusableChartContainer';

export interface SalaryBandPoint {
  band: string;
  employees: number;
}

const defaultData: SalaryBandPoint[] = [
  { band: '$60k - $80k', employees: 210 },
  { band: '$80k - $110k', employees: 420 },
  { band: '$110k - $140k', employees: 380 },
  { band: '$140k - $180k', employees: 178 },
  { band: '$180k+', employees: 60 },
];

interface Props {
  data?: SalaryBandPoint[];
}

export const SalaryAnalyticsChart: React.FC<Props> = ({ data = defaultData }) => {
  return (
    <ReusableChartContainer
      title="Salary & Compensation Analytics"
      subtitle="Compensation tier distribution across organization roles"
      badgeText="Payroll Ledger"
      badgeVariant="emerald"
    >
      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="band" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
              formatter={(val: any) => [`${val} staff`, 'Headcount in Band']}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
            <Bar dataKey="employees" name="Employees in Band" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ReusableChartContainer>
  );
};
