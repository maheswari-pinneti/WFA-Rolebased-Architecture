import React from 'react';

export const PerformanceChart: React.FC = () => {
  const departments = [
    { name: 'Engineering', score: 94, target: 90 },
    { name: 'Product Management', score: 92, target: 88 },
    { name: 'Sales & Growth', score: 88, target: 85 },
    { name: 'Human Resources', score: 95, target: 90 },
    { name: 'Customer Success', score: 89, target: 85 },
  ];

  return (
    <div className="glass-panel p-6 space-y-4">
      <div>
        <h3 className="text-base font-bold">Department Performance Matrix</h3>
        <p className="text-xs text-slate-400">Quarterly KPI achievement vs targets</p>
      </div>

      <div className="space-y-4 pt-2">
        {departments.map((dept, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">{dept.name}</span>
              <span className="text-indigo-400 font-bold">{dept.score}% Achieved</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${dept.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
