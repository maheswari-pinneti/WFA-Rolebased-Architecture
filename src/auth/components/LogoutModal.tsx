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
          <StacklyLogo size={32} showText={true} />
        </div>

        {/* Modal Icon & Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20 shadow-md">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">
              Confirm Account Logout
            </h3>
            <p className="text-xs text-slate-400">
              Stackly Workforce Analytics Security System (@thestackly.com)
            </p>
          </div>
        </div>

        {/* Modal Question */}
        <p className="text-xs text-slate-300 font-medium leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          Are you sure you want to logout? This will terminate your active JWT session token and require re-authentication.
        </p>

        {/* Buttons: Cancel & Logout */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmLogout}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md shadow-rose-500/20 transition-all flex items-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};
