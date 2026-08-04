import { useSelector } from "react-redux";
import { RootState } from "../app/store";

export const useDepartmentAccess = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const canAccessDepartment = (departmentIdOrName: string): boolean => {
    if (!user) return false;

    const userRole = String(user.role).toUpperCase();

    // 1. Admin holds global organization access
    if (userRole === "ADMIN") {
      return true;
    }

    // 2. HR access to HR department (D001 or "HR")
    if (userRole === "HR" || userRole === "HR_MANAGER") {
      return (
        departmentIdOrName === "D001" ||
        departmentIdOrName === "HR" ||
        departmentIdOrName === "Human Resources"
      );
    }

    // 3. Manager access to assigned department (departmentId or department name match)
    if (userRole === "MANAGER" || userRole === "TEAM_MANAGER") {
      if (user.departmentId && departmentIdOrName === user.departmentId) {
        return true;
      }
      if (user.department && departmentIdOrName === user.department) {
        return true;
      }
      return false;
    }

    // 4. Team Lead access to team/department
    if (userRole === "TEAM_LEAD") {
      if (user.departmentId && departmentIdOrName === user.departmentId) {
        return true;
      }
      if (user.department && departmentIdOrName === user.department) {
        return true;
      }
      return false;
    }

    // 5. Employee self access only
    if (userRole === "EMPLOYEE") {
      return false;
    }

    return false;
  };

  return {
    canAccessDepartment,
    userDepartment: user?.department,
    userDepartmentId: user?.departmentId || "D001",
  };
};
