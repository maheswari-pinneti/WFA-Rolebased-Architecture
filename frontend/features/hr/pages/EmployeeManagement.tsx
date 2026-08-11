import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { fetchEmployeesThunk, updateEmployeeStatusThunk } from '../store/hrSlice';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { DataTable, Column } from '../../../shared/components/DataTable';
import { Employee } from '../../../shared/types/common.types';
import { formatDate } from '../../../shared/utils/helpers';
import { UserPlus } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const EmployeeManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, isLoading } = useSelector((state: RootState) => state.hr);

  useEffect(() => {
    dispatch(fetchEmployeesThunk());
  }, [dispatch]);

  const handleStatusChange = (id: string, status: Employee['status']) => {
    dispatch(updateEmployeeStatusThunk({ id, status }));
  };

  const columns: Column<Employee>[] = [
    {
      header: 'Employee ID',
      cell: (emp: Employee) => {
        const dateStr = emp.joining_date || emp.joinDate || '2025-01-01';
        const year = dateStr.split('-')[0] || '2025';
        const nameClean = (emp.name || `${emp.first_name || ''} ${emp.last_name || ''}`).trim();
        const firstTwoLetters = nameClean.substring(0, 2).toUpperCase().padEnd(2, 'X');
        const digits = String(emp.id).replace(/\D/g, '');
        const indexStr = digits ? digits.padStart(4, '0') : '0001';
        const formattedId = `STK-${year}-${firstTwoLetters}${indexStr}`;
        return (
          <span className="font-mono font-bold text-slate-300">
            {formattedId}
          </span>
        );
      }
    },
    {
      header: 'Employee Name',
      cell: (emp: Employee) => (
        <div className="flex items-center gap-3">
          <img
            src={emp.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
            alt={emp.name || `${emp.first_name} ${emp.last_name}`}
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
          />
          <span className="font-bold text-slate-100">{emp.name || `${emp.first_name || ''} ${emp.last_name || ''}`}</span>
        </div>
      ),
    },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Designation', accessorKey: 'designation' },
    {
      header: 'Employment Status',
      cell: (emp: Employee) => {
        const status = emp.employment_status || 'Active';
        const colorClass = status === 'Active' ? 'text-emerald-400' :
                           status === 'Inactive' ? 'text-slate-400' :
                           status === 'On Leave' ? 'text-amber-400' :
                                                   'text-rose-400';
        return (
          <span className={`font-semibold text-xs flex items-center gap-1.5 ${colorClass}`}>
            <span className="text-[10px]">●</span> {status}
          </span>
        );
      }
    },
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Phone',
      cell: (emp: Employee) => emp.phone || '—'
    },
    {
      header: 'Location',
      cell: (emp: Employee) => emp.location || '—'
    },
    {
      header: 'Joining Date',
      cell: (emp: Employee) => formatDate(emp.joining_date || emp.joinDate || '2025-01-01'),
    },
    {
      header: 'Manager',
      cell: (emp: Employee) => emp.manager_name || '—'
    },
    {
      header: 'Attendance Status',
      cell: (emp: Employee) => {
        const att = emp.attendance_status || emp.status || 'Present';
        const colorClass = att.toUpperCase() === 'PRESENT' || att.toUpperCase() === 'REMOTE' ? 'text-emerald-400' :
                           att.toUpperCase() === 'LATE' ? 'text-amber-400' :
                                                          'text-rose-400';
        return (
          <span className={`font-semibold text-xs flex items-center gap-1.5 ${colorClass}`}>
            <span className="text-[10px]">●</span> {att}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      cell: () => (
        <div className="flex items-center gap-3 text-slate-400 cursor-pointer select-none">
          <span className="hover:text-slate-200 transition-colors" title="View details">👁</span>
          <span className="hover:text-slate-200 transition-colors text-lg" title="More options">⋮</span>
        </div>
      )
    }
  ];

  return (
    <RoleGuard allowedRoles={[Role.ADMIN, Role.HR]} requiredPermission={Permission.EMPLOYEE_MANAGE}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Workforce Employee Directory</h2>
            <p className="text-sm text-slate-400">Complete workforce personnel roster and department assignments</p>
          </div>
          <Button icon={<UserPlus size={16} />}>Onboard Employee</Button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Loading workforce directory...</div>
        ) : (
          <div className="glass-panel p-6 space-y-4">
            <DataTable
              data={employees}
              columns={columns}
              searchPlaceholder="Search by code, name, designation, department..."
              searchFilter={(emp: Employee, q: string) => {
                const nameStr = emp.name || `${emp.first_name || ''} ${emp.last_name || ''}`;
                const code = emp.employeeCode || emp.code || '';
                const desig = emp.designation || '';
                return (
                  nameStr.toLowerCase().includes(q) ||
                  code.toLowerCase().includes(q) ||
                  emp.department.toLowerCase().includes(q) ||
                  desig.toLowerCase().includes(q)
                );
              }}
            />

            {/* Table Footer with Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border-color)]">
              <div className="text-xs text-slate-400">
                Showing 1–{employees.length} of {employees.length} employees
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                <button className="px-2 py-1 rounded hover:bg-slate-800 transition-colors">←</button>
                <button className="px-2.5 py-1 rounded bg-blue-600 text-white shadow-md">1</button>
                <button className="px-2.5 py-1 rounded hover:bg-slate-800 transition-colors">2</button>
                <button className="px-2.5 py-1 rounded hover:bg-slate-800 transition-colors">3</button>
                <button className="px-2.5 py-1 rounded hover:bg-slate-800 transition-colors">4</button>
                <button className="px-2.5 py-1 rounded hover:bg-slate-800 transition-colors">5</button>
                <span className="px-1 text-slate-500">...</span>
                <button className="px-2.5 py-1 rounded hover:bg-slate-800 transition-colors">10</button>
                <button className="px-2 py-1 rounded hover:bg-slate-800 transition-colors">→</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
};
