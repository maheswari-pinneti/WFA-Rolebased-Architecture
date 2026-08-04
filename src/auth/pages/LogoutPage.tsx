import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, CheckCircle2, ShieldCheck, LogIn } from 'lucide-react';
import { StacklyLogo } from '../../components/common/StacklyLogo';

export const LogoutPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 1500);
    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#0B1120] text-slate-100 font-sans relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* PERFECTLY CENTERED LOGOUT CARD */}
      <div className="w-full max-w-[420px] mx-auto space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10 text-center backdrop-blur-xl">
        
        {/* Brand Header */}
        <div className="flex justify-center pb-1">
          <StacklyLogo size={38} showText={true} />
        </div>

        {/* Icon Badge */}
        <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20 flex items-center justify-center mx-auto shadow-md">
          <LogOut size={30} />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black text-white tracking-tight">Logged Out Safely</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Your active session at <span className="font-mono text-blue-400 font-bold">@thestackly.com</span> has been securely terminated and access tokens invalidated.
          </p>
        </div>

        {/* Redirecting Badge */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 py-3 px-4 rounded-2xl border border-emerald-500/20">
          <CheckCircle2 size={16} />
          <span>Redirecting to Sign In...</span>
        </div>

        {/* Manual Redirect Link */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col items-center gap-2">
          <Link
            to="/login"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
              color: '#FFFFFF',
              border: 'none'
            }}
            className="w-full py-2.5 rounded-xl font-extrabold text-xs shadow-md flex items-center justify-center gap-2 text-white no-underline"
          >
            <LogIn size={15} />
            <span>Sign In Again</span>
          </Link>

          <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-mono pt-1">
            <ShieldCheck size={12} className="text-emerald-400" /> 256-Bit SSL Encrypted Session Terminated
          </div>
        </div>

      </div>
    </div>
  );
};
