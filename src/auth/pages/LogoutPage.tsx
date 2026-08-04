import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, CheckCircle2 } from 'lucide-react';
import { StacklyLogo } from '../../components/common/StacklyLogo';

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100 font-sans">
      <div className="glass-panel p-8 max-w-md w-full text-center backdrop-blur-xl bg-slate-900/90 border-slate-800 shadow-2xl space-y-5">
        <div className="flex justify-center pb-2">
          <StacklyLogo size={40} showText={true} />
        </div>

        <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 flex items-center justify-center mx-auto shadow-md">
          <LogOut size={32} />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-white">Signing Out</h2>
          <p className="text-xs text-slate-400">
            Your active session at <span className="font-mono text-blue-400">@thestackly.com</span> has been safely closed and credentials cleared.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 py-2.5 px-4 rounded-xl border border-emerald-500/20">
          <CheckCircle2 size={16} />
          Redirecting to Sign In...
        </div>
      </div>
    </div>
  );
};
