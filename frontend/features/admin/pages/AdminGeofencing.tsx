import React from 'react';
import { RoleGuard } from '../../../security/guards/RoleGuard';
import { Role } from '../../../security/roles/roles';
import { Globe, MapPin, ShieldAlert, Cpu } from 'lucide-react';

export const AdminGeofencing: React.FC = () => {
  return (
    <RoleGuard allowedRoles={[Role.ADMIN]}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Globe size={24} className="text-teal-400" />
            Geofencing Coordinates Policy
          </h2>
          <p className="text-sm text-slate-400">Configure geographical office coordinates and tracking boundaries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <MapPin className="text-teal-400" size={18} />
              Office Coordinates (MAHE Bangalore)
            </h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between"><span>Latitude:</span> <strong className="font-mono text-white">12.9716</strong></div>
              <div className="flex justify-between"><span>Longitude:</span> <strong className="font-mono text-white">77.5946</strong></div>
              <div className="flex justify-between"><span>Allowed Radius:</span> <strong className="font-mono text-white">100 meters</strong></div>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldAlert className="text-rose-400" size={18} />
              Violations Detected YTD
            </h3>
            <div className="text-3xl font-black text-rose-400">12</div>
            <p className="text-xs text-slate-400">Remote check-in attempts outside configured geofences rejected automatically by server authorization.</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};
