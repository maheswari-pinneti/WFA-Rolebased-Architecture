import React, { useState, useMemo } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { Search, Filter, ShieldCheck, CheckCircle2, AlertCircle, Building2, User } from 'lucide-react';

export interface EmployeeRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  title: string;
  location: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'REMOTE';
  attendanceRate: string;
  performanceScore: number;
}

export const VirtualizedDataGrid: React.FC = () => {
  const { deptScope } = useSecurity();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Generate 20,000 Virtualized Mock Records
  const allEmployees = useMemo<EmployeeRecord[]>(() => {
    const roles = ['ADMIN', 'HR_MANAGER', 'DEPT_MANAGER', 'TEAM_LEAD', 'EMPLOYEE'];
    const departments = ['Engineering & IT', 'Human Resources', 'Sales & Growth', 'Finance', 'Product Operations'];
    const locations = ['Global HQ', 'New York Campus', 'San Francisco', 'London Hub', 'Tokyo Branch'];
    const statuses: ('ACTIVE' | 'ON_LEAVE' | 'REMOTE')[] = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'REMOTE', 'ON_LEAVE'];

    const records: EmployeeRecord[] = [];
    for (let i = 1; i <= 20000; i++) {
      const dept = departments[i % departments.length];
      const role = roles[i % roles.length];
      records.push({
        id: `EMP-${10000 + i}`,
        name: `Employee ${i} (${dept.split(' ')[0]})`,
        email: `employee.${i}@thestackly.com`,
        role,
        department: dept,
        title: `${role.replace('_', ' ')} Specialist`,
        location: locations[i % locations.length],
        status: statuses[i % statuses.length],
        attendanceRate: `${(92 + (i % 8)).toFixed(1)}%`,
        performanceScore: 75 + (i % 25),
      });
    }
    return records;
  }, []);

  // Filter based on DBAC Department Scope & Search Query
  const filteredEmployees = useMemo(() => {
    return allEmployees.filter((emp) => {
      const matchesDept = deptScope === 'All Departments' || emp.department === deptScope;
      const matchesSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.id.toLowerCase().includes(search.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [allEmployees, deptScope, search]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  const currentRecords = filteredEmployees.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 size={18} className="text-blue-500" />
            <span>20,000 High-Performance Virtualized Employee DataGrid</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Active DBAC Scope: <strong className="text-blue-600 dark:text-blue-400">{deptScope}</strong> • Total Filtered: <strong className="text-emerald-600 dark:text-emerald-400">{filteredEmployees.length.toLocaleString()} Records</strong>
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search 20,000 records..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-950/50">
              <th className="p-3">ID</th>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Department</th>
              <th className="p-3">Location</th>
              <th className="p-3">Status</th>
              <th className="p-3">Attendance</th>
              <th className="p-3">KPI Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {currentRecords.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{emp.id}</td>
                <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p>{emp.name}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{emp.email}</p>
                  </div>
                </td>
                <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-bold">
                    {emp.role}
                  </span>
                </td>
                <td className="p-3 font-medium text-slate-600 dark:text-slate-400">{emp.department}</td>
                <td className="p-3 text-slate-500">{emp.location}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      emp.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : emp.status === 'REMOTE'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    ● {emp.status}
                  </span>
                </td>
                <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{emp.attendanceRate}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-white font-mono">{emp.performanceScore}%</span>
                    <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${emp.performanceScore}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
        <span>Showing Page {page} of {totalPages || 1}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
