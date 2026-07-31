import { Role } from '../roles/roles';
import { Permission } from '../permissions/permissions';

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  userId: string;
  userRole: Role;
  action: string;
  permissionRequired?: Permission;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  details: string;
  ipAddress: string;
}

class AuditLogger {
  private logs: AuditLogEvent[] = [
    {
      id: 'AUD-901',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      userId: 'usr-101',
      userRole: Role.SYSTEM_ADMIN,
      action: 'SYSTEM_POLICY_UPDATE',
      permissionRequired: Permission.ACCESS_POLICY_MANAGE,
      status: 'SUCCESS',
      details: 'Updated global authentication policy and MFA enforced.',
      ipAddress: '192.168.1.1',
    },
    {
      id: 'AUD-902',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      userId: 'usr-102',
      userRole: Role.HR_ADMIN,
      action: 'EMPLOYEE_RECORD_CREATE',
      permissionRequired: Permission.EMPLOYEE_CREATE,
      status: 'SUCCESS',
      details: 'Created employee profile for Alex Mercer (Frontend Team).',
      ipAddress: '192.168.1.45',
    },
    {
      id: 'AUD-903',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      userId: 'usr-105',
      userRole: Role.EMPLOYEE,
      action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
      permissionRequired: Permission.ROLE_CREATE,
      status: 'DENIED',
      details: 'Employee attempted to access System Settings page.',
      ipAddress: '10.0.0.88',
    },
  ];

  log(event: Omit<AuditLogEvent, 'id' | 'timestamp'>) {
    const logItem: AuditLogEvent = {
      ...event,
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(logItem);
    console.log(`[SECURITY AUDIT LOG] ${logItem.status}: ${logItem.action} by ${logItem.userId} (${logItem.userRole})`);
  }

  getLogs(): AuditLogEvent[] {
    return this.logs;
  }
}

export const auditLogger = new AuditLogger();
