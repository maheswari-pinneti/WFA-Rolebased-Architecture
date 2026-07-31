import React from 'react';

export const AttendanceChart: React.FC = () => {
  const categories = [
    { label: 'Present in Office', percentage: 64, color: 'bg-emerald-500' },
    { label: 'Remote / WFH', percentage: 28, color: 'bg-indigo-500' },
    { label: 'Approved Leave', percentage: 5, color: 'bg-amber-500' },
    { label: 'Unexcused / Absent', percentage: 3, color: 'bg-red-500' },
  ];

  return (
    <div className="glass-panel p-6">
      <div className="mb-4">
        <h3 className="text-base font-bold">Daily Workforce Status Breakdown</h3>
        <p className="text-xs text-slate-400">Real-time attendance & location metrics</p>
      </div>

      <div className="h-4 w-full rounded-full bg-slate-800 flex overflow-hidden my-6">
        {categories.map((c, i) => (
          <div
            key={i}
            className={`${c.color} h-full transition-all duration-500`}
            style={{ width: `${c.percentage}%` }}
            title={`${c.label}: ${c.percentage}%`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((c, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${c.color}`} />
            <div>
              <p className="text-xs font-semibold text-slate-300">{c.label}</p>
              <p className="text-sm font-bold">{c.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
