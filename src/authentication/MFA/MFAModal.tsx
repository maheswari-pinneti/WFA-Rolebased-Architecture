import React from 'react';
import { Smartphone, ShieldCheck } from 'lucide-react';

export interface MFAModalProps {
  email: string;
  onVerify: (code: string) => void;
  onCancel: () => void;
}

export const MFAModal: React.FC<MFAModalProps> = ({ email, onVerify, onCancel }) => {
  const [code, setCode] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      onVerify(code);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel p-6 max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-blue-400">
          <Smartphone size={28} />
          <div>
            <h3 className="font-bold text-lg text-slate-100">Multi-Factor Authentication</h3>
            <p className="text-xs text-slate-400">Microsoft Authenticator / SMS Challenge</p>
          </div>
        </div>

        <p className="text-xs text-slate-300">
          Enter the 6-digit security code generated for <strong className="text-white">{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 border border-slate-700 font-mono text-center text-lg tracking-widest text-white focus:outline-none focus:border-blue-500"
            placeholder="123456"
            required
          />

          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="btn btn-secondary btn-md flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-md flex-1 icon-gap">
              <ShieldCheck size={16} />
              Verify MFA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
