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
  Sun,
  Moon,
  User as UserIcon,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  History,
  Filter,
  Layers,
  Building2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface EnterpriseHeaderProps {
  onToggleSidebar: () => void;
}

export const EnterpriseHeader: React.FC<EnterpriseHeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout, switchRole, role, permissions } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Search & Drill-Down Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchCategory, setSearchCategory] = useState<'all' | 'employees' | 'departments' | 'reports' | 'security'>('all');

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState<'profile' | 'role' | 'notif' | null>(null);

  // Drill-Down Scope State
  const [drillDownView, setDrillDownView] = useState<'roles' | 'departments' | 'permissions'>('roles');
  const [selectedDept, setSelectedDept] = useState<string>('Global Operations');
  const [showPermissionsPreview, setShowPermissionsPreview] = useState(false);

  const availableRoles = Object.values(Role);
  const departmentsList = [
    { id: 'eng', name: 'Engineering & Technology', code: 'ENG', head: 'David Sterling' },
    { id: 'hr', name: 'Human Resources & Talent', code: 'HR', head: 'Elena Rostova' },
    { id: 'prod', name: 'Product & UX Design', code: 'DES', head: 'Sarah Connor' },
    { id: 'ops', name: 'Global Operations', code: 'OPS', head: 'Marcus Vance' },
    { id: 'sales', name: 'Enterprise Sales', code: 'SALES', head: 'Alex Mercer' },
  ];

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
    setDrillDownView('roles');
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

  const recentSearches = [
    { query: 'Engineering Headcount Q2', category: 'reports' },
    { query: 'Q3 Performance Reviews', category: 'employees' },
    { query: 'Sarah Jenkins Attendance', category: 'employees' },
    { query: 'Security Policy Audit Log', category: 'security' },
  ];

  return (
    <header className="h-[72px] px-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between gap-6 shadow-sm">
      {/* Left Section: Logo, Application Title, Subtitle, Hamburger Menu */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar Menu"
          className="p-2 rounded-xl text-slate-400 hover:bg-[var(--bg-tertiary)] hover:text-slate-100 transition-all hover:scale-105 border border-transparent hover:border-[var(--border-color)]"
          title="Toggle Navigation Menu"
        >
          <Menu size={24} strokeWidth={2} />
        </button>

        <div className="flex items-center gap-3">
          <StacklyLogo size={32} showText={false} />
          <div className="flex flex-col justify-center">
            <h1 className="text-[22px] md:text-[24px] font-bold tracking-tight text-[var(--text-primary)] leading-tight font-sans">
              Workforce Analytics
            </h1>
            <p className="text-[12px] font-medium text-slate-400 leading-none mt-0.5 hidden sm:block">
              Enterprise Workforce Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* Center Section: Global Search Bar with Clean Layout */}
      <div className="hidden lg:flex items-center max-w-[440px] w-full relative">
        <div className="relative w-full flex items-center">
          <Search size={18} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Global Search"
            placeholder={`Search ${searchCategory === 'all' ? 'platform' : searchCategory}...`}
            className="w-full pl-10 pr-20 py-2 text-sm rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[#2563EB] shadow-inner transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 bg-slate-800/40 px-1.5 py-0.5 rounded border border-slate-700/50 pointer-events-none hidden xl:inline-block">
            Ctrl + K
          </kbd>
        </div>

        {/* Search Drill-Down Dropdown */}
        {searchFocused && (
          <div className="absolute left-0 right-0 top-full mt-2 glass-panel p-4 shadow-2xl z-50 bg-[var(--bg-secondary)] border-[var(--border-color)] rounded-2xl space-y-3">
            {/* Category Drill-Down Pills */}
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Filter size={14} strokeWidth={2} /> Category Scope
              </span>
              <button
                onClick={() => setSearchFocused(false)}
                className="text-[10px] font-bold text-blue-400 hover:underline"
              >
                Close
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(['all', 'employees', 'departments', 'reports', 'security'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSearchCategory(cat)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-bold capitalize transition-colors ${
                    searchCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-[var(--bg-tertiary)] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Recent Searches */}
            <div className="pt-2 border-t border-[var(--border-color)]">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 mb-2">
                <History size={14} strokeWidth={2} /> Recent Queries
              </span>
              <div className="space-y-1">
                {recentSearches
                  .filter((item) => searchCategory === 'all' || item.category === searchCategory)
                  .map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(s.query);
                        setSearchFocused(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] text-xs text-slate-300 font-medium flex items-center justify-between transition-colors"
                    >
                      <span>{s.query}</span>
                      <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        {s.category}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Section: Notifications, Theme Toggle, Scope Selector & Profile */}
      <div className="flex items-center gap-3 shrink-0">
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

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Light or Dark Theme"
          className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-slate-100 transition-all hover:scale-105"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun size={20} strokeWidth={2} className="text-[#F59E0B]" /> : <Moon size={20} strokeWidth={2} className="text-[#2563EB]" />}
        </button>

        {/* Security Scope & Department Drill-Down Dropdown Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => toggleDropdown('role')}
            aria-label="Switch Security Role Scope"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold hover:border-[#2563EB] transition-colors"
          >
            <span className={`badge ${getRoleBadgeClass(role)}`}>
              {ROLE_LABELS[role]}
            </span>
            <span className="text-[11px] text-slate-400 hidden xl:inline-block">• {selectedDept}</span>
            <ChevronDown size={14} strokeWidth={2} className="text-slate-400" />
          </button>

          {/* Drill-Down Scope Menu */}
          {activeDropdown === 'role' && (
            <div className="absolute right-0 mt-2 w-72 glass-panel p-3 shadow-2xl z-50 bg-[var(--bg-secondary)] border-[var(--border-color)] rounded-2xl space-y-3">
              {/* Drill-Down Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  {drillDownView !== 'roles' && (
                    <button
                      onClick={() => setDrillDownView('roles')}
                      className="p-1 rounded hover:bg-[var(--bg-hover)] text-blue-400"
                    >
                      <ChevronLeft size={14} />
                    </button>
                  )}
                  <span className="text-slate-400 uppercase tracking-wider">
                    {drillDownView === 'roles' ? 'Security Scope' : 'Department Scope'}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setDrillDownView('roles')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${drillDownView === 'roles' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  >
                    Roles
                  </button>
                  <button
                    onClick={() => setDrillDownView('departments')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${drillDownView === 'departments' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  >
                    Depts
                  </button>
                </div>
              </div>

              {/* View 1: Role Switcher Level */}
              {drillDownView === 'roles' && (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {availableRoles.map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors ${
                        role === r ? 'font-black text-[#2563EB] bg-blue-500/10 border border-blue-500/20' : 'text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className={role === r ? 'text-blue-500' : 'text-slate-400'} />
                        <span>{ROLE_LABELS[r]}</span>
                      </div>
                      {role === r ? (
                        <CheckCircle2 size={16} strokeWidth={2} className="text-[#2563EB]" />
                      ) : (
                        <ChevronRight size={14} className="text-slate-500" />
                      )}
                    </button>
                  ))}

                  <div className="pt-2 border-t border-[var(--border-color)]">
                    <button
                      onClick={() => setDrillDownView('departments')}
                      className="w-full px-3 py-2 text-xs text-slate-300 font-bold bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] rounded-xl flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Building2 size={14} className="text-purple-400" /> Drill Down Department
                      </span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* View 2: Department Drill-Down Level */}
              {drillDownView === 'departments' && (
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  <p className="text-[10px] font-bold text-slate-400 px-1 mb-1 uppercase">Select Organizational Scope:</p>
                  {departmentsList.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => {
                        setSelectedDept(dept.name);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors flex items-center justify-between ${
                        selectedDept === dept.name
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 font-bold'
                          : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] text-slate-300 hover:bg-[var(--bg-hover)]'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{dept.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Head: {dept.head}</p>
                      </div>
                      <span className="badge badge-info text-[9px]">{dept.code}</span>
                    </button>
                  ))}
                </div>
              )}
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
              <div className="absolute right-0 mt-2 w-64 glass-panel py-2 shadow-2xl z-50 bg-[var(--bg-secondary)] border-[var(--border-color)] text-xs rounded-2xl">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-[var(--border-color)]">
                  <p className="font-bold text-sm text-[var(--text-primary)]">{user.name}</p>
                  <p className="text-[11px] text-slate-400">{user.email}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`badge ${getRoleBadgeClass(role)}`}>{ROLE_LABELS[role]}</span>
                    <button
                      onClick={() => setShowPermissionsPreview(!showPermissionsPreview)}
                      className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Layers size={12} /> {showPermissionsPreview ? 'Hide Flags' : 'Drill Down Permissions'}
                    </button>
                  </div>
                </div>

                {/* Drill-Down Permissions Matrix Accordion */}
                {showPermissionsPreview && (
                  <div className="p-3 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] text-[10px] space-y-1.5 max-h-36 overflow-y-auto">
                    <p className="font-extrabold text-slate-400 uppercase tracking-wider">Active Permissions ({permissions.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {permissions.map((p, idx) => (
                        <span key={idx} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Items */}
                <div className="py-1.5 space-y-0.5 font-medium">
                  <button
                    onClick={() => { navigate('/employee/profile'); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-hover)] flex items-center gap-2.5 text-[var(--text-primary)]"
                  >
                    <UserIcon size={18} strokeWidth={2} className="text-[#2563EB]" /> View Profile
                  </button>
                  <button
                    onClick={() => { navigate('/admin/settings'); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-hover)] flex items-center gap-2.5 text-[var(--text-primary)]"
                  >
                    <Settings size={18} strokeWidth={2} className="text-[#4F46E5]" /> My Settings
                  </button>
                  <button
                    onClick={() => { navigate('/admin/roles'); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-hover)] flex items-center gap-2.5 text-[var(--text-primary)]"
                  >
                    <Shield size={18} strokeWidth={2} className="text-[#F59E0B]" /> Security Policy
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
                    <LogOut size={18} strokeWidth={2} /> Logout
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
