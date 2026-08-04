import React, { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { ROLE_LABELS } from '../../security/roles/roles';
import { User, Settings, LogOut, ChevronDown, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LogoutModal } from '../../auth/components/LogoutModal';

interface UserProfileProps {
  collapsed?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ collapsed }) => {
  const { user, role, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="p-3 border-b border-[var(--border-color)] relative font-sans">
      <div
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 cursor-pointer transition-all ${
          collapsed ? 'justify-center p-1.5' : ''
        }`}
      >
        <div className="relative shrink-0">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow-md"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-sm" />
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0 space-y-0.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-white truncate">{user.name || 'John Doe'}</p>
              <span className="flex items-center gap-1 text-[9.5px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
              </span>
            </div>
            <p className="text-[10px] font-bold text-blue-400 truncate">{user.title || ROLE_LABELS[role] || 'HR Manager'}</p>
            <p className="text-[9.5px] font-medium text-slate-400 truncate">
              {user.department || 'Human Resources'}
            </p>
          </div>
        )}

        {!collapsed && <ChevronDown size={14} className="text-slate-400 shrink-0" />}
      </div>

      {/* Profile Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute left-3 right-3 top-full mt-2 bg-slate-900 border border-slate-700/80 p-2 shadow-2xl z-50 rounded-2xl space-y-1 text-xs text-slate-100 animate-fadeIn">
          <button
            onClick={() => {
              setDropdownOpen(false);
              navigate('/profile');
            }}
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 font-medium"
          >
            <User size={14} className="text-blue-400" /> View Profile
          </button>
          <button
            onClick={() => {
              setDropdownOpen(false);
              navigate('/settings');
            }}
            className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 font-medium"
          >
            <Settings size={14} className="text-indigo-400" /> Settings
          </button>
          <div className="border-t border-slate-800 pt-1">
            <button
              onClick={() => {
                setDropdownOpen(false);
                setShowLogoutModal(true);
              }}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 font-bold flex items-center gap-2"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirmLogout={handleConfirmLogout}
      />
    </div>
  );
};
