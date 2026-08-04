import React from 'react';
import { Check } from 'lucide-react';

export const ProjectsTable: React.FC = () => {
  const projects = [
    {
      name: 'Material UI XD Version',
      budget: '$14,000',
      progress: 60,
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      ],
    },
    {
      name: 'Add Progress Track',
      budget: '$3,000',
      progress: 100,
      avatars: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      ],
    },
    {
      name: 'Fix Platform Errors',
      budget: 'Not set',
      progress: 100,
      avatars: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      ],
    },
    {
      name: 'Launch Redesign App',
      budget: '$20,500',
      progress: 100,
      avatars: [
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100',
      ],
    },
  ];

  return (
    <div className="material-panel-card space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-800">Projects</h3>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Check size={14} className="text-emerald-500 font-bold" />
            <span><strong>30 done</strong> this month</span>
          </p>
        </div>
      </div>

      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            <th className="pb-3">Companies</th>
            <th className="pb-3">Members</th>
            <th className="pb-3">Budget</th>
            <th className="pb-3">Completion</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {projects.map((p, idx) => (
            <tr key={idx} className="hover:bg-slate-50/50">
              <td className="py-3.5 font-bold text-slate-800">{p.name}</td>
              <td className="py-3.5">
                <div className="flex items-center">
                  {p.avatars.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="w-6 h-6 rounded-full border-2 border-white object-cover -ml-2 first:ml-0 shadow-sm"
                    />
                  ))}
                </div>
              </td>
              <td className="py-3.5 font-bold text-slate-700">{p.budget}</td>
              <td className="py-3.5">
                <div className="space-y-1">
                  <span className="font-extrabold text-blue-600">{p.progress}%</span>
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
