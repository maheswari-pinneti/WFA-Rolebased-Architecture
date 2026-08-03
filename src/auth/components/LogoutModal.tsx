import React from 'react';
import { LogOut, X, ShieldAlert } from 'lucide-react';

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
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-5 text-[var(--text-primary)] relative">
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-[var(--bg-tertiary)]"
        >
          <X size={18} />
        </button>

        {/* Modal Icon & Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">
              Confirm Account Logout
            </h3>
            <p className="text-xs text-slate-400">
              Stackly Workforce Analytics Security System
            </p>
          </div>
        </div>

        {/* Modal Question */}
        <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed bg-[var(--bg-tertiary)]/60 p-3.5 rounded-xl border border-[var(--border-color)]">
          Are you sure you want to logout? This will terminate your active JWT session token and require re-authentication.
        </p>

        {/* Buttons: Cancel & Logout */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-bold text-slate-400 hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all"
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
