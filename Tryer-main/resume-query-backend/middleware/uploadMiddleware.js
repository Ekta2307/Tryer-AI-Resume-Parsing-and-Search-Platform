const path = require('path');
const multer = require('multer');
const { env } = require('../config/env');

const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const allowedExtensions = ['.pdf', '.docx'];

const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedMimeTypes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
    const error = new Error('Only PDF and DOCX resumes are allowed');
    error.statusCode = 400;
    return callback(error);
  }

  return callback(null, true);
};

const uploadResumes = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: env.uploadLimitMb * 1024 * 1024,
    files: 25,
  },
}).array('resumes', 25);

module.exports = { uploadResumes };
