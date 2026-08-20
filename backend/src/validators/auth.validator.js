import { logAudit } from '../config/db.js';

export const validateLoginData = (data) => {
  const { email, password } = data || {};

  if (!email || typeof email !== 'string' || !email.trim()) {
    return { valid: false, message: 'Invalid credentials', status: 400 };
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    return { valid: false, message: 'Invalid credentials', status: 400 };
  }

  const trimmedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, message: 'Invalid credentials', status: 400 };
  }

  if (!trimmedEmail.endsWith('@thestackly.com') && !trimmedEmail.endsWith('@company.com')) {
    logAudit('anonymous', 'FAILED_AUTHENTICATION_DOMAIN', `Login domain rejected for ${trimmedEmail}`);
    return { valid: false, message: 'Domain access denied. Only corporate email domains permitted.', status: 403 };
  }

  return { valid: true };
};

export const validateSignupData = (data) => {
  const { name, email, password, role } = data || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return { valid: false, message: 'Name is required.', status: 400 };
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return { valid: false, message: 'Email is required.', status: 400 };
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    return { valid: false, message: 'Password is required.', status: 400 };
  }

  const trimmedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, message: 'Invalid email format.', status: 400 };
  }

  if (!trimmedEmail.endsWith('@thestackly.com') && !trimmedEmail.endsWith('@company.com')) {
    return { valid: false, message: 'Only official @thestackly.com or @company.com corporate email domains permitted.', status: 403 };
  }

  // Strong password enforcement: min 8 characters, max 128 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;
  if (!passwordRegex.test(password)) {
    return {
      valid: false,
      status: 400,
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    };
  }

  // Enforce permitted signup roles
  const permittedRoles = ['EMPLOYEE', 'MANAGER', 'ADMIN', 'HR', 'TEAM_LEAD'];
  if (role && !permittedRoles.includes(role.toUpperCase())) {
    return { valid: false, message: 'Invalid role selection.', status: 400 };
  }

  return { valid: true };
};
