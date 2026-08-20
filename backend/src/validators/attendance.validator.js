export const validateCheckInData = (data) => {
  const { shiftType, workMode, latitude, longitude, accuracy } = data || {};

  if (!shiftType || typeof shiftType !== 'string' || !shiftType.trim()) {
    return { valid: false, message: 'Shift type is required.' };
  }

  if (!workMode || typeof workMode !== 'string' || !workMode.trim()) {
    return { valid: false, message: 'Work mode is required.' };
  }

  if (workMode === 'Office') {
    if (latitude === undefined || longitude === undefined) {
      return { valid: false, message: 'Location coordinates required for Office check-in.' };
    }
    if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
      return { valid: false, message: 'Latitude and longitude must be numbers.' };
    }
    if (accuracy !== undefined && (isNaN(Number(accuracy)) || Number(accuracy) <= 0)) {
      return { valid: false, message: 'Location accuracy must be a valid positive number.' };
    }
  }

  return { valid: true };
};

export const validateCorrectionData = (data) => {
  const { date, requestedCheckIn, requestedCheckOut, reason } = data || {};

  if (!date || typeof date !== 'string' || !date.trim()) {
    return { valid: false, message: 'Complete correction details are required.' };
  }

  if (!requestedCheckIn || typeof requestedCheckIn !== 'string' || !requestedCheckIn.trim()) {
    return { valid: false, message: 'Complete correction details are required.' };
  }

  if (!requestedCheckOut || typeof requestedCheckOut !== 'string' || !requestedCheckOut.trim()) {
    return { valid: false, message: 'Complete correction details are required.' };
  }

  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    return { valid: false, message: 'Complete correction details are required.' };
  }

  // Regex to validate date (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { valid: false, message: 'Invalid date format. Expected YYYY-MM-DD.' };
  }

  return { valid: true };
};
