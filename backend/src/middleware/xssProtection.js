export const xssAndNoSqlProtection = (req, res, next) => {
  const sanitize = (value) => {
    if (typeof value === 'string') {
      // Prevent HTML/XSS injections by escaping brackets and special characters
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    } else if (typeof value === 'object' && value !== null) {
      // Prevent NoSQL operators like $gt, $ne, $where, $lt
      const sanitizedObj = Array.isArray(value) ? [] : {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          if (key.startsWith('$')) {
            console.warn(`[SECURITY WARNING] Blocked NoSQL operator: ${key}`);
            continue; // strip keys starting with $ to prevent operator injection
          }
          sanitizedObj[key] = sanitize(value[key]);
        }
      }
      return sanitizedObj;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }
  next();
};
