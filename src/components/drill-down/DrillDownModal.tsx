import React from 'react';
import { X, Sparkles, TrendingUp, ShieldCheck, Activity, Layers } from 'lucide-react';

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  metricValue: string;
  details: string[];
}

export const DrillDownModal: React.FC<DrillDownModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  metricValue,
  details,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{category}</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{title}</h3>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        {/* Metric Highlight */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400">Current Metric Score</p>
            <h2 className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-0.5">{metricValue}</h2>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <TrendingUp size={14} />
            <span>+12.4% vs SLA</span>
          </div>
        </div>

        {/* Details Breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Detailed Insight Breakdown</p>
          <div className="space-y-2">
            {details.map((detail, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <Activity size={15} className="text-blue-500 shrink-0 mt-0.5" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/20"
        >
          Close Detail Overlay
        </button>
      </div>
    </div>
  );
};
