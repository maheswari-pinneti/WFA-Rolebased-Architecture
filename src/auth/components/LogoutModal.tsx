import React from 'react';
import { LogOut, X, ShieldAlert } from 'lucide-react';
import { StacklyLogo } from '../../components/common/StacklyLogo';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-5 text-slate-100 relative">
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Brand Logo Header */}
        <div className="flex justify-center border-b border-slate-800 pb-3">
          <StacklyLogo size={32} />
        </div>

        {/* Modal Icon & Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20 shadow-md">
            <ShieldAlert size={22} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">
              Confirm Account Logout
            </h3>
            <p className="text-xs text-slate-400">
              Stackly Workforce Intelligence (@thestackly.com)
            </p>
          </div>
        </div>

        {/* Modal Description */}
        <p className="text-xs text-slate-300 font-medium leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          Are you sure you want to log out? This will terminate your active authentication session token and require re-authenticating with your corporate email.
        </p>

        {/* Side-by-Side Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-center"
          >
            Cancel
          </button>

          <button
            onClick={onConfirmLogout}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};
