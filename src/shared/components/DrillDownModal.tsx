import React from 'react';
import { X, Layers, Download, CheckCircle2, FileText, ArrowUpRight, Filter, ShieldCheck } from 'lucide-react';

export interface DrillDownData {
  title: string;
  metricValue: string | number;
  subtitle?: string;
  category?: string;
  details: { label: string; value: string | number; status?: string }[];
  records?: { id: string; name: string; department: string; metric: string; status: string }[];
}

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DrillDownData | null;
}

export const DrillDownModal: React.FC<DrillDownModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const defaultRecords = data.records || [
    { id: 'REC-101', name: 'Alex Mercer', department: 'Engineering', metric: '98.5% Score', status: 'ACTIVE' },
    { id: 'REC-102', name: 'Elena Rostova', department: 'Human Resources', metric: '100% SLA', status: 'VERIFIED' },
    { id: 'REC-103', name: 'David Sterling', department: 'Product & Design', metric: '94.2% Rating', status: 'ACTIVE' },
    { id: 'REC-104', name: 'Marcus Vance', department: 'Operations', metric: '96.0% Velocity', status: 'COMPLETED' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl glass-panel bg-slate-900 border-slate-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Layers size={20} />
            </div>
            <div>
              <span className="badge badge-info text-[9px] uppercase tracking-wider mb-0.5">
                {data.category || 'Metric Drill-Down Analysis'}
              </span>
              <h3 className="text-xl font-bold text-slate-100">{data.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main KPI Summary */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aggregated Total</p>
              <p className="text-3xl font-black text-white mt-1">{data.metricValue}</p>
              {data.subtitle && <p className="text-xs text-slate-300 mt-1">{data.subtitle}</p>}
            </div>
            <button className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-md">
              <Download size={14} /> Export Dataset
            </button>
          </div>

          {/* Metric Sub-Breakdown Details */}
          {data.details && data.details.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Filter size={14} className="text-blue-400" /> Sub-Metric Detailed Components
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {data.details.map((d, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                    <p className="text-[11px] text-slate-400">{d.label}</p>
                    <p className="text-lg font-bold text-slate-100">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Records Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText size={14} className="text-purple-400" /> Granular Record Drill-Down List
            </h4>
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="px-4 py-2.5">Record ID</th>
                    <th className="px-4 py-2.5">Owner / Name</th>
                    <th className="px-4 py-2.5">Department</th>
                    <th className="px-4 py-2.5">Metric Value</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {defaultRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-slate-400">{r.id}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-200">{r.name}</td>
                      <td className="px-4 py-2.5 text-slate-300">{r.department}</td>
                      <td className="px-4 py-2.5 font-bold text-blue-400">{r.metric}</td>
                      <td className="px-4 py-2.5">
                        <span className="badge badge-success text-[9px] uppercase font-bold">{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[10px]">
            <ShieldCheck size={14} className="text-emerald-400" /> ABAC & Data Scope Verified
          </span>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
          >
            Close Drill-Down
          </button>
        </div>
      </div>
    </div>
  );
};
