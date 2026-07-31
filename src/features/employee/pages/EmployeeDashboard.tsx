import React, { useState, useEffect } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { KPICard } from '../../../components/cards/KPICard';
import { AdvancedFilterBar } from '../../../shared/components/AdvancedFilterBar';
import { DrillDownModal, DrillDownData } from '../../../shared/components/DrillDownModal';

// 6 Interactive Charts
import { WorkforceTrendLine } from '../../analytics/charts/WorkforceTrendLine';
import { DepartmentOverviewBar } from '../../analytics/charts/DepartmentOverviewBar';
import { AttendanceAnalyticsArea } from '../../analytics/charts/AttendanceAnalyticsArea';
import { EmployeeDistributionPie } from '../../analytics/charts/EmployeeDistributionPie';
import { PerformanceRadar } from '../../analytics/charts/PerformanceRadar';
import { SalaryAnalyticsBar } from '../../analytics/charts/SalaryAnalyticsBar';

import { Clock, Play, Square, Calendar, Star, FileText, Compass, CheckCircle2, DollarSign, Target, Activity, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmployeeDashboard: React.FC = () => {
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(25200); // 7 hours

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

  const openDrillDown = (title: string, value: string | number, subtitle: string, details: { label: string; value: string | number }[]) => {
    setDrillDownData({
      title,
      metricValue: value,
      subtitle,
      category: 'Employee Self-Service Scope',
      details,
    });
  };

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

        {/* Advanced Filter Bar */}
        <AdvancedFilterBar onFilterChange={() => {}} />

        {/* 8 Reusable Employee KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="My Shift Attendance"
            value="98.5%"
            change={1.5}
            trend="up"
            subtitle="Monthly compliance"
            icon={<Clock size={20} />}
            accentColor="emerald"
            onClick={() => openDrillDown('My Shift Attendance Log', '98.5%', 'Personal monthly shift clock-ins', [
              { label: 'Total Hours Worked', value: '168 Hours' },
              { label: 'On-Time Clock Ins', value: 21 },
              { label: 'Overtime Hours', value: '12 Hours' },
            ])}
          />
          <KPICard
            title="Leave Balance"
            value="14 Days PTO"
            change={0.0}
            trend="neutral"
            subtitle="Annual allocation"
            icon={<Calendar size={20} />}
            accentColor="cyan"
            onClick={() => openDrillDown('My Annual PTO Leave Balance', '14 Days PTO Remaining', 'Accrued vacation and sick leave', [
              { label: 'Annual Paid Leave', value: '10 Days' },
              { label: 'Sick / Personal', value: '4 Days' },
              { label: 'Used Days (2026)', value: '6 Days' },
            ])}
          />
          <KPICard
            title="Performance Score"
            value="96 / 100"
            change={3.2}
            trend="up"
            subtitle="Q2 Assessment"
            icon={<Star size={20} />}
            accentColor="purple"
            onClick={() => openDrillDown('My Q2 Performance Score', '96 / 100 Score', 'Quarterly developer performance score', [
              { label: 'Code Quality Rating', value: '98%' },
              { label: 'Task Delivery Speed', value: '94%' },
              { label: 'Team Collaboration', value: '96%' },
            ])}
          />
          <KPICard
            title="Recent Payslip"
            value="$8,450.00"
            change={0.0}
            trend="neutral"
            subtitle="July 2026 Processed"
            icon={<DollarSign size={20} />}
            accentColor="amber"
            onClick={() => openDrillDown('July 2026 Monthly Payslip', '$8,450.00 Net Salary', 'Personal payroll statement details', [
              { label: 'Base Gross Salary', value: '$9,200.00' },
              { label: 'Tax Deductions', value: '$1,150.00' },
              { label: 'Overtime Bonus', value: '$400.00' },
            ])}
          />
          <KPICard
            title="Active Goals"
            value="4 Objectives"
            change={25.0}
            trend="up"
            subtitle="2 Completed Q2"
            icon={<Target size={20} />}
            accentColor="rose"
            onClick={() => openDrillDown('My Development Goals', '4 Active Goals', 'Annual career development objectives', [
              { label: 'Goal 1: Master ABAC Security Engine', value: 'Completed' },
              { label: 'Goal 2: Lead Frontend Performance Review', value: 'In Progress (80%)' },
            ])}
          />
          <KPICard
            title="Completed Tasks"
            value="28 Delivered"
            change={14.0}
            trend="up"
            subtitle="Sprint story points"
            icon={<CheckCircle2 size={20} />}
            accentColor="emerald"
            onClick={() => openDrillDown('My Completed Sprint Tasks', '28 Tasks Delivered', 'Shipped code PRs and deliverables', [
              { label: 'Pull Requests Merged', value: 18 },
              { label: 'Bug Fixes Closed', value: 10 },
            ])}
          />
          <KPICard
            title="Training Credits"
            value="12 Hours"
            change={4.0}
            trend="up"
            subtitle="Security & Tech certs"
            icon={<Compass size={20} />}
            accentColor="blue"
            onClick={() => openDrillDown('My Professional Development', '12 Training Hours', 'Completed corporate learning modules', [
              { label: 'Cybersecurity Certification', value: 'Passed' },
              { label: 'React Performance Tuning', value: 'Passed' },
            ])}
          />
          <KPICard
            title="Team Morale Rating"
            value="4.9 / 5.0"
            change={0.2}
            trend="up"
            subtitle="High team morale"
            icon={<HeartHandshake size={20} />}
            accentColor="cyan"
            onClick={() => openDrillDown('My Peer Feedback Score', '4.9 / 5.0 Score', '360 peer feedback evaluation rating', [
              { label: 'Peer Review Rating', value: '4.9 / 5.0' },
              { label: 'TL Endorsement', value: 'Highly Recommended' },
            ])}
          />
        </div>

        {/* Shift Punch Clock Widget */}
        <div className="glass-panel p-6 rounded-2xl border-[var(--border-color)] space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Clock size={18} className="text-emerald-400" /> Interactive Shift Punch Clock & Time Tracker
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

        {/* 6 Distinct Interactive Charts Grid */}
        <div className="space-y-6">
          <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2">
            <Activity size={20} className="text-emerald-400" /> Personal Analytics & Performance Metrics (6 Chart Dimensions)
          </h3>

          {/* Row 1: Line Chart & Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WorkforceTrendLine />
            <DepartmentOverviewBar />
          </div>

          {/* Row 2: Area Chart & Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceAnalyticsArea />
            <EmployeeDistributionPie />
          </div>

          {/* Row 3: Radar Chart & Salary Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceRadar />
            <SalaryAnalyticsBar />
          </div>
        </div>

        {/* Drill-Down Modal */}
        <DrillDownModal
          isOpen={drillDownData !== null}
          onClose={() => setDrillDownData(null)}
          data={drillDownData}
        />
      </div>
    </RoleGuard>
  );
};
