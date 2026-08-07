import { db } from '../config/db.js';

export const getUsers = (req, res) => {
  db.all("SELECT id, name, email, role, department, status, team, location, title, permissions FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    const formattedUsers = rows.map((u) => ({
      ...u,
      permissions: JSON.parse(u.permissions || '[]')
    }));
    res.json({ success: true, data: formattedUsers });
  });
};

export const updateUserRole = (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Update permissions according to the new role
    const getPermissionsForRole = (roleStr) => {
      switch (roleStr) {
        case 'ADMIN':
          return ["USER_CREATE", "USER_UPDATE", "USER_DELETE", "USER_MANAGE", "ROLE_CREATE", "ROLE_UPDATE", "ROLE_DELETE", "ROLE_MANAGE", "PERMISSION_ASSIGN", "EMPLOYEE_VIEW_ALL", "EMPLOYEE_CREATE", "EMPLOYEE_UPDATE", "EMPLOYEE_DELETE", "REPORT_VIEW_ALL", "REPORT_EXPORT", "SYSTEM_SETTINGS_MANAGE", "SYSTEM_CONFIG", "AUDIT_LOG_VIEW", "VIEW_ALL_DATA"];
        case 'HR':
          return ["EMPLOYEE_VIEW", "EMPLOYEE_CREATE", "EMPLOYEE_UPDATE", "EMPLOYEE_PROFILE_MANAGE", "ATTENDANCE_VIEW_ALL", "ATTENDANCE_MANAGE", "LEAVE_APPROVE", "PERFORMANCE_MANAGE", "RECRUITMENT_MANAGE", "REPORT_GENERATE", "EMPLOYEE_MANAGE", "REPORT_VIEW"];
        case 'MANAGER':
          return ["TEAM_VIEW", "TEAM_ANALYTICS_VIEW", "EMPLOYEE_VIEW_TEAM", "ATTENDANCE_VIEW_TEAM", "LEAVE_APPROVE", "PERFORMANCE_REVIEW", "TASK_ASSIGN", "REPORT_VIEW_TEAM"];
        case 'TEAM_LEAD':
          return ["TEAM_MEMBER_VIEW", "TEAM_VIEW", "TASK_ASSIGN", "TASK_TRACK", "ATTENDANCE_VIEW_TEAM", "PRODUCTIVITY_VIEW", "FEEDBACK_CREATE", "PERFORMANCE_FEEDBACK"];
        default:
          return ["PROFILE_VIEW", "PROFILE_UPDATE", "ATTENDANCE_VIEW_SELF", "LEAVE_REQUEST", "PERFORMANCE_VIEW_SELF", "GOAL_UPDATE", "DOCUMENT_UPLOAD"];
      }
    };

    const newPermissions = JSON.stringify(getPermissionsForRole(role));

    db.run("UPDATE users SET role = ?, permissions = ? WHERE id = ?", [role, newPermissions, id], (upErr) => {
      if (upErr) return res.status(500).json({ success: false, message: upErr.message });
      
      db.get("SELECT id, name, email, role, department, status, team, location, title, permissions FROM users WHERE id = ?", [id], (selErr, updatedUser) => {
        if (selErr) return res.status(500).json({ success: false, message: selErr.message });
        res.json({
          success: true,
          data: {
            ...updatedUser,
            permissions: JSON.parse(updatedUser.permissions || '[]')
          }
        });
      });
    });
  });
};

export const deleteUser = (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'User deleted successfully' });
  });
};
