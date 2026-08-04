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

  const handleDeptSelect = (dept: string) => {
    setSelectedDept(dept);
    setDeptToast(`Scope switched to: ${dept}`);
    setTimeout(() => setDeptToast(null), 3000);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleSearchSubmit = (path: string) => {
    setSearchFocused(false);
    setSearchQuery('');
    navigate(path);
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

  // Compute Breadcrumb Trail
  const getBreadcrumbs = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length === 0) return [{ label: 'Dashboard', path: '/' }];
    
    return segments.map((seg, idx) => {
      const url = `/${segments.slice(0, idx + 1).join('/')}`;
      const formatted = seg.charAt(0).toUpperCase() + seg.slice(1).replace('-', ' ');
      return { label: formatted, path: url };
    });
  };

  const breadcrumbs = getBreadcrumbs();
  const currentPageTitle = breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard';

  const filteredSearchResults = searchResultsMap.filter((item) => {
    const matchesCategory = searchCategory === 'all' || item.category === searchCategory;
    const matchesQuery = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <header className="h-[72px] sticky top-0 z-40 bg-[#0B1120] text-slate-100 border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between shadow-xl transition-all duration-300 font-sans">
      
      {/* Toast Notification for Scope Change */}
      {deptToast && (
        <div className="absolute top-20 right-6 bg-slate-900 border border-blue-500/40 text-blue-300 text-xs px-4 py-2.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-fadeIn font-bold">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{deptToast}</span>
        </div>
      )}

      {/* LEFT SECTION: Sidebar Toggle, Brand Logo & Breadcrumb Navigation */}
      <div className="flex items-center gap-3 md:gap-5 min-w-0">
        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className={`p-2 rounded-xl transition-all shadow-sm border ${
            theme === 'dark'
              ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
          }`}
          title="Toggle Left Sidebar"
        >
          <Menu size={20} />
        </button>

        {/* STACKLY Brand Logo */}
        <Link to="/" className="shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity">
          <StacklyLogo size={32} showText={true} />
        </Link>

        {/* Dynamic Breadcrumbs & Page Title */}
        <div className="hidden sm:flex flex-col text-left min-w-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Link to="/" className="hover:text-blue-400 flex items-center gap-1">
              <Home size={12} />
            </Link>
            {breadcrumbs.map((b, idx) => (
              <React.Fragment key={b.path}>
                <ChevronRight size={12} className="text-slate-600" />
                <span className={`truncate max-w-[120px] ${idx === breadcrumbs.length - 1 ? 'font-bold text-slate-200' : 'hover:text-slate-300'}`}>
                  {b.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
          <h1 className="text-sm font-extrabold text-white tracking-tight truncate max-w-[220px] lg:max-w-[320px]">
            {currentPageTitle}
          </h1>
        </div>
      </div>

      {/* CENTER SECTION: Global Search Input */}
      <div className="flex-1 max-w-md mx-4 relative hidden md:block">
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employees, reports, departments..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
          />
        </div>

        {/* Global Search Dropdown Overlay */}
        {searchFocused && (
          <>
            <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs" onClick={() => setSearchFocused(false)} />
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 p-4 shadow-2xl z-50 rounded-2xl space-y-3 text-slate-100 animate-fadeIn font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200">Global Search Results</span>
                <button onClick={() => setSearchFocused(false)} className="text-slate-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(['all', 'employees', 'departments', 'reports', 'security'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSearchCategory(cat)}
                    className={`px-3 py-1.5 text-xs rounded-xl font-bold capitalize transition-all ${
                      searchCategory === cat
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 max-h-60 overflow-y-auto space-y-1.5">
                {filteredSearchResults.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No matching results found</p>
                ) : (
                  filteredSearchResults.map((res, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSearchSubmit(res.path)}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-xs text-slate-100 font-semibold flex items-center justify-between transition-colors shadow-sm"
                    >
                      <span className="truncate pr-2">{res.title}</span>
                      <span className="text-[9.5px] font-mono font-bold uppercase bg-slate-950 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 shrink-0">
                        {res.category}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT SECTION: Notification Bell, Messages, Theme Toggle, Help Icon & User Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* 1. Notification Bell Icon & Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('notif')}
            aria-label="View Notifications"
            className={`p-2 rounded-xl transition-all shadow-sm relative border ${
              theme === 'dark'
                ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
            }`}
            title="Notifications"
          >
            <Bell size={18} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-slate-900 animate-pulse" />
            )}
          </button>

          {activeDropdown === 'notif' && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 py-3 px-4 shadow-2xl z-50 rounded-2xl space-y-3 text-slate-100 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Sparkles size={16} strokeWidth={2} className="text-blue-400" /> Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-1"
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
                        ? 'bg-slate-950/50 border-slate-800 text-slate-400'
                        : 'bg-blue-500/10 border-blue-500/30 text-slate-100 font-semibold'
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
          className={`p-2 rounded-xl transition-all shadow-sm hidden sm:block border ${
            theme === 'dark'
              ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
          }`}
          title="Team Messages"
        >
          <MessageSquare size={18} strokeWidth={2} />
        </button>

        {/* 3. Theme Toggle (Light / Dark) */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Light or Dark Theme"
          className={`p-2 rounded-xl transition-all shadow-sm border ${
            theme === 'dark'
              ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
          }`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} strokeWidth={2} className="text-amber-400" /> : <Moon size={18} strokeWidth={2} className="text-blue-400" />}
        </button>

        {/* 4. Help Center & IT Support Desk Icon */}
        <button
          onClick={onOpenHelp}
          aria-label="Help & IT Desk Support"
          className={`p-2 rounded-xl transition-all shadow-sm hidden md:block border ${
            theme === 'dark'
              ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900'
          }`}
          title="24/7 Enterprise Help & IT Support"
        >
          <HelpCircle size={18} strokeWidth={2} />
        </button>

        {/* 5. User Profile Small Compact Drill-Down Button */}
        {user && (
          <div className="relative border-l border-slate-800/80 pl-3 ml-1">
            <button
              onClick={() => toggleDropdown('profile')}
              aria-label="User Profile Menu"
              className="flex items-center gap-2 p-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800/90 transition-all shadow-sm"
              title={`${user.name} (${ROLE_LABELS[role]})`}
            >
              <div className="relative shrink-0">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-blue-500/60 shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-900" />
              </div>
              <ChevronDown size={14} strokeWidth={2} className="text-slate-400 hover:text-white pr-1 shrink-0" />
            </button>

            {/* User Profile Dropdown Menu */}
            {activeDropdown === 'profile' && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 p-2.5 shadow-2xl z-50 rounded-2xl text-xs text-slate-100 animate-fadeIn space-y-1 font-sans">
                <div className="px-3.5 py-3 border-b border-slate-800 space-y-1">
                  <p className="font-black text-sm text-white">{user.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{user.email}</p>
                  <div className="mt-2 flex items-center justify-between pt-1">
                    <span className={`badge ${getRoleBadgeClass(role)}`}>{ROLE_LABELS[role]}</span>
                    <button
                      onClick={() => setShowPermissionsPreview(!showPermissionsPreview)}
                      className="text-[10px] font-bold text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Layers size={12} /> {showPermissionsPreview ? 'Hide Flags' : 'Permissions'}
                    </button>
                  </div>
                </div>

                {showPermissionsPreview && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] space-y-1.5 max-h-36 overflow-y-auto">
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

                <div className="py-1 space-y-0.5 font-medium">
                  <button
                    onClick={() => { navigate('/employee/profile'); setActiveDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
                  >
                    <UserIcon size={16} strokeWidth={2} className="text-blue-400" /> My Profile
                  </button>
                  <button
                    onClick={() => { navigate('/admin/settings'); setActiveDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
                  >
                    <Settings size={16} strokeWidth={2} className="text-indigo-400" /> Account Settings
                  </button>
                  <button
                    onClick={() => { navigate('/admin/settings#security'); setActiveDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
                  >
                    <KeyRound size={16} strokeWidth={2} className="text-emerald-400" /> Change Password
                  </button>
                  <button
                    onClick={() => { navigate('/admin/roles'); setActiveDropdown(null); }}
                    className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
                  >
                    <Shield size={16} strokeWidth={2} className="text-amber-400" /> Security
                  </button>
                </div>

                <div className="border-t border-slate-800 pt-1">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 flex items-center gap-2.5 font-bold transition-colors"
                  >
                    <LogOut size={16} strokeWidth={2} /> Logout
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
