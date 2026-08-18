import { run, get, prepareAndRun, all } from './connection.js';

const ORGANIZATION_ID = 'org-stackly';

export const seed = async (forceReset = false) => {
  if (forceReset) {
    console.log("Forcing database reset/seed cleanup...");
    await run("DELETE FROM employees");
    await run("DELETE FROM users WHERE role = 'EMPLOYEE'");
    await run("DELETE FROM departments");
    await run("DELETE FROM teams");
    await run("DELETE FROM skills");
    await run("DELETE FROM performance_records");
    await run("DELETE FROM organizations");
    await run("DELETE FROM tasks WHERE id LIKE 'task-seed-%'");
  }

  // 1. Seed organizations if empty
  const orgCount = await get('SELECT COUNT(*) AS count FROM organizations');
  if (orgCount.count === 0) {
    await run(`INSERT OR IGNORE INTO organizations (id, name, domain, status) VALUES (?,?,?,?)`, [ORGANIZATION_ID, 'Stackly Enterprise HQ', 'thestackly.com', 'ACTIVE']);
  }

  // 2. Seed departments if empty
  const deptCount = await get('SELECT COUNT(*) AS count FROM departments');
  if (deptCount.count === 0) {
    await prepareAndRun(
      `INSERT OR IGNORE INTO departments (id, name, code, managerId, organizationId) VALUES (?,?,?,?,?)`,
      [
        ['dept-eng', 'Engineering', 'ENG', 'usr-mgr-01', 'org-stackly'],
        ['dept-prod', 'Product Management', 'PROD', null, 'org-stackly'],
        ['dept-sales', 'Sales & Marketing', 'SALES', null, 'org-stackly'],
        ['dept-hr', 'Human Resources', 'HR', 'usr-hr-01', 'org-stackly'],
        ['dept-cs', 'Customer Success', 'CS', null, 'org-stackly'],
        ['dept-fin', 'Finance & Operations', 'FIN', null, 'org-stackly']
      ]
    );
  }

  // 3. Seed teams if empty
  const teamCount = await get('SELECT COUNT(*) AS count FROM teams');
  if (teamCount.count === 0) {
    await prepareAndRun(
      `INSERT OR IGNORE INTO teams (id, name, departmentId, leadId, organizationId) VALUES (?,?,?,?,?)`,
      [
        ['team-frontend', 'Frontend Team', 'dept-eng', 'usr-lead-01', 'org-stackly'],
        ['team-strategy', 'Product Strategy', 'dept-prod', null, 'org-stackly'],
        ['team-growth', 'Growth Team', 'dept-sales', null, 'org-stackly'],
        ['team-peops', 'People Operations', 'dept-hr', 'usr-hr-01', 'org-stackly'],
        ['team-cs', 'Customer Success', 'dept-cs', null, 'org-stackly'],
        ['team-finance', 'Finance Operations', 'dept-fin', null, 'org-stackly']
      ]
    );
  }

  // 4. Seed core users if empty
  const userCount = await get("SELECT COUNT(*) AS count FROM users WHERE id IN ('usr-admin-01', 'usr-hr-01', 'usr-mgr-01', 'usr-lead-01')");
  if (userCount.count < 4) {
    const passHash = '$2b$10$RurO1wlDA8rF7QLnqIKkM.PJmHnGiRcduYPxbrULJpiX/JB7UixMG';
    const users = [
      ['usr-admin-01', 'Sarah Connor', 'admin@thestackly.com', 'ADMIN', 'Executive', 'System Architecture', 'Global HQ', 'System Administrator', 5, ['USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'USER_MANAGE', 'ROLE_CREATE', 'ROLE_UPDATE', 'ROLE_DELETE', 'ROLE_MANAGE', 'PERMISSION_ASSIGN', 'EMPLOYEE_VIEW_ALL', 'EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEE_DELETE', 'REPORT_VIEW_ALL', 'REPORT_EXPORT', 'SYSTEM_SETTINGS_MANAGE', 'SYSTEM_CONFIG', 'AUDIT_LOG_VIEW', 'VIEW_ALL_DATA']],
      ['usr-hr-01', 'Elena Rostova', 'hr@thestackly.com', 'HR', 'Human Resources', 'People Operations', 'New York', 'VP of HR Operations', 4, ['EMPLOYEE_VIEW', 'EMPLOYEE_CREATE', 'EMPLOYEE_UPDATE', 'EMPLOYEE_PROFILE_MANAGE', 'ATTENDANCE_VIEW_ALL', 'ATTENDANCE_MANAGE', 'LEAVE_APPROVE', 'PERFORMANCE_MANAGE', 'RECRUITMENT_MANAGE', 'REPORT_GENERATE', 'EMPLOYEE_MANAGE', 'REPORT_VIEW', 'TEAM_ANALYTICS_VIEW']],
      ['usr-mgr-01', 'David Sterling', 'manager@thestackly.com', 'MANAGER', 'Engineering', 'Frontend & Backend', 'San Francisco', 'Department Manager', 3, ['TEAM_VIEW', 'TEAM_ANALYTICS_VIEW', 'EMPLOYEE_VIEW_TEAM', 'ATTENDANCE_VIEW_TEAM', 'LEAVE_APPROVE', 'PERFORMANCE_REVIEW', 'TASK_ASSIGN', 'REPORT_VIEW_TEAM']],
      ['usr-lead-01', 'Marcus Vance', 'lead@thestackly.com', 'TEAM_LEAD', 'Engineering', 'Frontend Team', 'San Francisco', 'Team Lead', 2, ['TEAM_MEMBER_VIEW', 'TEAM_VIEW', 'TASK_ASSIGN', 'TASK_TRACK', 'ATTENDANCE_VIEW_TEAM', 'PRODUCTIVITY_VIEW', 'FEEDBACK_CREATE', 'PERFORMANCE_FEEDBACK']]
    ];

    await prepareAndRun(
      `INSERT OR IGNORE INTO users (id,name,email,password_hash,role,department,team,location,title,clearanceLevel,status,permissions,mfa_enabled,organizationId)
       VALUES (?,?,?,?,?,?,?,?,?,?,?, ?,1,?)`,
      users.map((u) => [u[0], u[1], u[2], passHash, u[3], u[4], u[5], u[6], u[7], u[8], 'ACTIVE', JSON.stringify(u[9]), ORGANIZATION_ID])
    );
  }

  // 5. Seed employees if empty
  const empCount = await get('SELECT COUNT(*) AS count FROM employees');
  if (empCount.count === 0) {
    console.log("Seeding 250 deterministic employees...");
    const passHash = '$2b$10$RurO1wlDA8rF7QLnqIKkM.PJmHnGiRcduYPxbrULJpiX/JB7UixMG';
    const departments = ['Engineering', 'Product Management', 'Sales & Marketing', 'Human Resources', 'Customer Success', 'Finance & Operations'];
    const teams = ['Frontend Team', 'Product Strategy', 'Growth Team', 'People Operations', 'Customer Success', 'Finance Operations'];
    const designations = ['Senior Software Engineer', 'Product Manager', 'Account Executive', 'HR Operations Manager', 'Customer Success Director', 'Financial Analyst'];
    const statuses = ['ACTIVE', 'REMOTE', 'ON_LEAVE', 'ACTIVE'];

    // Geographic distribution: Hyderabad: 70, Visakhapatnam: 40, Chennai: 50, Bengaluru: 60, Kochi: 30
    const locations = [];
    for (let i = 0; i < 70; i++) locations.push('Hyderabad');
    for (let i = 0; i < 40; i++) locations.push('Visakhapatnam');
    for (let i = 0; i < 50; i++) locations.push('Chennai');
    for (let i = 0; i < 60; i++) locations.push('Bengaluru');
    for (let i = 0; i < 30; i++) locations.push('Kochi');

    const firstNames = [
      'Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Advik', 'Siddharth', 'Ishaan', 'Aanya', 'Aditi',
      'Kabir', 'Rohan', 'Arjun', 'Rahul', 'Pranav', 'Aditya', 'Sai', 'Krishna', 'Karan', 'Sanjay',
      'Vikram', 'Ramesh', 'Suresh', 'Anil', 'Sunil', 'Vijay', 'Rajesh', 'Harish', 'Manish', 'Amit',
      'Pooja', 'Neha', 'Priya', 'Sneha', 'Anjali', 'Riya', 'Divya', 'Deepika', 'Kiran', 'Jyoti',
      'Akash', 'Abhishek', 'Aman', 'Aniket', 'Ayush', 'Gaurav', 'Nitin', 'Pankaj', 'Sachin', 'Sandeep',
      'Shalini', 'Swati', 'Meera', 'Shruti', 'Preeti', 'Kavita', 'Geeta', 'Lata', 'Sunita', 'Anita'
    ];
    const lastNames = [
      'Sharma', 'Verma', 'Kumar', 'Singh', 'Patel', 'Reddy', 'Rao', 'Nair', 'Pillai', 'Joshi',
      'Iyer', 'Iyengar', 'Gupta', 'Sen', 'Dutta', 'Das', 'Banerjee', 'Chatterjee', 'Mukherjee', 'Bose',
      'Mehta', 'Shah', 'Trivedi', 'Pandey', 'Mishra', 'Choudhury', 'Prasad', 'Sinha', 'Kapoor', 'Khanna',
      'Malhotra', 'Bahl', 'Gill', 'Sandhu', 'Nayar', 'Menon', 'Shetty', 'Gowda', 'Naidu'
    ];

    const empRows = [];
    const userRows = [];

    for (let i = 1; i <= 250; i++) {
      const id = i === 250 ? 'usr-emp-01' : `emp-${i}`;
      const paddedNum = String(i).padStart(4, '0');
      const joiningYear = 2020 + (i % 7);
      const code = `STK-${joiningYear}-${paddedNum}`;
      
      const firstName = firstNames[(i - 1) % firstNames.length];
      const lastName = lastNames[Math.floor((i - 1) / firstNames.length) % lastNames.length];

      const name = i === 250 ? 'Alex Mercer' : `${firstName} ${lastName}`;
      const email = i === 250 ? 'employee@thestackly.com' : `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${paddedNum}@thestackly.com`;
      const role = 'EMPLOYEE';
      const deptIdx = i % departments.length;
      const dept = i === 250 ? 'Engineering' : departments[deptIdx];
      const design = i === 250 ? 'Full Stack Developer' : designations[deptIdx];
      const status = statuses[i % statuses.length];
      const team = i === 250 ? 'Frontend Team' : teams[deptIdx];
      const location = locations[i - 1];

      empRows.push([
        id, code, name, email, role, dept, design, status,
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        `${joiningYear}-${String((i % 12) + 1).padStart(2, '0')}-15`, 80 + (i % 20), 90 + (i % 10),
        team, location, ORGANIZATION_ID
      ]);

      const perms = ['PROFILE_VIEW', 'PROFILE_UPDATE', 'ATTENDANCE_VIEW_SELF', 'LEAVE_REQUEST', 'PERFORMANCE_VIEW_SELF', 'GOAL_UPDATE', 'DOCUMENT_UPLOAD'];
      userRows.push([
        id, name, email, passHash, role, dept, team, location, design, 1, 'ACTIVE', JSON.stringify(perms), ORGANIZATION_ID
      ]);
    }

    await prepareAndRun(
      `INSERT OR IGNORE INTO employees (id,employeeCode,name,email,role,department,designation,status,avatar,joinDate,performanceScore,attendanceRate,team,location,organizationId)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      empRows
    );

    await prepareAndRun(
      `INSERT OR IGNORE INTO users (id,name,email,password_hash,role,department,team,location,title,clearanceLevel,status,permissions,mfa_enabled,organizationId)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1,?)`,
      userRows
    );
  }

  // 6. Shifts if empty
  const shiftCount = await get('SELECT COUNT(*) AS count FROM shifts');
  if (shiftCount.count === 0) {
    await prepareAndRun(
      `INSERT OR IGNORE INTO shifts (id,name,startTime,endTime,gracePeriodMinutes,organizationId) VALUES (?,?,?,?,?,?)`,
      [
        ['shift-regular', 'Regular', '09:00', '18:00', 15, ORGANIZATION_ID],
        ['shift-flexible', 'Flexible', '00:00', '23:59', 0, ORGANIZATION_ID],
        ['shift-overnight', 'Overnight', '21:00', '06:00', 15, ORGANIZATION_ID]
      ]
    );
  }

  // 7. Seed skills and performance records if empty
  const employeeRows = await all('SELECT id, department, team FROM employees WHERE organizationId = ?', [ORGANIZATION_ID]);
  const skillCount = await get('SELECT COUNT(*) AS count FROM skills');
  if (skillCount.count === 0 && employeeRows.length > 0) {
    const skills = ['React', 'TypeScript', 'Node.js', 'SQL', 'Cloud Architecture', 'Kubernetes', 'Data Analysis', 'Leadership'];
    const rows = [];
    employeeRows.forEach((employee, index) => {
      skills.slice(0, 5).forEach((skill, skillIndex) => {
        const level = 2 + ((index + skillIndex) % 4);
        rows.push([
          `skill-${index}-${skillIndex}`, employee.id, skill, level,
          level >= 4 ? 1 : 0, level <= 2 ? 1 : 0, employee.department, employee.team, ORGANIZATION_ID
        ]);
      });
    });
    await prepareAndRun(
      `INSERT OR IGNORE INTO skills (id,employeeId,skillName,level,isTopSkill,isMissingSkill,department,team,organizationId) VALUES (?,?,?,?,?,?,?,?,?)`,
      rows
    );
  }

  const performanceCount = await get('SELECT COUNT(*) AS count FROM performance_records');
  if (performanceCount.count === 0 && employeeRows.length > 0) {
    const rows = [];
    employeeRows.forEach((employee, index) => {
      ['Q1', 'Q2', 'Q3', 'Q4'].forEach((quarter, quarterIndex) => {
        const score = 72 + ((index + quarterIndex * 3) % 25);
        rows.push([
          `performance-${index}-${quarter}`, employee.id, quarter, score, 85,
          Math.min(100, score + 4), employee.department, employee.team, ORGANIZATION_ID
        ]);
      });
    });
    await prepareAndRun(
      `INSERT OR IGNORE INTO performance_records (id,employeeId,quarter,kpiScore,targetScore,productivityScore,department,team,organizationId) VALUES (?,?,?,?,?,?,?,?,?)`,
      rows
    );
  }

  // Tasks template if empty
  const currentTaskCount = await get("SELECT COUNT(*) AS count FROM tasks WHERE id LIKE 'task-seed-%'");
  if (currentTaskCount.count === 0 && employeeRows.length > 0) {
    const taskTemplates = [
      ['Implement attendance export API', 'HIGH', 'IN_PROGRESS', 8],
      ['Review quarterly performance goals', 'MEDIUM', 'TODO', 5],
      ['Close accessibility findings', 'LOW', 'COMPLETED', 3],
      ['Validate department skill gaps', 'HIGH', 'TODO', 5]
    ];
    await prepareAndRun(
      `INSERT OR IGNORE INTO tasks (id,title,assigneeId,assigneeName,department,team,organizationId,priority,status,points,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      taskTemplates.map((task, index) => {
        const teamIndex = index % 6;
        const assignee = employeeRows.find(e => {
          const teams = ['Frontend Team', 'Product Strategy', 'Growth Team', 'People Operations', 'Customer Success', 'Finance Operations'];
          return e.team === teams[teamIndex];
        }) || employeeRows[index % employeeRows.length];
        return [`task-seed-${index + 1}`, task[0], assignee.id, assignee.name, assignee.department, assignee.team, ORGANIZATION_ID, task[1], task[2], task[3], new Date().toISOString()];
      })
    );
  }
};
export default seed;
