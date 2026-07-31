import React from 'react';

export const DepartmentDistribution: React.FC = () => {
  const departments = [
    { name: 'Engineering', count: 450, percentage: 36, color: 'bg-indigo-500' },
    { name: 'Sales & Growth', count: 320, percentage: 26, color: 'bg-cyan-500' },
    { name: 'Customer Success', count: 188, percentage: 15, color: 'bg-emerald-500' },
    { name: 'Product Management', count: 180, percentage: 14, color: 'bg-purple-500' },
    { name: 'HR & Operations', count: 110, percentage: 9, color: 'bg-amber-500' },
  ];

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold">Department Headcount Allocation</h3>
          <p className="text-xs text-slate-400">Workforce ratio across functional divisions</p>
        </div>
        <span className="text-xs font-semibold text-indigo-400">1,248 Total</span>
      </div>

      <div className="h-4 w-full rounded-full bg-slate-800 flex overflow-hidden my-6">
        {departments.map((d, i) => (
          <div
            key={i}
            className={`${d.color} h-full transition-all duration-500`}
            style={{ width: `${d.percentage}%` }}
            title={`${d.name}: ${d.count} (${d.percentage}%)`}
          />
        ))}
      </div>

      <div className="space-y-2.5">
        {departments.map((d, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${d.color}`} />
              <span className="font-semibold text-slate-200">{d.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-mono">{d.count} headcount</span>
              <span className="font-bold text-slate-100">{d.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
