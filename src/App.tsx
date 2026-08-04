import React from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { WorkforceDashboard } from './components/workforce/WorkforceDashboard';

export const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <WorkforceDashboard />;
};

export const App: React.FC = () => {
  return <AppContent />;
};
