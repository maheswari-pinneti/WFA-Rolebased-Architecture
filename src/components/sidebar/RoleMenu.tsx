import React from 'react';
import { Role, ROLE_LABELS, ROLE_HOME_PATHS } from '../../security/roles/roles';
import { useAuth } from '../../auth/hooks/useAuth';
import { ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RoleMenuProps {
  onClose?: () => void;
}

export const RoleMenu: React.FC<RoleMenuProps> = ({ onClose }) => {
  const { role, switchRole } = useAuth();
  const navigate = useNavigate();
  const availableRoles: Role[] = [Role.ADMIN, Role.HR, Role.MANAGER, Role.TEAM_LEAD, Role.EMPLOYEE];

  const handleSelectRole = (selectedRole: Role) => {
    switchRole(selectedRole);
    if (onClose) onClose();
    const targetPath = ROLE_HOME_PATHS[selectedRole] || '/employee/dashboard';
    navigate(targetPath);
  };

  return (
    <div className="space-y-1 p-2">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
        Switch Active Role Scope
      </p>
      {availableRoles.map((r) => (
        <button
          key={r}
          onClick={() => handleSelectRole(r)}
          className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors ${
            role === r
              ? 'font-black text-blue-500 bg-blue-500/10 border border-blue-500/30'
              : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className={role === r ? 'text-blue-500' : 'text-slate-400'} />
            <span>{ROLE_LABELS[r]}</span>
          </div>
          {role === r ? (
            <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
          ) : (
            <ChevronRight size={14} className="text-slate-400 shrink-0" />
          )}
        </button>
      ))}
    </div>
  );
};
