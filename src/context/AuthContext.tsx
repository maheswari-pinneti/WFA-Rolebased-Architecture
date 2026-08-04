import React, { createContext, useContext, useState } from 'react';
import { RoleType, useSecurity } from './SecurityContext';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, role: RoleType) => void;
  logout: () => void;
  userEmail: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('maheswaripinneti@thestackly.com');
  const { setRole } = useSecurity();

  const login = (email: string, selectedRole: RoleType) => {
    setUserEmail(email);
    setRole(selectedRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
