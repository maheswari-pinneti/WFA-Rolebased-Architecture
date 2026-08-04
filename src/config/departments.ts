export type Department =
  | "HR"
  | "Engineering"
  | "Finance"
  | "Marketing"
  | "Operations";

export interface DepartmentStructure {
  id: string;
  name: Department;
}

export const departments: DepartmentStructure[] = [
  {
    id: "D001",
    name: "HR",
  },
  {
    id: "D002",
    name: "Engineering",
  },
  {
    id: "D003",
    name: "Finance",
  },
  {
    id: "D004",
    name: "Marketing",
  },
  {
    id: "D005",
    name: "Operations",
  },
];
