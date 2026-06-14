const express = require('express');
const resumeController = require('../controllers/resumeController');
const { uploadResumes } = require('../middleware/uploadMiddleware');
const { validateSearch, validateUpload } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', validateSearch, resumeController.searchResumes);
router.get('/analytics', resumeController.getAnalytics);
router.post('/', uploadResumes, validateUpload, resumeController.uploadResumes);

module.exports = router;
