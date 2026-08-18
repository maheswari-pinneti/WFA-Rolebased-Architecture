import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  employeeCode: { type: String, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, index: true },
  role: { type: String, default: 'EMPLOYEE' },
  department: { type: String, index: true, default: null },
  designation: { type: String, default: null },
  status: { type: String, index: true, default: 'ACTIVE' },
  avatar: { type: String, default: null },
  joinDate: { type: String, default: null },
  performanceScore: { type: Number, default: 90 },
  attendanceRate: { type: Number, default: 95 },
  team: { type: String, default: null },
  location: { type: String, index: true, default: null },
  organizationId: { type: String, default: 'org-stackly' }
}, {
  timestamps: true,
  collection: 'employees'
});

export const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
export default Employee;
