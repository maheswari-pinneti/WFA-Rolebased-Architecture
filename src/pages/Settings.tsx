import React, { useState } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { Settings, Shield, Bell, Lock, Key, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSave = () => {
    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(null), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Settings size={20} />
            </span>
            <h1 className="text-xl font-black text-white tracking-tight">Account & System Settings</h1>
          </div>
          <p className="text-xs text-slate-400 font-medium">Manage security preferences, MFA authentication, and active roles.</p>
        </div>

        {savedMessage && (
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2 font-bold animate-fadeIn">
            <CheckCircle2 size={16} />
            <span>{savedMessage}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-4">
        {(['profile', 'security', 'notifications'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-extrabold capitalize transition-all border-b-2 cursor-pointer ${
              activeTab === tab
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab} Settings
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {activeTab === 'profile' && (
          <div className="space-y-4 max-w-lg">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Corporate Email</label>
              <input
                type="text"
                disabled
                value={user?.email || 'admin@thestackly.com'}
                className="w-full bg-slate-950 border border-slate-800 text-slate-400 px-4 py-2.5 rounded-xl text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name || 'Sarah Connor'}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-4 py-2.5 rounded-xl text-xs font-medium focus:border-blue-500 outline-none"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <Shield className="text-emerald-400" size={24} />
                <div>
                  <h3 className="text-xs font-extrabold text-white">Multi-Factor Authentication (MFA)</h3>
                  <p className="text-[11px] text-slate-400">Enforce TOTP authenticator code verification on login.</p>
                </div>
              </div>
              <button
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  mfaEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {mfaEnabled ? 'MFA Active' : 'Enable MFA'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <Bell className="text-blue-400" size={20} />
                <div>
                  <h3 className="text-xs font-extrabold text-white">Email Digest & Alerts</h3>
                  <p className="text-[11px] text-slate-400">Receive daily summary of attendance and performance anomalies.</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600 cursor-pointer" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
