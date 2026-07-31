import React, { useState } from 'react';
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
  HelpCircle,
  Sun,
  Moon,
  Globe,
  Maximize2,
  Minimize2,
  RotateCw,
  User as UserIcon,
  Settings,
  Briefcase,
  Activity,
  KeyRound,
  LogOut,
  ChevronDown,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface EnterpriseHeaderProps {
  onToggleSidebar: () => void;
}

export const EnterpriseHeader: React.FC<EnterpriseHeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout, switchRole, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const availableRoles = Object.values(Role);
  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Spanish' },
    { code: 'FR', name: 'French' },
    { code: 'DE', name: 'German' },
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleRoleChange = (newRole: Role) => {
    switchRole(newRole);
    setRoleDropdownOpen(false);

    switch (newRole) {
      case Role.ADMIN: navigate('/admin'); break;
      case Role.HR: navigate('/hr'); break;
      case Role.TEAM_MANAGER: navigate('/manager'); break;
      case Role.TEAM_LEAD: navigate('/team-lead'); break;
      case Role.EMPLOYEE: navigate('/employee'); break;
    }
  };

  return (
    <header className="h-[60px] px-4 md:px-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between shadow-sm gap-3">
      {/* Left Section: Menu Toggle & Official STACKLY Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-[var(--bg-tertiary)] hover:text-slate-100 transition-colors"
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        {/* Official Stackly Logo */}
        <StacklyLogo size={28} showText={true} />
      </div>

      {/* Center Section: Compact Search Field with Internal Shortcut Badge */}
      <div className="hidden md:flex items-center max-w-[260px] lg:max-w-[320px] w-full mx-2">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees, departments..."
            className="w-full pl-9 pr-11 py-1.5 text-xs rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[#2563EB] transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-slate-400 bg-slate-800/20 px-1.5 py-0.5 rounded border border-slate-700/50 pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444] border border-[var(--bg-secondary)] animate-pulse" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 glass-panel py-3 px-4 shadow-2xl z-50 bg-[var(--bg-secondary)] border-[var(--border-color)] space-y-2.5">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#2563EB]" /> Notifications
                </span>
                <span className="badge badge-info">2 New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[var(--text-primary)]">
                  <p className="font-bold">Q2 Headcount Report Ready</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">HR Operations • 5m ago</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[var(--text-primary)]">
                  <p className="font-bold">Security Audit Verified</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">System Admin • 1h ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <button
          className="hidden sm:flex p-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-slate-100 transition-colors"
          title="Messages"
        >
          <MessageSquare size={16} />
        </button>

        {/* Help Center */}
        <button
          className="hidden sm:flex p-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-slate-100 transition-colors"
          title="Help Center"
        >
          <HelpCircle size={16} />
        </button>

        {/* Refresh Dashboard */}
        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-slate-100 transition-colors"
          title="Refresh Dashboard"
        >
          <RotateCw size={16} className={isRefreshing ? 'animate-spin text-[#2563EB]' : ''} />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex p-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-slate-100 transition-colors"
          title="Fullscreen Toggle"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Language Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:border-[#2563EB] transition-colors"
            title="Language"
          >
            <Globe size={14} className="text-[#06B6D4]" />
            <span>{selectedLang}</span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 glass-panel py-1.5 shadow-2xl z-50 bg-[var(--bg-secondary)] border-[var(--border-color)]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLang(lang.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors ${
                    selectedLang === lang.code ? 'font-bold text-[#2563EB]' : 'text-[var(--text-primary)]'
                  }`}
                >
                  <span>{lang.name}</span>
                  {selectedLang === lang.code && <CheckCircle2 size={14} className="text-[#2563EB]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-slate-100 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} className="text-[#F59E0B]" /> : <Moon size={16} className="text-[#2563EB]" />}
        </button>

        {/* Role Scope Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold hover:border-[#2563EB] transition-colors"
          >
            <span className={`badge ${getRoleBadgeClass(role)}`}>
              {ROLE_LABELS[role]}
            </span>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 glass-panel py-2 shadow-2xl z-50 bg-[var(--bg-secondary)] border-[var(--border-color)]">
              <div className="px-3 py-1 border-b border-[var(--border-color)] mb-1">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Switch Security Scope</p>
              </div>
              {availableRoles.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors ${
                    role === r ? 'font-black text-[#2563EB] bg-blue-500/10' : 'text-[var(--text-primary)]'
                  }`}
                >
                  <span>{ROLE_LABELS[r]}</span>
                  {role === r && <CheckCircle2 size={14} className="text-[#2563EB]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        {user && (
          <div className="relative border-l border-[var(--border-color)] pl-2">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-1.5 p-0.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <div className="relative">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#2563EB] shrink-0"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[var(--bg-secondary)]" />
              </div>
              <ChevronDown size={12} className="text-slate-400 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 glass-panel py-2 shadow-2xl z-50 bg-[var(--bg-secondary)] border-[var(--border-color)] text-xs">
                <div className="px-3 py-2 border-b border-[var(--border-color)]">
                  <p className="font-bold text-[var(--text-primary)]">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { navigate('/employee/profile'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[var(--bg-hover)] flex items-center gap-2 text-[var(--text-primary)]"
                  >
                    <UserIcon size={14} className="text-[#2563EB]" /> View Profile
                  </button>
                  <button
                    onClick={() => { navigate('/admin/settings'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[var(--bg-hover)] flex items-center gap-2 text-[var(--text-primary)]"
                  >
                    <Settings size={14} className="text-[#4F46E5]" /> My Settings
                  </button>
                  <button
                    onClick={() => { navigate('/admin/departments'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[var(--bg-hover)] flex items-center gap-2 text-[var(--text-primary)]"
                  >
                    <Briefcase size={14} className="text-[#06B6D4]" /> Organization
                  </button>
                  <button
                    onClick={() => { navigate('/admin/reports'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[var(--bg-hover)] flex items-center gap-2 text-[var(--text-primary)]"
                  >
                    <Activity size={14} className="text-[#22C55E]" /> Activity Log
                  </button>
                  <button
                    onClick={() => { navigate('/employee/profile'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[var(--bg-hover)] flex items-center gap-2 text-[var(--text-primary)]"
                  >
                    <KeyRound size={14} className="text-[#F59E0B]" /> Change Password
                  </button>
                </div>
                <div className="border-t border-[var(--border-color)] pt-1">
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-1.5 hover:bg-red-500/10 text-red-400 flex items-center gap-2 font-bold"
                  >
                    <LogOut size={14} /> Logout
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
