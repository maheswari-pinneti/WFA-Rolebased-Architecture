import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { Role } from '../../security/roles/roles';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const roleHomePathMap: Record<Role, string> = {
    [Role.ADMIN]: '/admin',
    [Role.HR]: '/hr',
    [Role.TEAM_MANAGER]: '/manager',
    [Role.TEAM_LEAD]: '/team-lead',
    [Role.EMPLOYEE]: '/employee',
  };

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || roleHomePathMap[role] || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location]);

  return <LoginForm />;
};
