import React from 'react';

export interface KpiCardMaterialProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  badgeVariant?: 'dark' | 'blue' | 'green' | 'pink';
}

export const KpiCardMaterial: React.FC<KpiCardMaterialProps> = ({
  title,
  value,
  trend,
  icon,
  badgeVariant = 'blue',
}) => {
  const badgeClasses = {
    dark: 'bg-badge-dark',
    blue: 'bg-badge-blue',
    green: 'bg-badge-green',
    pink: 'bg-badge-pink',
  };

  return (
    <div className="material-kpi-card">
      <div className={`material-badge-icon ${badgeClasses[badgeVariant]}`}>
        {icon}
      </div>

      <div className="text-right space-y-0.5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
      </div>

      <div className="border-t border-slate-100 mt-4 pt-2.5 text-xs text-slate-400">
        <span className="font-bold text-emerald-500">{trend}</span>
      </div>
    </div>
  );
};
