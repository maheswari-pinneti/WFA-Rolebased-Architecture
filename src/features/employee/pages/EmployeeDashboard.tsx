import React, { useState } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { KPICard } from '../../../components/cards/KPICard';
import { EmployeeTable } from '../../../components/tables/EmployeeTable';
import { WorkforceTrendLine } from '../../analytics/charts/WorkforceTrendLine';
import { DepartmentOverviewBar } from '../../analytics/charts/DepartmentOverviewBar';
import { AttendanceAnalyticsArea } from '../../analytics/charts/AttendanceAnalyticsArea';
import { EmployeeDistributionPie } from '../../analytics/charts/EmployeeDistributionPie';
import { PerformanceRadar } from '../../analytics/charts/PerformanceRadar';
import { SalaryAnalyticsBar } from '../../analytics/charts/SalaryAnalyticsBar';
import { AttritionDonut } from '../../analytics/charts/AttritionDonut';
import { ExportReport } from '../../reports/components/ExportReport';
import { Clock, Play, Square, Sparkles, Users, UserCheck, ShieldCheck, Zap, HeartHandshake, FileText, Star, AlertTriangle } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [clockedIn, setClockedIn] = useState(true);
  const [clockTime, setClockTime] = useState('08:58 AM');

  const handleToggleClock = () => {
    if (clockedIn) {
      setClockedIn(false);
    } else {
      setClockedIn(true);
      setClockTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Employee Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/30 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Sparkles size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-white">Welcome back, {user?.name || 'Developer'}!</h2>
              <span className="badge badge-employee">EMPLOYEE SELF SERVICE</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">Stackly personal workspace, attendance punch clock, 8 KPI cards & team roster</p>
          </div>
        </div>
      </div>

      {/* Interactive Shift Punch Widget */}
      <div className="glass-panel p-6 bg-slate-900/90 border-emerald-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${clockedIn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'}`}>
              <Clock size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">Shift Punch Status:</h3>
                <span className={`badge ${clockedIn ? 'badge-success' : 'badge-danger'}`}>
                  {clockedIn ? 'CLOCKED IN' : 'CLOCKED OUT'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {clockedIn ? `Checked in today at ${clockTime} (Work Mode: OFFICE)` : 'Shift inactive'}
              </p>
            </div>
          </div>

          <Button
            variant={clockedIn ? 'danger' : 'primary'}
            size="lg"
            icon={clockedIn ? <Square size={18} /> : <Play size={18} />}
            onClick={handleToggleClock}
          >
            {clockedIn ? 'Clock Out Shift' : 'Clock In Shift'}
          </Button>
        </div>
      </div>

      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Employees" value="1,248" change={8.4} trend="up" subtitle="Organization total" icon={<Users size={20} />} accentColor="blue" />
        <KPICard title="Active Workforce" value="1,180 (94.5%)" change={2.1} trend="up" subtitle="Shift active today" icon={<UserCheck size={20} />} accentColor="emerald" />
        <KPICard title="Attendance Rate" value="98.2%" change={1.2} trend="up" subtitle="Personal punctuality" icon={<ShieldCheck size={20} />} accentColor="cyan" />
        <KPICard title="Productivity Score" value="94.2 / 100" change={4.1} trend="up" subtitle="Exceeds SLA target" icon={<Zap size={20} />} accentColor="purple" />
        <KPICard title="Employee Satisfaction" value="95.2 eNPS" change={3.0} trend="up" subtitle="Workspace score" icon={<HeartHandshake size={20} />} accentColor="emerald" />
        <KPICard title="Open Requests" value="14 Days PTO" change={0.0} trend="neutral" subtitle="Available annual leave" icon={<FileText size={20} />} accentColor="amber" />
        <KPICard title="Performance Rating" value="4.8 / 5.0" change={0.4} trend="up" subtitle="Q2 Senior Score" icon={<Star size={20} />} accentColor="amber" />
        <KPICard title="Attrition Risk" value="1.2% Low" change={-0.8} trend="down" subtitle="High team tenure" icon={<AlertTriangle size={20} />} accentColor="rose" />
      </div>

      {/* 2. Workforce Trend (Line Chart) & 3. Department Overview (Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WorkforceTrendLine />
        <DepartmentOverviewBar />
      </div>

      {/* 4. Attendance Analytics (Area Chart) & 5. Employee Distribution (Pie Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceAnalyticsArea />
        <EmployeeDistributionPie />
      </div>

      {/* 6. Performance Analysis (Radar Chart) & 7. Salary Analytics (Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceRadar />
        <SalaryAnalyticsBar />
      </div>

      {/* 8. Attrition (Donut Chart) */}
      <div className="grid grid-cols-1 gap-6">
        <AttritionDonut />
      </div>

      {/* 9. Employee Table */}
      <EmployeeTable />

      <ExportReport title="Export Personal Work Log & Attendance Summary" />
    </div>
  );
};
