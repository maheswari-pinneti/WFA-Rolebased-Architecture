import React, { useState } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { Role } from '../../../security/roles/roles';
import { getRoleBadgeClass } from '../../../shared/utils/helpers';
import {
  User as UserIcon,
  Mail,
  Briefcase,
  Building2,
  Shield,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  FileText,
  Download,
  CheckCircle2
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'performance' | 'documents'>('overview');

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      {/* Header Banner */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">User Profile</h2>
        <p className="text-xs text-slate-400">Manage employee credentials, attendance summary, performance ratings, and documents</p>
      </div>

      {/* Main Profile Card */}
      <div className="glass-panel p-6 md:p-8 space-y-6">
        {/* Profile Info Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-[var(--border-color)] pb-6">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-xl shrink-0"
          />
          <div className="text-center sm:text-left space-y-1 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-xl font-extrabold text-[var(--text-primary)]">{user?.name || 'Maheswari Pinneti'}</h3>
              <span className={`badge ${getRoleBadgeClass(user?.role || Role.EMPLOYEE)} self-center sm:self-auto`}>
                {user?.role}
              </span>
            </div>
            <p className="text-xs font-semibold text-blue-500">{user?.title || 'Frontend Developer'}</p>
            <p className="text-xs text-slate-400 font-medium">{user?.department || 'Engineering Department'}</p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/30">
              ID: STK-1005
            </span>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="flex border-b border-[var(--border-color)] gap-4 text-xs font-bold">
          {[
            { id: 'overview', label: 'Overview', icon: <UserIcon size={14} /> },
            { id: 'attendance', label: 'Attendance', icon: <Clock size={14} /> },
            { id: 'performance', label: 'Performance', icon: <TrendingUp size={14} /> },
            { id: 'documents', label: 'Documents', icon: <FileText size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-500 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center gap-3">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Official Email</p>
                  <p className="font-bold text-[var(--text-primary)]">{user?.email || 'maheswari@stackly.com'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center gap-3">
                <Building2 size={18} className="text-purple-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Department</p>
                  <p className="font-bold text-[var(--text-primary)]">{user?.department || 'Engineering Department'}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center gap-3">
                <MapPin size={18} className="text-amber-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Location / Branch</p>
                  <p className="font-bold text-[var(--text-primary)]">New York HQ - Tech Campus</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center gap-3">
                <Calendar size={18} className="text-emerald-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Joining Date</p>
                  <p className="font-bold text-[var(--text-primary)]">Feb 1, 2023</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)]">
              <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2 mb-3">
                <Shield size={16} className="text-emerald-500" /> Security Permissions
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user?.permissions.map((perm) => (
                  <span key={perm} className="text-[10px] font-mono bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded-lg">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Attendance */}
        {activeTab === 'attendance' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-[10px] text-emerald-400 font-bold">Present Days</p>
                <p className="text-lg font-black text-emerald-500">22 Days</p>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <p className="text-[10px] text-indigo-400 font-bold">Remote WFH</p>
                <p className="text-lg font-black text-indigo-500">4 Days</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-[10px] text-amber-400 font-bold">Leave Taken</p>
                <p className="text-lg font-black text-amber-500">1 Day</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Performance */}
        {activeTab === 'performance' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-purple-400">Quarterly KPI Score</p>
                <p className="text-2xl font-black text-purple-500">96 / 100</p>
              </div>
              <span className="badge badge-success">Top 5% Performer</span>
            </div>
          </div>
        )}

        {/* Tab 4: Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-2 text-xs animate-fadeIn">
            {[
              { name: 'Employment Offer Letter & Contract.pdf', size: '2.4 MB' },
              { name: 'Q1 Performance Appraisal Review.pdf', size: '1.1 MB' },
              { name: 'Non-Disclosure Agreement (NDA).pdf', size: '850 KB' },
            ].map((doc, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" />
                  <span className="font-semibold text-[var(--text-primary)]">{doc.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                  {doc.size}
                  <button className="p-1 hover:text-blue-500"><Download size={14} /></button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
