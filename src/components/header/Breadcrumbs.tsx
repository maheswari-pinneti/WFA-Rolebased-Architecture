import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const formatSegment = (segment: string) => {
    return segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
      <Link to="/" className="hover:text-blue-500 flex items-center gap-1 transition-colors">
        <Home size={14} />
      </Link>
      {pathSegments.map((segment, idx) => {
        const url = `/${pathSegments.slice(0, idx + 1).join('/')}`;
        const isLast = idx === pathSegments.length - 1;

        return (
          <React.Fragment key={url}>
            <ChevronRight size={12} className="text-slate-500 shrink-0" />
            {isLast ? (
              <span className="font-bold text-[var(--text-primary)]">{formatSegment(segment)}</span>
            ) : (
              <Link to={url} className="hover:text-blue-500 transition-colors">
                {formatSegment(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
