import React, { useState } from 'react';
import { Bell, Sparkles, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Q2 Headcount Report Ready', subtitle: 'HR Operations', time: '5m ago', path: '/hr/reports', read: false },
    { id: '2', title: 'Security Audit Verified', subtitle: 'System Governance', time: '1h ago', path: '/admin/audit-logs', read: false },
    { id: '3', title: 'Leave Approvals Queue', subtitle: '3 Pending Requests', time: '2h ago', path: '/manager/approvals', read: true },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="View Notifications"
        className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-[var(--text-primary)] transition-all hover:scale-105 relative"
      >
        <Bell size={20} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-[var(--bg-secondary)] animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-secondary)] border border-[var(--border-color)] py-3 px-4 shadow-2xl z-50 rounded-2xl space-y-3 text-[var(--text-primary)]">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <Sparkles size={16} className="text-blue-500" /> Notifications
            </span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1">
                <Check size={12} /> Mark Read
              </button>
            )}
          </div>
          <div className="space-y-2 text-xs max-h-64 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  setOpen(false);
                  navigate(n.path);
                }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  n.read
                    ? 'bg-[var(--bg-tertiary)]/50 border-[var(--border-color)] text-slate-400'
                    : 'bg-blue-500/10 border-blue-500/30 text-[var(--text-primary)] font-semibold'
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="font-bold">{n.title}</p>
                  <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{n.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
