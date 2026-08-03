import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ReusableChartContainer } from './ReusableChartContainer';

export interface DepartmentDataPoint {
  name: string;
  value: number;
  color: string;
}

const defaultData: DepartmentDataPoint[] = [
  { name: 'Engineering', value: 450, color: '#6366f1' },
  { name: 'Sales & Growth', value: 320, color: '#06b6d4' },
  { name: 'Customer Success', value: 188, color: '#10b981' },
  { name: 'Product Management', value: 180, color: '#a855f7' },
  { name: 'HR & Operations', value: 110, color: '#f59e0b' },
];

interface Props {
  data?: DepartmentDataPoint[];
}

export const DepartmentDistributionChart: React.FC<Props> = ({ data = defaultData }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <ReusableChartContainer
      title="Department Headcount Allocation"
      subtitle="Workforce ratio across functional organization divisions"
      badgeText={`${total.toLocaleString()} Headcount`}
      badgeVariant="blue"
    >
      <div className="w-full h-[260px] min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={200} minHeight={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
              formatter={(val: any) => [`${val} employees`, 'Allocation']}
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
