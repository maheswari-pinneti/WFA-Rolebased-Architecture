import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  { name: 'Low Risk (Stable)', value: 1120, color: '#10b981' },
  { name: 'Medium Risk (Monitor)', value: 98, color: '#f59e0b' },
  { name: 'High Risk (Action Needed)', value: 30, color: '#ef4444' },
];

export const AttritionDonut: React.FC = () => {
  return (
    <div className="glass-panel p-6 min-h-[340px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-100">Attrition & Retention Risk</h3>
          <p className="text-xs text-slate-400">Workforce turnover prediction donut chart</p>
        </div>
        <span className="badge badge-success">1.2% Risk Score</span>
      </div>

      <div className="w-full h-[250px]">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#f8fafc' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
