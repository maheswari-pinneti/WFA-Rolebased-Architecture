import React, { useState } from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Settings, Save } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const HRSettings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [approvalsAlerts, setApprovalsAlerts] = useState(true);

  return (
    <RoleGuard allowedRoles={[Role.HR, Role.ADMIN]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <Settings size={24} className="text-slate-400" />
              HR Platform Settings
            </h2>
            <p className="text-sm text-slate-400">Configure global workspace preferences, notification scopes, and email digests.</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2">
            <Save size={16} /> Save Settings
          </Button>
        </div>

        <div className="glass-panel p-6 space-y-4 max-w-2xl">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-bold text-sm text-slate-200">Weekly Summary Email Digests</div>
              <div className="text-xs text-slate-400">Send overall headcount and attendance metrics to managers</div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-slate-800/60">
            <div>
              <div className="font-bold text-sm text-slate-200">Leave Requests Approvals Warnings</div>
              <div className="text-xs text-slate-400">Receive desktop alerts when correction queue reaches limit thresholds</div>
            </div>
            <input
              type="checkbox"
              checked={approvalsAlerts}
              onChange={(e) => setApprovalsAlerts(e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
