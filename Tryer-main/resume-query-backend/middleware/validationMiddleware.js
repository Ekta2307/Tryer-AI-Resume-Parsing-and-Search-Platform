const validateUpload = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    const error = new Error('Upload at least one PDF or DOCX resume');
    error.statusCode = 400;
    return next(error);
  }

  return next();
};

const validateSearch = (req, res, next) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  if (!Number.isInteger(page) || page < 1) {
    const error = new Error('Page must be a positive integer');
    error.statusCode = 400;
    return next(error);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    const error = new Error('Limit must be between 1 and 50');
    error.statusCode = 400;
    return next(error);
  }

  return next();
};

module.exports = { validateUpload, validateSearch };
