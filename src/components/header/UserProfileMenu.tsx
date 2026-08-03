import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { ROLE_LABELS } from '../../security/roles/roles';
import { getRoleBadgeClass } from '../../shared/utils/helpers';
import { User as UserIcon, Settings, Shield, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserProfileMenu: React.FC = () => {
  const { user, role, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="relative border-l border-[var(--border-color)] pl-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
      >
        <div className="relative">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 shrink-0 shadow-md"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--bg-secondary)]" />
        </div>
        <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-secondary)] border border-[var(--border-color)] py-2 shadow-2xl z-50 text-xs rounded-2xl text-[var(--text-primary)]">
          <div className="px-4 py-3 border-b border-[var(--border-color)]">
            <p className="font-bold text-sm text-[var(--text-primary)]">{user.name}</p>
            <p className="text-[11px] text-slate-400">{user.email}</p>
            <div className="mt-2">
              <span className={`badge ${getRoleBadgeClass(role)}`}>{ROLE_LABELS[role]}</span>
            </div>
          </div>

          <div className="py-1.5 space-y-0.5 font-medium">
            <button
              onClick={() => { setOpen(false); navigate('/employee/profile'); }}
              className="w-full text-left px-4 py-2 hover:bg-[var(--bg-tertiary)] flex items-center gap-2.5"
            >
              <UserIcon size={18} className="text-blue-500" /> View Profile
            </button>
            <button
              onClick={() => { setOpen(false); navigate('/admin/settings'); }}
              className="w-full text-left px-4 py-2 hover:bg-[var(--bg-tertiary)] flex items-center gap-2.5"
            >
              <Settings size={18} className="text-indigo-500" /> Account Settings
            </button>
            <button
              onClick={() => { setOpen(false); navigate('/admin/roles'); }}
              className="w-full text-left px-4 py-2 hover:bg-[var(--bg-tertiary)] flex items-center gap-2.5"
            >
              <Shield size={18} className="text-amber-500" /> Security Policy
            </button>
          </div>

          <div className="border-t border-[var(--border-color)] pt-1.5">
            <button
              onClick={() => { setOpen(false); logout(); navigate('/login'); }}
              className="w-full text-left px-4 py-2 hover:bg-rose-500/10 text-rose-500 flex items-center gap-2.5 font-bold"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
