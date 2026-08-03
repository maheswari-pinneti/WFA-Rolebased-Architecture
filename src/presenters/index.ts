/**
 * Presenter Layer Interfaces & Presenters
 * Connects Presentation View with Business Layer
 */

export interface PresenterResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class AuthenticationPresenter {
  validateEmailDomain(email: string): boolean {
    return email.endsWith('@company.com');
  }

  handleLoginSuccess(token: string): void {
    localStorage.setItem('auth_token', token);
  }
}

export class DashboardPresenter {
  formatMetric(value: number, type: 'currency' | 'percentage' | 'count'): string {
    if (type === 'currency') return `$${value.toLocaleString()}`;
    if (type === 'percentage') return `${value.toFixed(1)}%`;
    return value.toLocaleString();
  }
}

export class EmployeePresenter {}
export class AttendancePresenter {}
export class PerformancePresenter {}
export class ReportPresenter {}
export class PermissionPresenter {}
