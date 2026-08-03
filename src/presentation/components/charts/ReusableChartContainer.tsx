import React from 'react';
import { Download, Maximize2 } from 'lucide-react';

interface ReusableChartContainerProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeVariant?: 'blue' | 'purple' | 'emerald' | 'amber' | 'cyan' | 'rose';
  children: React.ReactNode;
  height?: number;
  onExport?: () => void;
}

export const ReusableChartContainer: React.FC<ReusableChartContainerProps> = ({
  title,
  subtitle,
  badgeText,
  badgeVariant = 'blue',
  children,
  onExport,
}) => {
  const badgeClasses = {
    blue: 'badge-info',
    purple: 'badge-purple',
    emerald: 'badge-success',
    amber: 'badge-warning',
    cyan: 'badge-cyan',
    rose: 'badge-rose',
  };

  return (
    <div className="glass-panel p-6 min-h-[360px] flex flex-col justify-between rounded-2xl border border-[var(--border-color)] shadow-lg transition-all duration-300 hover:border-blue-500/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-[var(--text-primary)] tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {badgeText && (
            <span className={`badge ${badgeClasses[badgeVariant]} text-xs px-2.5 py-1 font-semibold`}>
              {badgeText}
            </span>
          )}
          {onExport && (
            <button
              onClick={onExport}
              title="Export Chart Data"
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <Download size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="w-full flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
