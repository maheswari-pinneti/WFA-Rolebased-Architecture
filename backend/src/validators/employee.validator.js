import mongoose from 'mongoose';

export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const validateEmployeeCreateData = (data) => {
  const { id, name, email, department, role, status } = data || {};

  if (!id || typeof id !== 'string' || !id.trim()) {
    return { valid: false, message: 'Required fields: id, name, email, department.' };
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return { valid: false, message: 'Required fields: id, name, email, department.' };
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return { valid: false, message: 'Required fields: id, name, email, department.' };
  }

  if (!department || typeof department !== 'string' || !department.trim()) {
    return { valid: false, message: 'Required fields: id, name, email, department.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim().toLowerCase())) {
    return { valid: false, message: 'Invalid email format.' };
  }

  if (role) {
    const permittedRoles = ['EMPLOYEE', 'MANAGER', 'ADMIN', 'HR', 'TEAM_LEAD'];
    if (!permittedRoles.includes(role.toUpperCase())) {
      return { valid: false, message: 'Invalid role selection.' };
    }
  }

  if (status) {
    const permittedStatus = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];
    if (!permittedStatus.includes(status.toUpperCase())) {
      return { valid: false, message: 'Invalid status selection.' };
    }
  }

  return { valid: true };
};

export const validateEmployeeUpdateData = (data) => {
  const { name, email, role, status } = data || {};

  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    return { valid: false, message: 'Name cannot be empty.' };
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || !email.trim()) {
      return { valid: false, message: 'Email cannot be empty.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim().toLowerCase())) {
      return { valid: false, message: 'Invalid email format.' };
    }
  }

  if (role) {
    const permittedRoles = ['EMPLOYEE', 'MANAGER', 'ADMIN', 'HR', 'TEAM_LEAD'];
    if (!permittedRoles.includes(role.toUpperCase())) {
      return { valid: false, message: 'Invalid role selection.' };
    }
  }

  if (status) {
    const permittedStatus = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];
    if (!permittedStatus.includes(status.toUpperCase())) {
      return { valid: false, message: 'Invalid status selection.' };
    }
  }

  return { valid: true };
};
