const resumeService = require('../services/resumeService');
const { asyncHandler } = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const uploadResumes = asyncHandler(async (req, res) => {
  const result = await resumeService.uploadResumes(req.files);

  sendSuccess(res, {
    statusCode: result.uploaded.length ? 201 : 200,
    message: `${result.uploaded.length} resume(s) uploaded successfully`,
    data: result,
  });
});

const searchResumes = asyncHandler(async (req, res) => {
  const { data, meta } = await resumeService.searchResumes(req.query);

  sendSuccess(res, {
    message: 'Resumes fetched successfully',
    data,
    meta,
  });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await resumeService.getAnalytics();

  sendSuccess(res, {
    message: 'Analytics fetched successfully',
    data: analytics,
  });
});

module.exports = { uploadResumes, searchResumes, getAnalytics };
