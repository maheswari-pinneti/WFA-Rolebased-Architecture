import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  domain: { type: String, default: null },
  status: { type: String, default: 'ACTIVE' }
}, { timestamps: true, collection: 'organizations' });

const departmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  code: { type: String, unique: true, index: true },
  managerId: { type: String, default: null },
  organizationId: { type: String, default: 'org-stackly' }
}, { timestamps: true, collection: 'departments' });

const teamSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  departmentId: { type: String, default: null },
  leadId: { type: String, default: null },
  organizationId: { type: String, default: 'org-stackly' }
}, { timestamps: true, collection: 'teams' });

const shiftSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  startTime: { type: String, default: null },
  endTime: { type: String, default: null },
  gracePeriodMinutes: { type: Number, default: 0 },
  organizationId: { type: String, default: 'org-stackly' }
}, { timestamps: true, collection: 'shifts' });

const skillSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  employeeId: { type: String, required: true, index: true },
  skillName: { type: String, required: true, index: true },
  level: { type: Number, default: 1 },
  isTopSkill: { type: Number, default: 0 },
  isMissingSkill: { type: Number, default: 0 },
  department: { type: String, default: null },
  team: { type: String, default: null },
  organizationId: { type: String, default: 'org-stackly' }
}, { timestamps: true, collection: 'skills' });

const performanceRecordSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  employeeId: { type: String, required: true, index: true },
  quarter: { type: String, required: true, index: true },
  kpiScore: { type: Number, default: 0 },
  targetScore: { type: Number, default: 0 },
  productivityScore: { type: Number, default: 0 },
  department: { type: String, default: null },
  team: { type: String, default: null },
  organizationId: { type: String, default: 'org-stackly' }
}, { timestamps: true, collection: 'performance_records' });

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  assigneeId: { type: String, default: null, index: true },
  assigneeName: { type: String, default: null },
  department: { type: String, default: null },
  team: { type: String, default: null },
  organizationId: { type: String, default: 'org-stackly' },
  priority: { type: String, default: 'MEDIUM' },
  status: { type: String, default: 'TODO' },
  points: { type: Number, default: 0 },
  updatedAt: { type: String, default: null }
}, { timestamps: true, collection: 'tasks' });

const leaveRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  employeeId: { type: String, required: true, index: true },
  employeeName: { type: String, default: null },
  department: { type: String, default: null },
  team: { type: String, default: null },
  organizationId: { type: String, default: 'org-stackly' },
  type: { type: String, default: null },
  startDate: { type: String, default: null },
  endDate: { type: String, default: null },
  reason: { type: String, default: null },
  status: { type: String, default: 'PENDING' },
  reviewedBy: { type: String, default: null },
  reviewComment: { type: String, default: null },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true, collection: 'leave_requests' });

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: null },
  read: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  organizationId: { type: String, default: 'org-stackly' }
}, { timestamps: true, collection: 'notifications' });

export const Organization = mongoose.models.Organization || mongoose.model('Organization', organizationSchema);
export const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);
export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
export const Shift = mongoose.models.Shift || mongoose.model('Shift', shiftSchema);
export const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema);
export const PerformanceRecord = mongoose.models.PerformanceRecord || mongoose.model('PerformanceRecord', performanceRecordSchema);
export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export const LeaveRequest = mongoose.models.LeaveRequest || mongoose.model('LeaveRequest', leaveRequestSchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Department;
