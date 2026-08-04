import React from 'react';
import { useSecurity, RoleType, DeptScopeType } from '../../context/SecurityContext';
import { useTheme, ThemeType } from '../../context/ThemeContext';
import { ShieldCheck, Building2, Layers } from 'lucide-react';

export const SecurityControlBar: React.FC = () => {
  const { role, setRole, deptScope, setDeptScope } = useSecurity();
  const { activeTheme, setActiveTheme } = useTheme();

  return (
    <div className="bg-slate-950 text-white text-xs px-6 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-2 font-bold text-amber-400">
        <ShieldCheck size={16} />
        <span className="uppercase tracking-wider text-[11px]">SECURITY ENGINE:</span>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {/* RBAC Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">RBAC Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RoleType)}
            className="bg-slate-900 border border-slate-700 text-amber-300 font-bold px-3 py-1 rounded-xl outline-none cursor-pointer focus:border-amber-400"
          >
            <option value="ADMIN">Level 1: System Admin</option>
            <option value="HR_MANAGER">Level 2: HR Manager</option>
            <option value="DEPT_MANAGER">Level 3: Dept Manager</option>
            <option value="TEAM_LEAD">Level 4: Team Lead</option>
            <option value="EMPLOYEE">Level 5: Employee</option>
          </select>
        </div>

        {/* DBAC Department Scope Switcher */}
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-blue-400" />
          <span className="text-slate-400 font-semibold">DBAC Dept Scope:</span>
          <select
            value={deptScope}
            onChange={(e) => setDeptScope(e.target.value as DeptScopeType)}
            className="bg-slate-900 border border-slate-700 text-blue-300 font-bold px-3 py-1 rounded-xl outline-none cursor-pointer focus:border-blue-400"
          >
            <option value="Engineering & IT">Engineering & IT</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Sales & Growth">Sales & Growth</option>
            <option value="Finance">Finance</option>
            <option value="Product Operations">Product Operations</option>
            <option value="All Departments">All Departments (Global HQ)</option>
          </select>
        </div>

        {/* Theme Suite Selector */}
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-emerald-400" />
          <span className="text-slate-400 font-semibold">Theme Suite:</span>
          <select
            value={activeTheme}
            onChange={(e) => setActiveTheme(e.target.value as ThemeType)}
            className="bg-slate-900 border border-slate-700 text-emerald-300 font-bold px-3 py-1 rounded-xl outline-none cursor-pointer focus:border-emerald-400"
          >
            <option value="material">Theme 1: Material Dashboard 2 (Dark)</option>
            <option value="minimal">Theme 2: Minimal Kit UI (Pastel)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
