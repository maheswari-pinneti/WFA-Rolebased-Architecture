import { useSelector } from "react-redux";
import { RootState } from "../app/store";

export const useDepartmentAccess = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const hasDepartmentAccess = (departmentId: string): boolean => {
    if (!user) return false;

    const role = String(user.role).toLowerCase();

    if (role === "admin" || role === "hr") {
      return true;
    }

    if (role === "manager" || role === "team lead" || role === "team_lead") {
      return user.departmentId === departmentId;
    }

    if (role === "employee") {
      return user.departmentId === departmentId;
    }

    return user.departmentId === departmentId;
  };

  const canAccessDepartment = (departmentIdOrName: string): boolean => {
    if (!user) return false;
    if (user.departmentId && user.departmentId === departmentIdOrName) return true;
    if (user.department && user.department === departmentIdOrName) return true;
    return hasDepartmentAccess(departmentIdOrName);
  };

  return {
    user,
    hasDepartmentAccess,
    canAccessDepartment,
    userDepartment: user?.department,
    userDepartmentId: user?.departmentId || "HR001",
  };
};
