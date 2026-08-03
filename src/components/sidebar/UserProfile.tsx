import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { ROLE_LABELS } from '../../security/roles/roles';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  collapsed?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ collapsed }) => {
  const { user, role, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="p-3 border-b border-[var(--border-color)] relative">
      <div
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-3 p-2 rounded-xl bg-[var(--bg-tertiary)]/60 hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] cursor-pointer transition-all ${
          collapsed ? 'justify-center p-1.5' : ''
        }`}
      >
        <div className="relative shrink-0">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 shadow-sm"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--bg-secondary)]" />
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{ROLE_LABELS[role]}</p>
            <p className="text-[9.5px] font-semibold text-purple-400 truncate">
              {user.department || 'Engineering Department'}
            </p>
          </div>
        )}

        {!collapsed && <ChevronDown size={14} className="text-slate-400 shrink-0" />}
      </div>

      {/* Profile Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute left-3 right-3 top-full mt-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-2 shadow-2xl z-50 rounded-xl space-y-1 text-xs text-[var(--text-primary)]">
          <button
            onClick={() => {
              setDropdownOpen(false);
              navigate('/employee/profile');
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center gap-2"
          >
            <User size={14} className="text-blue-500" /> View Profile
          </button>
          <button
            onClick={() => {
              setDropdownOpen(false);
              navigate('/admin/settings');
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center gap-2"
          >
            <Settings size={14} className="text-indigo-500" /> Account Settings
          </button>
          <div className="border-t border-[var(--border-color)] pt-1">
            <button
              onClick={() => {
                setDropdownOpen(false);
                logout();
                navigate('/login');
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-500 font-bold flex items-center gap-2"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
