import React from 'react';

interface WorkforceTrendProps {
  data?: { label: string; value: number }[];
}

export const WorkforceTrend: React.FC<WorkforceTrendProps> = ({
  data = [
    { label: 'Jan', value: 920 },
    { label: 'Feb', value: 980 },
    { label: 'Mar', value: 1040 },
    { label: 'Apr', value: 1120 },
    { label: 'May', value: 1190 },
    { label: 'Jun', value: 1248 },
  ]
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold">Workforce Growth Trend</h3>
          <p className="text-xs text-slate-400">Total active headcount progression</p>
        </div>
        <span className="badge badge-success">+35.6% YTD</span>
      </div>

      <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
        {data.map((item, idx) => {
          const heightPercent = (item.value / maxValue) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="text-[10px] font-semibold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value}
              </div>
              <div className="w-full bg-slate-800 rounded-t-md relative overflow-hidden flex items-end h-36">
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-md transition-all duration-500 group-hover:brightness-125"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 font-medium">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
