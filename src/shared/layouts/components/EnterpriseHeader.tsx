import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useTheme } from '../../../design-system/theme/theme';
import { Role, ROLE_LABELS } from '../../../security/roles/roles';
import { getRoleBadgeClass } from '../../utils/helpers';
import { StacklyLogo } from '../../../components/common/StacklyLogo';
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  RotateCw,
  HelpCircle,
  User as UserIcon,
  Settings,
  Shield,
  Activity,
  LogOut,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  History
} from 'lucide-react';

interface EnterpriseHeaderProps {
  onToggleSidebar: () => void;
}

export const EnterpriseHeader: React.FC<EnterpriseHeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout, switchRole, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'profile' | 'role' | 'notif' | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const availableRoles = Object.values(Role);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchFocused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDropdown = (name: 'profile' | 'role' | 'notif') => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleRoleChange = (newRole: Role) => {
    switchRole(newRole);
    setActiveDropdown(null);

    switch (newRole) {
      case Role.ADMIN: navigate('/admin'); break;
      case Role.HR: navigate('/hr'); break;
      case Role.TEAM_MANAGER: navigate('/manager'); break;
      case Role.TEAM_LEAD: navigate('/team-lead'); break;
      case Role.EMPLOYEE: navigate('/employee'); break;
    }
  };

  const recentSearches = ['Engineering Headcount Q2', 'Q3 Performance Reviews', 'Sarah Jenkins Attendance'];

  return (
    <header className="h-[72px] px-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between gap-6 shadow-sm">
      {/* Left Section: Logo, Application Title, Subtitle, Hamburger Menu */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar Menu"
          className="p-2 rounded-xl text-slate-400 hover:bg-[var(--bg-tertiary)] hover:text-slate-100 transition-all hover:scale-105"
          title="Toggle Navigation Menu"
        >
          <Menu size={24} strokeWidth={2} />
        </button>

        <div className="flex items-center gap-3">
          <StacklyLogo size={32} showText={false} />
          <div className="flex flex-col justify-center">
            <h1 className="text-[24px] font-bold tracking-tight text-[var(--text-primary)] leading-tight font-sans">
              Workforce Analytics
            </h1>
            <p className="text-[13px] font-medium text-slate-400 leading-none mt-0.5 hidden sm:block">
              Enterprise Workforce Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* Center Section: Global Search Bar */}
      <div className="hidden lg:flex items-center max-w-[380px] w-full relative">
        <div className="relative w-full">
          <Search size={20} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Global Search"
            placeholder="Search employees, departments, reports..."
            className="w-full pl-10 pr-20 py-2 text-sm rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[#2563EB] shadow-inner transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded border border-slate-700/50 pointer-events-none">
            Ctrl + K
          </kbd>
        </div>

        {/* Auto-suggestions & Recent Searches Dropdown */}
        {searchFocused && (
          <div className="absolute left-0 right-0 top-full mt-2 glass-panel p-4 shadow-2xl z-50 bg-[var(--bg-secondary)] border-[var(--border-color)] rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <History size={16} strokeWidth={2} /> Recent Searches
              </span>
              <button
                onClick={() => setSearchFocused(false)}
                className="text-[10px] font-bold text-blue-400 hover:underline"
              >
                Close
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSearchQuery(s);
                    setSearchFocused(false);
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] text-slate-300 font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Section: Standardized Lucide Icons (20px) */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Dashboard Refresh Button */}
        <button
          onClick={handleRefresh}
          aria-label="Refresh Dashboard Data"
          className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-slate-100 transition-all hover:scale-105"
          title="Refresh Dashboard"
        >
          <RotateCw size={20} strokeWidth={2} className={isRefreshing ? 'animate-spin text-[#2563EB]' : ''} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('notif')}
            aria-label="View Notifications"
            className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-slate-100 transition-all hover:scale-105 relative"
            title="Notifications"
          >
            <Bell size={20} strokeWidth={2} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#EF4444] border-2 border-[var(--bg-secondary)] animate-pulse" />
          </button>

          {activeDropdown === 'notif' && (
            <div className="absolute right-0 mt-2 w-80 glass-panel py-3 px-4 shadow-2xl z-50 bg-[var(--bg-secondary)] border-[var(--border-color)] rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Sparkles size={16} strokeWidth={2} className="text-blue-400" /> Notifications
                </span>
                <span className="badge badge-info">2 New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[var(--text-primary)]">
                  <p className="font-bold">Q2 Headcount Report Ready</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">HR Operations • 5m ago</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[var(--text-primary)]">
                  <p className="font-bold">Security Audit Verified</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">System Admin • 1h ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <button
          aria-label="Open Messages"
          className="hidden sm:flex p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-slate-100 transition-all hover:scale-105"
          title="Messages"
        >
          <MessageSquare size={20} strokeWidth={2} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Light or Dark Theme"
          className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-slate-100 transition-all hover:scale-105"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun size={20} strokeWidth={2} className="text-[#F59E0B]" /> : <Moon size={20} strokeWidth={2} className="text-[#2563EB]" />}
        </button>

        {/* Help Center */}
        <button
          aria-label="Open Help Center"
          className="hidden sm:flex p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-slate-100 transition-all hover:scale-105"
          title="Help Center"
        >
          <HelpCircle size={20} strokeWidth={2} />
        </button>

        {/* Security Role Switcher Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => toggleDropdown('role')}
            aria-label="Switch Security Role Scope"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold hover:border-[#2563EB] transition-colors"
          >
            <span className={`badge ${getRoleBadgeClass(role)}`}>
              {ROLE_LABELS[role]}
            </span>
            <ChevronDown size={14} strokeWidth={2} className="text-slate-400" />
          </button>

          {activeDropdown === 'role' && (
            <div className="absolute right-0 mt-2 w-64 glass-panel py-2 shadow-2xl z-50 bg-[var(--bg-secondary)] border-[var(--border-color)] rounded-2xl">
              <div className="px-3.5 py-1.5 border-b border-[var(--border-color)] mb-1">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Switch Security Scope</p>
              </div>
              {availableRoles.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors ${
                    role === r ? 'font-black text-[#2563EB] bg-blue-500/10' : 'text-[var(--text-primary)]'
                  }`}
                >
                  <span>{ROLE_LABELS[r]}</span>
                  {role === r && <CheckCircle2 size={16} strokeWidth={2} className="text-[#2563EB]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown Menu */}
        {user && (
          <div className="relative border-l border-[var(--border-color)] pl-3">
            <button
              onClick={() => toggleDropdown('profile')}
              aria-label="User Profile Menu"
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <div className="relative">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#2563EB] shrink-0 shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[var(--bg-secondary)]" />
              </div>
              <ChevronDown size={14} strokeWidth={2} className="text-slate-400 hidden sm:block" />
            </button>

            {activeDropdown === 'profile' && (
              <div className="absolute right-0 mt-2 w-56 glass-panel py-2 shadow-2xl z-50 bg-[var(--bg-secondary)] border-[var(--border-color)] text-xs rounded-2xl">
                <div className="px-4 py-3 border-b border-[var(--border-color)]">
                  <p className="font-bold text-sm text-[var(--text-primary)]">{user.name}</p>
                  <p className="text-[11px] text-slate-400">{user.email}</p>
                  <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase">{ROLE_LABELS[role]}</p>
                </div>

                <div className="py-1.5 space-y-0.5 font-medium">
                  <button
                    onClick={() => { navigate('/employee/profile'); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-hover)] flex items-center gap-2.5 text-[var(--text-primary)]"
                  >
                    <UserIcon size={20} strokeWidth={2} className="text-[#2563EB]" /> View Profile
                  </button>
                  <button
                    onClick={() => { navigate('/admin/settings'); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-hover)] flex items-center gap-2.5 text-[var(--text-primary)]"
                  >
                    <Settings size={20} strokeWidth={2} className="text-[#4F46E5]" /> My Settings
                  </button>
                  <button
                    onClick={() => { navigate('/admin/roles'); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-hover)] flex items-center gap-2.5 text-[var(--text-primary)]"
                  >
                    <Shield size={20} strokeWidth={2} className="text-[#F59E0B]" /> Security
                  </button>
                  <button
                    onClick={() => { navigate('/admin/reports'); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-hover)] flex items-center gap-2.5 text-[var(--text-primary)]"
                  >
                    <Activity size={20} strokeWidth={2} className="text-[#22C55E]" /> Activity Log
                  </button>
                </div>

                <div className="border-t border-[var(--border-color)] pt-1.5">
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      navigate('/logout');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-500/10 text-rose-400 flex items-center gap-2.5 font-bold"
                  >
                    <LogOut size={20} strokeWidth={2} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
