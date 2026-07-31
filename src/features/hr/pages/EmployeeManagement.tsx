import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { fetchEmployeesThunk, updateEmployeeStatusThunk } from '../store/hrSlice';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Permission } from '../../../security/permissions/permissions';
import { DataTable, Column } from '../../../shared/components/DataTable';
import { Employee } from '../../../shared/types/common.types';
import { formatDate, getRoleBadgeClass } from '../../../shared/utils/helpers';
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
      header: 'Employee Name',
      cell: (emp) => (
        <div className="flex items-center gap-3">
          <img
            src={emp.avatar}
            alt={emp.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
          />
          <div>
            <p className="font-bold text-slate-100">{emp.name}</p>
            <p className="text-xs text-slate-400">{emp.employeeCode} • {emp.email}</p>
          </div>
        </div>
      ),
    },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Designation', accessorKey: 'designation' },
    {
      header: 'Role',
      cell: (emp) => (
        <span className={`badge ${getRoleBadgeClass(emp.role)}`}>
          {emp.role}
        </span>
      ),
    },
    {
      header: 'Workplace Status',
      cell: (emp) => (
        <select
          value={emp.status}
          onChange={(e) => handleStatusChange(emp.id, e.target.value as Employee['status'])}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 text-slate-200 cursor-pointer"
        >
          <option value="PRESENT">PRESENT</option>
          <option value="REMOTE">REMOTE</option>
          <option value="ON_LEAVE">ON_LEAVE</option>
          <option value="OFFLINE">OFFLINE</option>
        </select>
      ),
    },
    {
      header: 'Performance',
      cell: (emp) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full"
              style={{ width: `${emp.performanceScore}%` }}
            />
          </div>
          <span className="text-xs font-bold">{emp.performanceScore}%</span>
        </div>
      ),
    },
    {
      header: 'Joined Date',
      cell: (emp) => formatDate(emp.joinDate),
    },
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
          <div className="glass-panel p-6">
            <DataTable
              data={employees}
              columns={columns}
              searchPlaceholder="Search by code, name, designation, department..."
              searchFilter={(emp, q) =>
                emp.name.toLowerCase().includes(q) ||
                emp.employeeCode.toLowerCase().includes(q) ||
                emp.department.toLowerCase().includes(q) ||
                emp.designation.toLowerCase().includes(q)
              }
            />
          </div>
        )}
      </div>
    </RoleGuard>
  );
};
