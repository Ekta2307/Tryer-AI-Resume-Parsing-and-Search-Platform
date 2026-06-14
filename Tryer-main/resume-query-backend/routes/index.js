const express = require('express');
const resumeController = require('../controllers/resumeController');
const { uploadResumes } = require('../middleware/uploadMiddleware');
const { validateSearch, validateUpload } = require('../middleware/validationMiddleware');
const resumeRoutes = require('./resumeRoutes');

const router = express.Router();

router.use('/resumes', resumeRoutes);

router.post('/upload', uploadResumes, validateUpload, resumeController.uploadResumes);
router.get('/search', validateSearch, resumeController.searchResumes);

module.exports = router;
