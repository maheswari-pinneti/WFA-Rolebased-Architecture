import React, { useState, useEffect } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { KPICard } from '../../../components/cards/KPICard';
import { WorkforceTrendLine } from '../../analytics/charts/WorkforceTrendLine';
import { Clock, Play, Square, Calendar, Star, FileText, Compass, CheckCircle2, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmployeeDashboard: React.FC = () => {
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(25200); // 7 hours in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isClockedIn) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn]);

  const formatHoursMinutes = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const myRequests = [
    { id: 'REQ-501', title: 'Vacation Leave (3 Days)', date: 'Aug 10 - Aug 13', status: 'PENDING' },
    { id: 'REQ-490', title: 'Remote Work Week', date: 'Jul 15 - Jul 20', status: 'APPROVED' },
  ];

  return (
    <RoleGuard allowedRoles={[Role.EMPLOYEE, Role.TEAM_LEAD, Role.MANAGER, Role.HR, Role.ADMIN]} requiredPermission={Permission.PROFILE_VIEW}>
      <div className="space-y-6 animate-fadeIn">
        {/* Employee Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
              alt="Alex Mercer"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white">Welcome back, Alex Mercer!</h2>
                <span className="badge badge-success">SELF SERVICE</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Full Stack Developer • Engineering & Technology Department (Frontend Team)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/employee/leave" className="btn btn-primary btn-sm flex items-center gap-1.5">
              <FileText size={14} /> Request Time Off
            </Link>
            <Link to="/employee/profile" className="btn btn-secondary btn-sm flex items-center gap-1.5">
              <Compass size={14} /> My Profile
            </Link>
          </div>
        </div>

        {/* Employee Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="My Attendance Rate" value="98.5%" change={1.5} trend="up" subtitle="Monthly shift compliance" icon={<Clock size={20} />} accentColor="emerald" />
          <KPICard title="Leave Balance" value="14 Days PTO" change={0.0} trend="up" subtitle="Annual allocation" icon={<Calendar size={20} />} accentColor="cyan" />
          <KPICard title="Performance Rating" value="96 / 100" change={3.2} trend="up" subtitle="Q2 Assessment" icon={<Star size={20} />} accentColor="purple" />
          <KPICard title="Recent Payslip" value="$8,450.00" change={0.0} trend="up" subtitle="July 2026 Processed" icon={<DollarSign size={20} />} accentColor="amber" />
        </div>

        {/* Employee Section 1: Interactive Shift Punch Clock & Request Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Clock size={18} className="text-emerald-400" /> Shift Punch Clock & Time Tracker
            </h3>

            <div className="p-6 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-center space-y-4">
              <span className="badge badge-info text-xs uppercase font-mono font-bold">
                {isClockedIn ? 'ON DUTY • CLOCKED IN' : 'OFF DUTY'}
              </span>
              <p className="text-4xl font-black font-mono tracking-tight text-[var(--text-primary)]">
                {formatHoursMinutes(timerSeconds)}
              </p>
              <p className="text-xs text-slate-400">Shift Started: Today at 09:00 AM</p>

              <button
                onClick={() => setIsClockedIn(!isClockedIn)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mx-auto transition-all shadow-md ${
                  isClockedIn
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isClockedIn ? (
                  <>
                    <Square size={16} /> Clock Out for the Day
                  </>
                ) : (
                  <>
                    <Play size={16} /> Clock In Now
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FileText size={18} className="text-amber-400" /> My Submitted Requests & Status
              </h3>
              <Link to="/employee/leave" className="text-xs font-bold text-blue-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {myRequests.map((r) => (
                <div key={r.id} className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400">{r.id}</span>
                    <h4 className="font-bold text-sm text-[var(--text-primary)]">{r.title}</h4>
                    <p className="text-xs text-slate-400">{r.date}</p>
                  </div>
                  <span className={`badge ${r.status === 'APPROVED' ? 'badge-success' : 'badge-info'} text-[10px] uppercase font-bold`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Employee Section 2: Performance Trend Line */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Star size={18} className="text-purple-400" /> My Individual Performance Score & Target Output
          </h3>
          <WorkforceTrendLine />
        </div>
      </div>
    </RoleGuard>
  );
};
