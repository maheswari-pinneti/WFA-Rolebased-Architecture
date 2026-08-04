import React from 'react';
import { ArrowUp } from 'lucide-react';

export const OrdersTimeline: React.FC = () => {
  const items = [
    { title: '$2,400, Design changes', time: '22 DEC 7:20 PM', color: 'bg-emerald-500' },
    { title: 'New order #1832412', time: '21 DEC 11 PM', color: 'bg-rose-500' },
    { title: 'Server payments for April', time: '21 DEC 9:34 PM', color: 'bg-blue-500' },
    { title: 'New card added for order #4395132', time: '20 DEC 2:20 AM', color: 'bg-amber-500' },
  ];

  return (
    <div className="material-panel-card space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-extrabold text-slate-800">Orders overview</h3>
        <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <ArrowUp size={14} className="text-emerald-500 font-bold" />
          <span><strong>24%</strong> this month</span>
        </p>
      </div>

      <div className="space-y-4 pt-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${item.color} mt-1 shrink-0 shadow-sm`} />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-800">{item.title}</p>
              <p className="text-[10px] text-slate-400 font-mono font-medium">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
