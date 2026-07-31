import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { Role, ROLE_HOME_PATHS } from '../../security/roles/roles';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || ROLE_HOME_PATHS[role] || '/employee/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location]);

  return <LoginForm />;
};
