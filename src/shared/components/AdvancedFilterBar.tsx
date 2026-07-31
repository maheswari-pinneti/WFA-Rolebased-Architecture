import React, { useState } from 'react';
import { Filter, Calendar, Building2, MapPin, Search, RotateCcw, ChevronDown, Check } from 'lucide-react';

export interface FilterState {
  dateRange: string;
  department: string;
  location: string;
  status: string;
  searchQuery: string;
}

interface AdvancedFilterBarProps {
  onFilterChange: (filters: FilterState) => void;
}

export const AdvancedFilterBar: React.FC<AdvancedFilterBarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'This Quarter (Q2 2026)',
    department: 'All Departments',
    location: 'All Locations',
    status: 'All Statuses',
    searchQuery: '',
  });

  const [expanded, setExpanded] = useState(false);

  const dateRanges = ['Today', 'This Week', 'This Month', 'This Quarter (Q2 2026)', 'Year to Date (YTD)'];
  const departments = ['All Departments', 'Engineering & Technology', 'Human Resources', 'Product & Design', 'Enterprise Sales', 'Global Operations'];
  const locations = ['All Locations', 'San Francisco HQ', 'New York', 'London HQ', 'Tokyo'];
  const statuses = ['All Statuses', 'ACTIVE / ON DUTY', 'REMOTE', 'ON LEAVE', 'OFFLINE'];

  const handleChange = (key: keyof FilterState, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const resetState: FilterState = {
      dateRange: 'This Quarter (Q2 2026)',
      department: 'All Departments',
      location: 'All Locations',
      status: 'All Statuses',
      searchQuery: '',
    };
    setFilters(resetState);
    onFilterChange(resetState);
  };

  const activeCount = Object.entries(filters).filter(([k, v]) => {
    if (k === 'dateRange') return v !== 'This Quarter (Q2 2026)';
    if (k === 'department') return v !== 'All Departments';
    if (k === 'location') return v !== 'All Locations';
    if (k === 'status') return v !== 'All Statuses';
    if (k === 'searchQuery') return v !== '';
    return false;
  }).length;

  return (
    <div className="glass-panel p-4 rounded-2xl border-slate-800/80 space-y-3 shadow-md bg-slate-900/90 text-slate-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Title & Active Count */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
            <Filter size={18} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              Advanced Dashboard Data Filters
              {activeCount > 0 && (
                <span className="badge badge-info text-[10px] px-2 py-0.5 font-bold">
                  {activeCount} Active Filter{activeCount > 1 ? 's' : ''}
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-400">Filter real-time KPI metrics, charts, and drill-down datasets</p>
          </div>
        </div>

        {/* Quick Filter Inputs */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Dropdown */}
          <div className="relative">
            <select
              value={filters.dateRange}
              onChange={(e) => handleChange('dateRange', e.target.value)}
              className="pl-8 pr-8 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-medium focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
            >
              {dateRanges.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Department Dropdown */}
          <div className="relative">
            <select
              value={filters.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className="pl-8 pr-8 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-medium focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <Building2 size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Location Dropdown */}
          <div className="relative">
            <select
              value={filters.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="pl-8 pr-8 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-medium focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
            >
              {locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Reset Filters Button */}
          {activeCount > 0 && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
