const crypto = require('crypto');
const Resume = require('../models/Resume');
const { parseResume } = require('./parserService');
const { rankResumes } = require('./rankingService');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildRegex = (value) => new RegExp(escapeRegex(value.trim()), 'i');

const buildSearchQuery = ({ q, name, location, experience, skills, minExperience }) => {
  const query = {};
  const or = [];
  const and = [];

  if (q) {
    const regex = buildRegex(q);
    or.push({ name: regex }, { location: regex }, { experience: regex }, { skills: regex }, { projects: regex });
  }

  if (name) query.name = buildRegex(name);
  if (location) query.location = buildRegex(location);
  if (experience) query.experience = buildRegex(experience);
  if (minExperience) query.experienceYears = { $gte: Number(minExperience) };

  if (skills) {
    const skillTerms = skills.split(',').map((skill) => skill.trim()).filter(Boolean);
    if (skillTerms.length) {
      skillTerms.forEach((skill) => {
        and.push({ skills: buildRegex(skill) });
      });
    }
  }

  if (or.length) query.$or = or;
  if (and.length) query.$and = and;
  return query;
};

const createFileHash = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

const uploadResumes = async (files) => {
  const uploaded = [];
  const duplicates = [];
  const failed = [];

  for (const file of files) {
    try {
      const fileHash = createFileHash(file.buffer);
      const existing = await Resume.findOne({ fileHash }).lean();

      if (existing) {
        duplicates.push({ fileName: file.originalname, resumeId: existing._id });
        continue;
      }

      const parsed = await parseResume(file);
      const resume = await Resume.create({
        ...parsed,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileHash,
      });

      uploaded.push(resume);
    } catch (error) {
      failed.push({ fileName: file.originalname, message: error.message });
    }
  }

  return { uploaded, duplicates, failed };
};

const searchResumes = async (filters) => {
  const page = Number(filters.page || 1);
  const limit = Number(filters.limit || 10);
  const skip = (page - 1) * limit;
  const query = buildSearchQuery(filters);

  const [allMatches, total] = await Promise.all([
    Resume.find(query).sort({ createdAt: -1 }).lean(),
    Resume.countDocuments(query),
  ]);

  const ranked = rankResumes(allMatches, filters);
  const data = ranked.slice(skip, skip + limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

const getAnalytics = async () => {
  const [totalResumes, topSkills, recentResumes] = await Promise.all([
    Resume.countDocuments(),
    Resume.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: { $toLower: '$skills' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, skill: '$_id', count: 1 } },
    ]),
    Resume.find().sort({ createdAt: -1 }).limit(5).select('name skills location experience createdAt').lean(),
  ]);

  return { totalResumes, topSkills, recentResumes };
};

module.exports = { uploadResumes, searchResumes, getAnalytics };
