import React, { useState, useEffect } from 'react';
import { Search, Filter, History, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [category, setCategory] = useState<'all' | 'employees' | 'departments' | 'reports' | 'security'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setFocused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = [
    { title: 'Global Headcount & Department Analytics', category: 'reports', path: '/admin/analytics' },
    { title: 'User Management & Security Scopes', category: 'security', path: '/admin/users' },
    { title: 'System Security Audit Stream', category: 'security', path: '/admin/audit-logs' },
    { title: 'Workforce Attendance Roster', category: 'employees', path: '/hr/attendance' },
    { title: 'Performance Review Matrix', category: 'employees', path: '/hr/performance' },
    { title: 'Engineering & Product Teams', category: 'departments', path: '/admin/departments' },
  ];

  const filteredResults = searchResults.filter((r) => {
    const matchesCat = category === 'all' || r.category === category;
    const matchesQ = !query || r.title.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQ;
  });

  const handleSelect = (path: string) => {
    setFocused(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="relative w-full max-w-[400px]">
      <div className="relative w-full flex items-center">
        <Search size={16} strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
        <input
          type="text"
          value={query}
          onFocus={() => setFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${category === 'all' ? 'platform' : category}...`}
          className="w-full pl-9 pr-24 py-2 text-xs rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 shadow-inner transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 bg-[var(--bg-primary)] px-2 py-0.5 rounded-lg border border-[var(--border-color)] pointer-events-none hidden xl:flex items-center gap-1 shrink-0">
          Ctrl + K
        </kbd>
      </div>

      {focused && (
        <div className="absolute left-0 right-0 top-full mt-2 p-4 shadow-2xl z-50 bg-[var(--bg-secondary)] border border-[var(--border-color)] backdrop-blur-xl rounded-2xl space-y-3 text-[var(--text-primary)]">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Filter size={14} /> Category Scope
            </span>
            <button onClick={() => setFocused(false)} className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5">
              <X size={12} /> Close
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['all', 'employees', 'departments', 'reports', 'security'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold capitalize transition-colors ${
                  category === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-[var(--bg-tertiary)] text-slate-400 hover:text-[var(--text-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[var(--border-color)] max-h-60 overflow-y-auto space-y-1">
            {filteredResults.length === 0 ? (
              <p className="text-xs text-slate-400 py-2 text-center">No matching results found</p>
            ) : (
              filteredResults.map((res, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(res.path)}
                  className="w-full text-left px-3 py-2 rounded-xl bg-[var(--bg-tertiary)]/60 hover:bg-[var(--bg-tertiary)] text-xs text-[var(--text-primary)] font-medium flex items-center justify-between transition-colors"
                >
                  <span>{res.title}</span>
                  <span className="text-[10px] font-mono uppercase bg-[var(--bg-primary)] text-slate-400 px-1.5 py-0.5 rounded border border-[var(--border-color)]">
                    {res.category}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
