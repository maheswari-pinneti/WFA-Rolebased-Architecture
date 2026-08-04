import React, { createContext, useContext, useState } from 'react';

export type RoleType = 'ADMIN' | 'HR_MANAGER' | 'DEPT_MANAGER' | 'TEAM_LEAD' | 'EMPLOYEE';
export type DeptScopeType = 'Engineering & IT' | 'Human Resources' | 'Sales & Growth' | 'Finance' | 'Product Operations' | 'All Departments';

interface SecurityContextType {
  role: RoleType;
  setRole: (role: RoleType) => void;
  deptScope: DeptScopeType;
  setDeptScope: (dept: DeptScopeType) => void;
  user: {
    name: string;
    email: string;
    title: string;
    avatar: string;
  };
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<RoleType>('ADMIN');
  const [deptScope, setDeptScope] = useState<DeptScopeType>('Engineering & IT');

  const roleUsers: Record<RoleType, { name: string; email: string; title: string; avatar: string }> = {
    ADMIN: {
      name: 'Maheswari Pinneti',
      email: 'admin@thestackly.com',
      title: 'Frontend Developer & System Admin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    HR_MANAGER: {
      name: 'Elena Rostova',
      email: 'hr@thestackly.com',
      title: 'VP of HR Operations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    DEPT_MANAGER: {
      name: 'David Sterling',
      email: 'manager@thestackly.com',
      title: 'Department Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    TEAM_LEAD: {
      name: 'Marcus Vance',
      email: 'lead@thestackly.com',
      title: 'Team Lead (TL)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    EMPLOYEE: {
      name: 'Alex Mercer',
      email: 'employee@thestackly.com',
      title: 'Full Stack Developer',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    },
  };

  return (
    <SecurityContext.Provider
      value={{
        role,
        setRole,
        deptScope,
        setDeptScope,
        user: roleUsers[role],
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) throw new Error('useSecurity must be used within a SecurityProvider');
  return context;
};
