import React from 'react';

export const SkillMatrixChart: React.FC = () => {
  const skills = [
    { name: 'TypeScript / React Frontend', proficiency: 94, certifiedCount: 320 },
    { name: 'Node.js Microservices / Go', proficiency: 88, certifiedCount: 240 },
    { name: 'Cloud Infra / Kubernetes', proficiency: 85, certifiedCount: 190 },
    { name: 'AI / Data Intelligence', proficiency: 78, certifiedCount: 110 },
    { name: 'Cybersecurity & RBAC Compliance', proficiency: 96, certifiedCount: 380 },
  ];

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold">Workforce Skill & Capability Index</h3>
          <p className="text-xs text-slate-400">Technical competency level distribution across teams</p>
        </div>
        <span className="badge badge-info">Level 4 Target</span>
      </div>

      <div className="space-y-3.5 pt-2">
        {skills.map((s, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-200">{s.name}</span>
              <span className="text-cyan-400 font-bold">{s.proficiency}% Competency</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${s.proficiency}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
