export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getRoleBadgeClass = (role: string): string => {
  switch (role) {
    case 'ADMIN': return 'badge-admin';
    case 'HR': return 'badge-hr';
    case 'TEAM_MANAGER': return 'badge-manager';
    case 'TEAM_LEAD': return 'badge-lead';
    case 'EMPLOYEE': return 'badge-employee';
    default: return 'badge-info';
  }
};
