import { Role } from '../../security/roles/roles';

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  designation: string;
  managerId?: string;
  managerName?: string;
  joinDate: string;
  status: 'PRESENT' | 'REMOTE' | 'ON_LEAVE' | 'OFFLINE';
  performanceScore: number; // 0 - 100
  attendanceRate: number; // Percentage
  avatar: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT' | 'ON_LEAVE';
  workMode: 'OFFICE' | 'REMOTE' | 'HYBRID';
  hoursWorked: number;
}

export interface DashboardMetric {
  title: string;
  value: string | number;
  change: number; // percentage change
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  category?: string;
}
