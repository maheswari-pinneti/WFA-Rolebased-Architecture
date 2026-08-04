export interface MockEmployee {
  id: number;
  name: string;
  department: string;
  departmentId: string;
  performance: number;
  email?: string;
  role?: string;
}

export const employees: MockEmployee[] = [
  {
    id: 1,
    name: "Rahul",
    department: "Engineering",
    departmentId: "ENG001",
    performance: 90,
    email: "rahul@thestackly.com",
    role: "Senior Software Engineer"
  },
  {
    id: 2,
    name: "Priya",
    department: "HR",
    departmentId: "HR001",
    performance: 95,
    email: "priya@thestackly.com",
    role: "HR Generalist"
  },
  {
    id: 3,
    name: "Arun",
    department: "Finance",
    departmentId: "FIN001",
    performance: 88,
    email: "arun@thestackly.com",
    role: "Financial Analyst"
  },
  {
    id: 4,
    name: "Ananya",
    department: "Engineering",
    departmentId: "ENG001",
    performance: 92,
    email: "ananya@thestackly.com",
    role: "Tech Lead"
  },
  {
    id: 5,
    name: "Vikram",
    department: "Marketing",
    departmentId: "MKT001",
    performance: 85,
    email: "vikram@thestackly.com",
    role: "Growth Manager"
  }
];
