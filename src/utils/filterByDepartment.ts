export const filterByDepartment = (data: any[], user: any) => {
  if (!user) return [];

  const role = String(user.role).toLowerCase();

  if (role === 'admin' || role === 'hr') {
    return data;
  }

  return data.filter((item) => item.departmentId === user.departmentId);
};
