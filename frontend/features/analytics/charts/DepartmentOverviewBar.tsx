import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  { department: 'Engineering', count: 480, budget: 500 },
  { department: 'Product', count: 180, budget: 200 },
  { department: 'HR & Ops', count: 120, budget: 130 },
  { department: 'Sales & Mktg', count: 290, budget: 300 },
  { department: 'Support', count: 178, budget: 180 },
];

export const DepartmentOverviewBar: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-100">Department Overview</h3>
          <p className="text-xs text-slate-400">Headcount distribution vs budgeted seats bar chart</p>
        </div>
        <span className="badge badge-info">6 Departments</span>
      </div>

      <div className="w-full h-[250px] min-h-[250px]">
        <ResponsiveContainer width="100%" height={250} minWidth={200} minHeight={250}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="department" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Bar dataKey="count" name="Current Staff" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="budget" name="Approved Seats" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
