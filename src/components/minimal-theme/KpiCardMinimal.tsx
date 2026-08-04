import React from 'react';

export interface KpiCardMinimalProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  variant?: 'green' | 'blue' | 'yellow' | 'red';
}

export const KpiCardMinimal: React.FC<KpiCardMinimalProps> = ({
  title,
  value,
  icon,
  variant = 'blue',
}) => {
  const variantClasses = {
    green: 'pastel-green',
    blue: 'pastel-blue',
    yellow: 'pastel-yellow',
    red: 'pastel-red',
  };

  return (
    <div className="minimal-kpi-card">
      <div className={`minimal-icon-badge ${variantClasses[variant]}`}>
        {icon}
      </div>

      <div className="text-right space-y-0.5">
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
        <p className="text-xs font-semibold text-slate-400">{title}</p>
      </div>
    </div>
  );
};
