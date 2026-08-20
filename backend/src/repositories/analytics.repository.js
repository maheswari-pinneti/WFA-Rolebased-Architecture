import { Employee } from '../models/Employee.js';
import { Attendance } from '../models/Attendance.js';
import { PerformanceRecord, Skill } from '../models/Department.js';

export class AnalyticsRepository {
  async getEmployeesSummary(query) {
    return Employee.find(query, { id: 1, department: 1, team: 1, role: 1, status: 1, performanceScore: 1, attendanceRate: 1 });
  }

  async getAttendanceRecords(query) {
    return Attendance.find(query, { employeeId: 1, status: 1, workMode: 1, checkInTime: 1, checkOutTime: 1, createdAt: 1 });
  }

  async getDepartmentComparison(query) {
    return Employee.aggregate([
      { $match: query },
      { $group: {
          _id: '$department',
          headcount: { $sum: 1 },
          performance: { $avg: '$performanceScore' },
          attendance: { $avg: '$attendanceRate' }
        }
      },
      { $project: {
          _id: 0,
          name: { $ifNull: ['$_id', 'Unassigned'] },
          headcount: 1,
          performance: { $round: [{ $ifNull: ['$performance', 0] }, 1] },
          attendance: { $round: [{ $ifNull: ['$attendance', 0] }, 1] }
        }
      },
      { $sort: { headcount: -1 } }
    ]);
  }

  async getRoleDistribution(query) {
    return Employee.aggregate([
      { $match: query },
      { $group: { _id: '$role', value: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', value: 1 } },
      { $sort: { value: -1 } }
    ]);
  }

  async getEmploymentStatus(query) {
    return Employee.aggregate([
      { $match: query },
      { $group: { _id: '$status', value: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', value: 1 } },
      { $sort: { value: -1 } }
    ]);
  }

  async getWorkModeDistribution(query) {
    return Attendance.aggregate([
      { $match: query },
      { $group: { _id: '$workMode', value: { $addToSet: '$employeeId' } } },
      { $project: { _id: 0, name: '$_id', value: { $size: '$value' } } }
    ]);
  }

  async getPerformanceByQuarter(query) {
    return PerformanceRecord.aggregate([
      { $match: query },
      { $group: {
          _id: '$quarter',
          performance: { $avg: '$kpiScore' },
          target: { $avg: '$targetScore' },
          productivity: { $avg: '$productivityScore' }
        }
      },
      { $project: {
          _id: 0,
          name: '$_id',
          performance: { $round: [{ $ifNull: ['$performance', 0] }, 1] },
          target: { $round: [{ $ifNull: ['$target', 0] }, 1] },
          productivity: { $round: [{ $ifNull: ['$productivity', 0] }, 1] }
        }
      },
      { $sort: { name: 1 } }
    ]);
  }

  async getTeamProductivity(query) {
    return PerformanceRecord.aggregate([
      { $match: query },
      { $group: {
          _id: '$team',
          productivity: { $avg: '$productivityScore' },
          members: { $addToSet: '$employeeId' }
        }
      },
      { $project: {
          _id: 0,
          name: { $ifNull: ['$_id', 'Unassigned'] },
          productivity: { $round: [{ $ifNull: ['$productivity', 0] }, 1] },
          members: { $size: '$members' }
        }
      },
      { $sort: { productivity: -1 } }
    ]);
  }

  async getSkillsMetrics(query) {
    return Skill.aggregate([
      { $match: query },
      { $group: {
          _id: '$skillName',
          averageLevel: { $avg: '$level' },
          people: { $addToSet: '$employeeId' },
          covered: { $sum: { $cond: [{ $gte: ['$level', 3] }, 1, 0] } },
          gap: { $sum: { $cond: [{ $lte: ['$level', 2] }, 1, 0] } }
        }
      },
      { $project: {
          _id: 0,
          name: '$_id',
          averageLevel: { $round: [{ $ifNull: ['$averageLevel', 0] }, 1] },
          people: { $size: '$people' },
          covered: 1,
          gap: 1
        }
      },
      { $sort: { people: -1 } }
    ]);
  }
}

export const analyticsRepository = new AnalyticsRepository();
export default analyticsRepository;
