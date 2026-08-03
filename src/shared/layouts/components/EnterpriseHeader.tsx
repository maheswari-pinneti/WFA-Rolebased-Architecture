import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useTheme } from '../../../design-system/theme/theme';
import { Role, ROLE_LABELS, ROLE_HOME_PATHS } from '../../../security/roles/roles';
import { getRoleBadgeClass } from '../../utils/helpers';
import { StacklyLogo } from '../../../components/common/StacklyLogo';
import { LogoutModal } from '../../../auth/components/LogoutModal';
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
  Filter,
  Layers,
  Building2,
  ShieldCheck,
  ChevronRight,
  Check,
  X,
  MessageSquare,
  HelpCircle,
  Plus,
  Download,
  Upload,
  KeyRound,
  Clock,
  FileSpreadsheet,
  Home
} from 'lucide-react';

interface EnterpriseHeaderProps {
  onToggleSidebar: () => void;
  onOpenHelp?: () => void;
}

export const EnterpriseHeader: React.FC<EnterpriseHeaderProps> = ({ onToggleSidebar, onOpenHelp }) => {
  const { user, logout, switchRole, role, permissions } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Search & Drill-Down Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchCategory, setSearchCategory] = useState<'all' | 'employees' | 'departments' | 'reports' | 'security'>('all');

  // Notifications & Messages State
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Attendance Alert: 3 Late Clock-Ins', subtitle: 'HR Operations', time: '5m ago', type: 'warning', path: '/hr/attendance', read: false },
    { id: '2', title: 'Leave Request Pending Review', subtitle: 'Sarah Connor (Engineering)', time: '45m ago', type: 'info', path: '/manager/approvals', read: false },
    { id: '3', title: 'System Security Audit Completed', subtitle: 'Compliance Stream', time: '2h ago', type: 'success', path: '/admin/audit-logs', read: false },
  ]);

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState<'profile' | 'role' | 'notif' | 'messages' | null>(null);

  // Scope State
  const [selectedDept, setSelectedDept] = useState<string>('Global Operations');
  const [showPermissionsPreview, setShowPermissionsPreview] = useState(false);
  const [deptToast, setDeptToast] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const searchResultsMap = [
    { title: 'Global Headcount & Department Analytics', category: 'reports', path: '/admin/analytics' },
    { title: 'User Management & Security Scopes', category: 'security', path: '/admin/users' },
    { title: 'System Security Audit Stream', category: 'security', path: '/admin/audit-logs' },
    { title: 'Workforce Attendance Roster', category: 'employees', path: '/hr/attendance' },
    { title: 'Performance Review Matrix', category: 'employees', path: '/hr/performance' },
    { title: 'Engineering & Product Teams', category: 'departments', path: '/admin/departments' },
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

  const toggleDropdown = (name: 'profile' | 'role' | 'notif' | 'messages') => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleRoleChange = (newRole: Role) => {
    switchRole(newRole);
    setActiveDropdown(null);
    const targetPath = ROLE_HOME_PATHS[newRole] || '/employee/dashboard';
    navigate(targetPath);
  };

  const handleSearchSubmit = (path: string) => {
    setSearchFocused(false);
    setSearchQuery('');
    navigate(path);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleLogoutClick = () => {
    setActiveDropdown(null);
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  // Dynamic Breadcrumb Generator based on Route
  const getBreadcrumbItems = () => {
    const path = location.pathname;
    if (path.includes('/admin/employees') || path.includes('/hr/employees')) {
      return [
        { label: 'Workforce', path: '/admin/dashboard' },
        { label: 'Employees', path: '/admin/employees', active: true },
      ];
    }
    if (path.includes('/hr/attendance') || path.includes('/employee/attendance')) {
      return [
        { label: 'Attendance', path: '/hr/attendance' },
        { label: 'My Attendance', path: '/employee/attendance', active: true },
      ];
    }
    if (path.includes('/hr/performance') || path.includes('/employee/performance')) {
      return [
        { label: 'Performance', path: '/hr/performance' },
        { label: 'Goals & KPIs', path: '/hr/performance#kpis', active: true },
      ];
    }
    if (path.includes('/hr/reports') || path.includes('/admin/analytics')) {
      return [
        { label: 'Reports', path: '/hr/reports' },
        { label: 'Export Center', path: '/hr/reports#export', active: true },
      ];
    }
    return [{ label: 'Dashboard', path: '/admin/dashboard', active: true }];
  };

  // Dynamic Contextual Action Buttons based on Page Route
  const getPageContextActions = () => {
    const path = location.pathname;
    if (path.includes('/employees')) {
      return (
        <div className="hidden xl:flex items-center gap-2">
          <Link to="/admin/employees#add" className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1">
            <Plus size={14} /> Add Employee
          </Link>
          <button onClick={() => navigate('/admin/employees#import')} className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-slate-400 hover:text-[var(--text-primary)] transition-all flex items-center gap-1">
            <Upload size={14} /> Import
          </button>
          <button onClick={() => navigate('/hr/reports#export')} className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-slate-400 hover:text-[var(--text-primary)] transition-all flex items-center gap-1">
            <Download size={14} /> Export
          </button>
        </div>
      );
    }
    if (path.includes('/attendance')) {
      return (
        <div className="hidden xl:flex items-center gap-2">
          <button onClick={() => navigate('/hr/attendance#clock')} className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1">
            <Clock size={14} /> Check In / Out
          </button>
          <button onClick={() => navigate('/hr/attendance#correction')} className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-slate-400 hover:text-[var(--text-primary)] transition-all flex items-center gap-1">
            Request Correction
          </button>
        </div>
      );
    }
    if (path.includes('/reports') || path.includes('/analytics')) {
      return (
        <div className="hidden xl:flex items-center gap-2">
          <button onClick={() => navigate('/hr/reports#generate')} className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1">
            <FileSpreadsheet size={14} /> Generate Report
          </button>
          <button onClick={() => navigate('/hr/reports#export')} className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-slate-400 hover:text-[var(--text-primary)] transition-all flex items-center gap-1">
            <Download size={14} /> Export
          </button>
        </div>
      );
    }
    if (path.includes('/settings')) {
      return (
        <div className="hidden xl:flex items-center gap-2">
          <button onClick={() => setDeptToast('Settings saved successfully')} className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1">
            <Check size={14} /> Save Changes
          </button>
        </div>
      );
    }
    return null;
  };

  const filteredSearchResults = searchResultsMap.filter((item) => {
    const matchesCategory = searchCategory === 'all' || item.category === searchCategory;
    const matchesQuery = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <header className="h-[72px] px-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between gap-6 shadow-sm transition-colors font-sans shrink-0">
      {/* Toast Alert for Department Scope Switch */}
      {deptToast && (
        <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} /> {deptToast}
        </div>
      )}

      {/* LEFT SECTION: Sidebar Toggle, Stackly Logo & Dynamic Breadcrumb Navigation */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar Menu"
          className="p-2 rounded-xl text-slate-400 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all hover:scale-105 border border-transparent hover:border-[var(--border-color)]"
          title="Toggle Navigation Sidebar"
        >
          <Menu size={22} strokeWidth={2} />
        </button>

        <div className="flex items-center gap-3">
          <StacklyLogo size={30} showText={false} />

          {/* Dynamic Breadcrumbs & Page Context Actions */}
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Link to="/" className="hover:text-blue-500 flex items-center gap-1 transition-colors">
                <Home size={14} />
              </Link>
              {getBreadcrumbItems().map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight size={12} className="text-slate-500 shrink-0" />
                  {crumb.active ? (
                    <span className="font-extrabold text-[var(--text-primary)]">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.path} className="hover:text-blue-500 transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* Optional Page Context Actions */}
            {getPageContextActions()}
          </div>
        </div>
      </div>

      {/* CENTER SECTION: Fixed Global Search Bar */}
      <div className="hidden lg:flex items-center max-w-[420px] w-full relative">
        <div className="relative w-full flex items-center">
          <Search size={16} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filteredSearchResults.length > 0) {
                handleSearchSubmit(filteredSearchResults[0].path);
              }
            }}
            aria-label="Global Search"
            placeholder="Search employees, reports, departments..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 shadow-inner transition-colors"
          />
        </div>

        {/* Search Results Dropdown */}
        {searchFocused && (
          <div className="absolute left-0 right-0 top-full mt-2 p-4 shadow-2xl z-50 bg-[var(--bg-secondary)] border border-[var(--border-color)] backdrop-blur-xl rounded-2xl space-y-3 text-[var(--text-primary)] animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
              <span className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                <Filter size={14} strokeWidth={2} /> Category Scope
              </span>
              <button
                onClick={() => setSearchFocused(false)}
                className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5"
              >
                <X size={12} /> Close
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
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-[var(--border-color)] max-h-60 overflow-y-auto space-y-1">
              {filteredSearchResults.length === 0 ? (
                <p className="text-xs text-slate-400 py-2 text-center">No matching results found</p>
              ) : (
                filteredSearchResults.map((res, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearchSubmit(res.path)}
                    className="w-full text-left px-3 py-2 rounded-xl bg-[var(--bg-tertiary)]/60 hover:bg-[var(--bg-tertiary)] text-xs text-[var(--text-primary)] font-medium flex items-center justify-between transition-colors"
                  >
                    <span>{res.title}</span>
                    <span className="text-[10px] font-mono uppercase bg-[var(--bg-primary)] text-slate-400 px-1.5 py-0.5 rounded border border-[var(--border-color)]">
                      {res.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SECTION: Notification Bell, Messages, Theme Toggle, Help Icon & User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* 1. Notification Bell Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('notif')}
            aria-label="View Notifications"
            className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-[var(--text-primary)] transition-all hover:scale-105 relative"
            title="Notifications"
          >
            <Bell size={20} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-[var(--bg-secondary)] animate-pulse" />
            )}
          </button>

          {activeDropdown === 'notif' && (
            <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-secondary)] border border-[var(--border-color)] py-3 px-4 shadow-2xl z-50 rounded-2xl space-y-3 text-[var(--text-primary)] animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Sparkles size={16} strokeWidth={2} className="text-blue-500" /> Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <Check size={12} /> Mark Read
                  </button>
                )}
              </div>
              <div className="space-y-2 text-xs max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setActiveDropdown(null);
                      navigate(n.path);
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      n.read
                        ? 'bg-[var(--bg-tertiary)]/50 border-[var(--border-color)] text-[var(--text-muted)]'
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

        {/* 2. Messages Icon Dropdown */}
        <button
          onClick={() => toggleDropdown('messages')}
          aria-label="View Messages"
          className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-[var(--text-primary)] transition-all hover:scale-105 relative hidden sm:block"
          title="Team Messages"
        >
          <MessageSquare size={20} strokeWidth={2} />
        </button>

        {/* 3. Theme Toggle (Light / Dark Navy) */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Light or Dark Theme"
          className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-[var(--text-primary)] transition-all hover:scale-105"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={20} strokeWidth={2} className="text-[#F59E0B]" /> : <Moon size={20} strokeWidth={2} className="text-[#2563EB]" />}
        </button>

        {/* 4. Help Center & IT Support Desk Icon */}
        <button
          onClick={onOpenHelp}
          aria-label="Help & IT Desk Support"
          className="p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-slate-400 hover:text-[var(--text-primary)] transition-all hover:scale-105 hidden md:block"
          title="24/7 Enterprise Help & IT Support"
        >
          <HelpCircle size={20} strokeWidth={2} />
        </button>

        {/* 5. User Profile Avatar & Dropdown */}
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
                  className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 shrink-0 shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--bg-secondary)]" />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-[var(--text-primary)] leading-tight">{user.name || 'Maheswari Pinneti'}</span>
                <span className="text-[10px] text-slate-400 leading-none mt-0.5">{ROLE_LABELS[role]}</span>
              </div>
              <ChevronDown size={14} strokeWidth={2} className="text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {activeDropdown === 'profile' && (
              <div className="absolute right-0 mt-2 w-64 bg-[var(--bg-secondary)] border border-[var(--border-color)] py-2 shadow-2xl z-50 text-xs rounded-2xl text-[var(--text-primary)] animate-fadeIn">
                <div className="px-4 py-3 border-b border-[var(--border-color)]">
                  <p className="font-bold text-sm text-[var(--text-primary)]">{user.name}</p>
                  <p className="text-[11px] text-slate-400">{user.email}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`badge ${getRoleBadgeClass(role)}`}>{ROLE_LABELS[role]}</span>
                    <button
                      onClick={() => setShowPermissionsPreview(!showPermissionsPreview)}
                      className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <Layers size={12} /> {showPermissionsPreview ? 'Hide Flags' : 'Permissions'}
                    </button>
                  </div>
                </div>

                {showPermissionsPreview && (
                  <div className="p-3 bg-[var(--bg-primary)] border-b border-[var(--border-color)] text-[10px] space-y-1.5 max-h-36 overflow-y-auto">
                    <p className="font-extrabold text-slate-400 uppercase tracking-wider">Active Permissions ({permissions.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {permissions.map((p, idx) => (
                        <span key={idx} className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="py-1.5 space-y-0.5 font-medium">
                  <button
                    onClick={() => { navigate('/employee/profile'); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-tertiary)] flex items-center gap-2.5 text-[var(--text-primary)]"
                  >
                    <UserIcon size={18} strokeWidth={2} className="text-blue-500" /> My Profile
                  </button>
                  <button
                    onClick={() => { navigate('/admin/settings'); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-tertiary)] flex items-center gap-2.5 text-[var(--text-primary)]"
                  >
                    <Settings size={18} strokeWidth={2} className="text-indigo-500" /> Account Settings
                  </button>
                  <button
                    onClick={() => { navigate('/admin/settings#security'); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-tertiary)] flex items-center gap-2.5 text-[var(--text-primary)]"
                  >
                    <KeyRound size={18} strokeWidth={2} className="text-emerald-500" /> Change Password
                  </button>
                  <button
                    onClick={() => { navigate('/admin/roles'); setActiveDropdown(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-[var(--bg-tertiary)] flex items-center gap-2.5 text-[var(--text-primary)]"
                  >
                    <Shield size={18} strokeWidth={2} className="text-amber-500" /> Security
                  </button>
                </div>

                <div className="border-t border-[var(--border-color)] pt-1.5">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-2 hover:bg-rose-500/10 text-rose-500 flex items-center gap-2.5 font-bold"
                  >
                    <LogOut size={18} strokeWidth={2} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirmLogout={handleConfirmLogout}
      />
    </header>
  );
};
