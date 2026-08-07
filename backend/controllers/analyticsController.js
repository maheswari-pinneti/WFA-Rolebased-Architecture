export const getAnalytics = (req, res) => {
  const growthData = [
    { name: 'Jan', headcount: 120, hiring: 12 },
    { name: 'Feb', headcount: 125, hiring: 8 },
    { name: 'Mar', headcount: 135, hiring: 15 },
    { name: 'Apr', headcount: 140, hiring: 7 },
    { name: 'May', headcount: 150, hiring: 12 },
    { name: 'Jun', headcount: 162, hiring: 18 }
  ];

  const deptDistribution = [
    { name: 'Engineering', value: 45, color: '#3b82f6' },
    { name: 'Human Resources', value: 15, color: '#a855f7' },
    { name: 'Finance', value: 20, color: '#eab308' },
    { name: 'Sales & Marketing', value: 30, color: '#10b981' },
    { name: 'Operations', value: 10, color: '#f43f5e' }
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 85, color: '#10b981' },
    { name: 'Moderate Risk', value: 12, color: '#f59e0b' },
    { name: 'High Risk', value: 3, color: '#ef4444' }
  ];

  const skillGaps = [
    { subject: 'React / Frontend', A: 90, B: 75, fullMark: 100 },
    { subject: 'Node.js / Express', A: 85, B: 60, fullMark: 100 },
    { subject: 'SQL / Databases', A: 80, B: 70, fullMark: 100 },
    { subject: 'Cloud / AWS', A: 70, B: 40, fullMark: 100 },
    { subject: 'Security / RBAC', A: 95, B: 90, fullMark: 100 }
  ];

  res.json({
    success: true,
    data: {
      growthData,
      deptDistribution,
      riskDistribution,
      skillGaps
    }
  });
};
