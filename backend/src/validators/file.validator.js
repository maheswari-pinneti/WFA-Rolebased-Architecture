export const validateFileData = (options = {}) => {
  const {
    allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf'],
    allowedMimeTypes = ['image/png', 'image/jpeg', 'application/pdf'],
    maxSizeBytes = 5 * 1024 * 1024 // 5MB
  } = options;

  return (req, res, next) => {
    // If no file uploaded, check if mandatory
    if (!req.file && !req.files) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : [req.file];

    for (const file of files) {
      if (!file) continue;

      // Check size
      if (file.size > maxSizeBytes) {
        return res.status(400).json({
          success: false,
          message: `File size exceeds limit of ${maxSizeBytes / (1024 * 1024)}MB.`
        });
      }

      // Check extension
      const extension = file.name ? file.name.split('.').pop().toLowerCase() : (file.originalname ? file.originalname.split('.').pop().toLowerCase() : '');
      if (!allowedExtensions.includes(extension)) {
        return res.status(400).json({
          success: false,
          message: `File extension .${extension} is not permitted.`
        });
      }

      // Check MIME type
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: `MIME type ${file.mimetype} is not permitted.`
        });
      }
    }

    next();
  };
};
