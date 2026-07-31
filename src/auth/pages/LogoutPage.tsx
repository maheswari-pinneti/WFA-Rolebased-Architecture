import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, CheckCircle2 } from 'lucide-react';

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 1200);
    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="glass-panel p-8 max-w-md text-center backdrop-blur-xl bg-slate-900/90 border-slate-800 shadow-2xl">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogOut size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">Signing Out</h2>
        <p className="text-sm text-slate-400 mb-6">
          Your active session has been safely closed and credentials cleared.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 py-2 px-4 rounded-xl border border-emerald-500/20">
          <CheckCircle2 size={16} />
          Redirecting to Sign In...
        </div>
      </div>
    </div>
  );
};
