import { Employee } from '../../shared/types/common.types';
import { Role } from '../../security/roles/roles';

const generate10kEmployees = (): Employee[] => {
  const departments = [
    'Engineering',
    'Product Management',
    'Sales & Marketing',
    'Human Resources',
    'Customer Success',
    'Finance & Operations'
  ];
  const designations = [
    'Senior Software Engineer',
    'Staff Systems Architect',
    'Principal DevOps Lead',
    'Lead QA Automation Engineer',
    'Director of Product',
    'Senior UX Designer',
    'HR Operations Manager',
    'Talent Acquisition Lead',
    'Enterprise Account Executive',
    'Customer Success Director',
    'Financial Analyst'
  ];
  const roles = [Role.EMPLOYEE, Role.TEAM_LEAD, Role.TEAM_MANAGER, Role.HR, Role.ADMIN];
  const statuses: Employee['status'][] = ['PRESENT', 'PRESENT', 'PRESENT', 'REMOTE', 'ON_LEAVE', 'OFFLINE'];
  const avatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  ];

  const firstNames = ['Alexander', 'Sophia', 'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

  const employees: Employee[] = [];
  for (let i = 1; i <= 10000; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const name = `${fn} ${ln}`;
    const code = `STK-${10000 + i}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@stackly.com`;
    const dept = departments[i % departments.length];
    const desig = designations[i % designations.length];
    const role = roles[i % roles.length];
    const status = statuses[i % statuses.length];
    const avatar = avatars[i % avatars.length];
    const score = 85 + (i % 15);
    const attendance = 95 + (i % 5);

    employees.push({
      id: `emp-${i}`,
      employeeCode: code,
      name,
      email,
      role,
      department: dept,
      designation: desig,
      status,
      avatar,
      joinDate: '2023-01-15',
      performanceScore: score,
      attendanceRate: attendance
    });
  }
  return employees;
};

const localEmployees: Employee[] = generate10kEmployees();

export const employeeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    await new Promise((res) => setTimeout(res, 50));
    return localEmployees;
  },

  getEmployeeById: async (id: string): Promise<Employee | undefined> => {
    await new Promise((res) => setTimeout(res, 50));
    return localEmployees.find((e) => e.id === id);
  },

  updateEmployeeStatus: async (id: string, status: Employee['status']): Promise<Employee> => {
    await new Promise((res) => setTimeout(res, 50));
    const index = localEmployees.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    localEmployees[index] = { ...localEmployees[index], status };
    return localEmployees[index];
  }
};
