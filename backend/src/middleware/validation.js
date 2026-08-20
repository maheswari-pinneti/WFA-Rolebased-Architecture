import { validateLoginData, validateSignupData } from '../validators/auth.validator.js';
import { validateEmployeeCreateData, validateEmployeeUpdateData } from '../validators/employee.validator.js';
import { validateCheckInData, validateCorrectionData } from '../validators/attendance.validator.js';

export const validateLogin = (req, res, next) => {
  const result = validateLoginData(req.body);
  if (!result.valid) {
    return res.status(result.status || 400).json({ success: false, message: result.message });
  }
  next();
};

export const validateSignup = (req, res, next) => {
  const result = validateSignupData(req.body);
  if (!result.valid) {
    return res.status(result.status || 400).json({ success: false, message: result.message });
  }
  next();
};

export const validateEmployeeCreate = (req, res, next) => {
  const result = validateEmployeeCreateData(req.body);
  if (!result.valid) {
    return res.status(400).json({ success: false, message: result.message });
  }
  next();
};

export const validateEmployeeUpdate = (req, res, next) => {
  const result = validateEmployeeUpdateData(req.body);
  if (!result.valid) {
    return res.status(400).json({ success: false, message: result.message });
  }
  next();
};

export const validateCheckIn = (req, res, next) => {
  const result = validateCheckInData(req.body);
  if (!result.valid) {
    return res.status(400).json({ success: false, message: result.message });
  }
  next();
};

export const validateCorrection = (req, res, next) => {
  const result = validateCorrectionData(req.body);
  if (!result.valid) {
    return res.status(400).json({ success: false, message: result.message });
  }
  next();
};
