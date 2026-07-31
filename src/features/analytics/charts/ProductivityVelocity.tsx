import React from 'react';

export const ProductivityVelocity: React.FC = () => {
  const sprintData = [
    { sprint: 'Sprint 21', pointsCompleted: 82, target: 80 },
    { sprint: 'Sprint 22', pointsCompleted: 88, target: 85 },
    { sprint: 'Sprint 23', pointsCompleted: 91, target: 85 },
    { sprint: 'Sprint 24', pointsCompleted: 95, target: 90 },
    { sprint: 'Sprint 25', pointsCompleted: 98, target: 90 },
  ];

  const maxPoints = 110;

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold">Sprint Velocity & Story Points</h3>
          <p className="text-xs text-slate-400">Bi-weekly engineering throughput trend</p>
        </div>
        <span className="badge badge-success">+18% Velocity</span>
      </div>

      <div className="h-44 flex items-end justify-between gap-4 pt-6 px-2">
        {sprintData.map((item, idx) => {
          const heightPercent = (item.pointsCompleted / maxPoints) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.pointsCompleted} pts
              </span>
              <div className="w-full bg-slate-800 rounded-t-md relative overflow-hidden flex items-end h-32">
                <div
                  className="w-full bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-t-md transition-all duration-500 group-hover:brightness-125"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 font-semibold">{item.sprint}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
