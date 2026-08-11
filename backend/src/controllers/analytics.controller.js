import db from '../config/db.js';

const all = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
});

const getScope = (user, alias = '') => {
  const prefix = alias ? `${alias}.` : '';
  const clauses = [`${prefix}organizationId = ?`];
  const params = [user.organizationId || 'org-stackly'];

  if (user.role === 'MANAGER') {
    clauses.push(`${prefix}department = ?`);
    params.push(user.department);
  }
  if (user.role === 'TEAM_LEAD') {
    clauses.push(`${prefix}team = ?`);
    params.push(user.team);
  }
  if (user.role === 'EMPLOYEE') {
    clauses.push(`${prefix}id = ?`);
    params.push(user.id);
  }

  return { where: clauses.join(' AND '), params };
};

const percentage = (value, total) => (total ? Number(((value / total) * 100).toFixed(1)) : 0);

const buildGrowth = async (scope) => {
  const rows = await all(
    `SELECT substr(joinDate, 1, 7) AS month, COUNT(*) AS hired
     FROM employees e WHERE ${scope.where} GROUP BY month ORDER BY month`,
    scope.params
  );
  let headcount = 0;
  return rows.slice(-12).map((row) => {
    headcount += row.hired;
    return { name: row.month, headcount, hiring: row.hired };
  });
};

export const getAnalytics = async (req, res) => {
  try {
    const employeeScope = getScope(req.user, 'e');
    const attendanceScope = getScope(req.user, 'a');
    const attendanceQueryScope = { ...attendanceScope, where: attendanceScope.where.replace('a.id', 'a.employeeId') };
    const performanceScope = getScope(req.user, 'p');
    const performanceQueryScope = { ...performanceScope, where: performanceScope.where.replace('p.id', 'p.employeeId') };
    const skillScope = getScope(req.user, 's');
    const skillQueryScope = { ...skillScope, where: skillScope.where.replace('s.id', 's.employeeId') };

    const [employees, attendance, departmentComparison, roleDistribution, employmentStatus, modeDistribution, performanceByQuarter, teamProductivity, skills] = await Promise.all([
      all(`SELECT e.id, e.department, e.team, e.role, e.status, e.performanceScore, e.attendanceRate FROM employees e WHERE ${employeeScope.where}`, employeeScope.params),
      all(`SELECT a.employeeId, a.status, a.workMode, a.checkInTime, a.checkOutTime FROM attendance_records a WHERE ${attendanceQueryScope.where}`, attendanceQueryScope.params),
      all(`SELECT e.department AS name, COUNT(*) AS headcount, ROUND(AVG(e.performanceScore), 1) AS performance, ROUND(AVG(e.attendanceRate), 1) AS attendance
           FROM employees e WHERE ${employeeScope.where} GROUP BY e.department ORDER BY headcount DESC`, employeeScope.params),
      all(`SELECT e.role AS name, COUNT(*) AS value FROM employees e WHERE ${employeeScope.where} GROUP BY e.role ORDER BY value DESC`, employeeScope.params),
      all(`SELECT e.status AS name, COUNT(*) AS value FROM employees e WHERE ${employeeScope.where} GROUP BY e.status ORDER BY value DESC`, employeeScope.params),
      all(`SELECT a.workMode AS name, COUNT(DISTINCT a.employeeId) AS value FROM attendance_records a WHERE ${attendanceScope.where} GROUP BY a.workMode`, attendanceScope.params),
      all(`SELECT p.quarter AS name, ROUND(AVG(p.kpiScore), 1) AS performance, ROUND(AVG(p.targetScore), 1) AS target, ROUND(AVG(p.productivityScore), 1) AS productivity
           FROM performance_records p WHERE ${performanceQueryScope.where} GROUP BY p.quarter ORDER BY p.quarter`, performanceQueryScope.params),
      all(`SELECT p.team AS name, ROUND(AVG(p.productivityScore), 1) AS productivity, COUNT(DISTINCT p.employeeId) AS members
           FROM performance_records p WHERE ${performanceQueryScope.where} GROUP BY p.team ORDER BY productivity DESC`, performanceQueryScope.params),
      all(`SELECT s.skillName AS name, ROUND(AVG(s.level), 1) AS averageLevel, COUNT(DISTINCT s.employeeId) AS people,
                  SUM(CASE WHEN s.level >= 3 THEN 1 ELSE 0 END) AS covered, SUM(CASE WHEN s.level <= 2 THEN 1 ELSE 0 END) AS gap
           FROM skills s WHERE ${skillQueryScope.where} GROUP BY s.skillName ORDER BY people DESC`, skillQueryScope.params)
    ]);

    const growthData = await buildGrowth(employeeScope);
    const totalEmployees = employees.length;
    const activePresent = attendance.filter((record) => record.status !== 'Checked Out').length;
    const lateCount = attendance.filter((record) => record.checkInTime && new Date(record.checkInTime).getHours() >= 9 && new Date(record.checkInTime).getMinutes() > 15).length;
    const attendanceRate = employees.length
      ? Number((employees.reduce((sum, employee) => sum + (employee.attendanceRate || 0), 0) / employees.length).toFixed(1))
      : 0;
    const averagePerformance = employees.length
      ? Number((employees.reduce((sum, employee) => sum + (employee.performanceScore || 0), 0) / employees.length).toFixed(1))
      : 0;

    const attendanceOverview = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((name, index) => {
      const dayRecords = attendance.filter((record) => new Date(record.checkInTime || 0).getDay() === (index + 1));
      const present = dayRecords.filter((record) => record.status !== 'Checked Out' || record.checkInTime).length;
      return { name, present, absent: Math.max(0, totalEmployees - present), late: dayRecords.filter((record) => record.checkInTime && new Date(record.checkInTime).getMinutes() > 15).length };
    });

    const riskBuckets = { 'High Risk': 0, 'Medium Risk': 0, 'Low Risk': 0 };
    employees.forEach((employee) => {
      if ((employee.performanceScore || 0) < 75 || (employee.attendanceRate || 0) < 85) riskBuckets['High Risk'] += 1;
      else if ((employee.performanceScore || 0) < 85 || (employee.attendanceRate || 0) < 95) riskBuckets['Medium Risk'] += 1;
      else riskBuckets['Low Risk'] += 1;
    });

    const skillsAnalysis = skills.map((skill) => ({
      name: skill.name,
      averageLevel: skill.averageLevel || 0,
      coverage: percentage(skill.covered || 0, totalEmployees),
      gap: skill.gap || 0,
      people: skill.people || 0
    }));

    const analytics = {
      scope: {
        role: req.user.role,
        organizationId: req.user.organizationId || 'org-stackly',
        department: req.user.department || null,
        team: req.user.team || null,
        employeeId: req.user.role === 'EMPLOYEE' ? req.user.id : null
      },
      metrics: {
        totalWorkforce: totalEmployees,
        activePresent,
        attendanceRate: `${attendanceRate}%`,
        productivityVelocity: `${Math.round(performanceByQuarter.reduce((sum, row) => sum + (row.productivity || 0), 0) / Math.max(performanceByQuarter.length, 1))}%`,
        averagePerformanceScore: averagePerformance,
        hiringPipeline: 0,
        retentionRiskCount: riskBuckets['High Risk'],
        lateArrivals: lateCount
      },
      growthData,
      workforceGrowth: growthData,
      attendanceOverview,
      departmentComparison,
      departmentDistribution: departmentComparison.map((item) => ({ name: item.name, value: item.headcount })),
      roleDistribution,
      employmentStatus,
      workforceDistribution: modeDistribution.length ? modeDistribution : [{ name: 'No attendance data', value: 0 }],
      riskDistribution: Object.entries(riskBuckets).map(([name, value]) => ({ name, value })),
      skillsAnalysis: {
        topSkills: skillsAnalysis.filter((skill) => skill.averageLevel >= 4).slice(0, 8),
        missingSkills: skillsAnalysis.filter((skill) => skill.gap > 0).sort((a, b) => b.gap - a.gap).slice(0, 8),
        coverage: skillsAnalysis
      },
      teamProductivity,
      performance: performanceByQuarter
    };

    return res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Analytics query failed:', error);
    return res.status(500).json({ success: false, message: 'Unable to load analytics data.' });
  }
};
