import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  badgeText,
  badgeVariant = 'blue',
  children,
}) => {
  const getBadgeClass = () => {
    switch (badgeVariant) {
      case 'emerald':
        return 'badge-success';
      case 'amber':
        return 'badge-warning';
      case 'rose':
        return 'badge-danger';
      case 'purple':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/30';
      default:
        return 'badge-primary';
    }
  };

  return (
    <div className="glass-panel p-6 min-h-[360px] flex flex-col justify-between font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-[var(--text-primary)]">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {badgeText && <span className={`badge text-xs ${getBadgeClass()}`}>{badgeText}</span>}
      </div>

      <div className="w-full flex-1">{children}</div>
    </div>
  );
};
