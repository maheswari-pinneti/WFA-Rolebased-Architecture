import { Employee } from '../models/Employee.js';

export class EmployeeRepository {
  async findById(id, orgId) {
    return Employee.findOne({ id, organizationId: orgId });
  }

  async findByEmail(email, orgId) {
    return Employee.findOne({ email, organizationId: orgId });
  }

  async create(employeeData) {
    return Employee.create(employeeData);
  }

  async update(id, orgId, updateData) {
    return Employee.findOneAndUpdate(
      { id, organizationId: orgId },
      { $set: updateData },
      { new: true }
    );
  }

  async softDelete(id, orgId) {
    return Employee.findOneAndUpdate(
      { id, organizationId: orgId },
      { $set: { status: 'TERMINATED' } },
      { new: true }
    );
  }

  async count(query) {
    return Employee.countDocuments(query);
  }

  async findPaginated(query, sortOption, skip, limit) {
    return Employee.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
  }

  async getDistinctTeams(orgId) {
    return Employee.aggregate([
      { $match: { organizationId: orgId, team: { $ne: null, $ne: '' } } },
      { $group: { _id: { name: '$team', department: '$department' } } },
      { $project: { _id: 0, name: '$_id.name', department: '$_id.department' } },
      { $sort: { name: 1 } }
    ]);
  }

  async findTeamMembers(teamId, orgId) {
    return Employee.find({ team: teamId, organizationId: orgId }).sort({ employeeCode: 1 });
  }

  async getDistinctDepartments(orgId) {
    return Employee.distinct('department', { organizationId: orgId, department: { $ne: null, $ne: '' } });
  }

  async getDistinctLocations(orgId) {
    return Employee.distinct('location', { organizationId: orgId, location: { $ne: null, $ne: '' } });
  }
}

export const employeeRepository = new EmployeeRepository();
export default employeeRepository;
