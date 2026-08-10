import { Employee } from '../../shared/types/common.types';
import { apiClient } from '../../services/api';

export const employeeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    const response = await apiClient.get('/v1/employees');
    if (response.data?.success) return response.data.data;
    throw new Error(response.data?.message || 'Unable to load employees.');
  },

  getEmployeeById: async (id: string): Promise<Employee | undefined> => {
    const employees = await employeeApi.getEmployees();
    return employees.find((employee) => employee.id === id);
  },

  updateEmployeeStatus: async (id: string, status: Employee['status']): Promise<Employee> => {
    const response = await apiClient.put(`/v1/employees/${id}/status`, { status });
    if (response.data?.success) return response.data.data;
    throw new Error(response.data?.message || 'Unable to update employee status.');
  }
};
