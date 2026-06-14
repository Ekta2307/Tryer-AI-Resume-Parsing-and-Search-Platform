const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: 'Unknown' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    contactInfo: { type: String, trim: true, default: '' },
    experience: { type: String, trim: true, default: 'N/A' },
    experienceYears: { type: Number, default: 0, min: 0 },
    location: { type: String, trim: true, default: 'N/A' },
    skills: [{ type: String, trim: true }],
    projects: [{ type: String, trim: true }],
    rawText: { type: String, select: false },
    fileName: { type: String, required: true, trim: true },
    fileType: { type: String, required: true, enum: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] },
    fileHash: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

ResumeSchema.index({ name: 'text', skills: 'text', location: 'text', experience: 'text', projects: 'text' });
ResumeSchema.index({ email: 1 }, { sparse: true });
ResumeSchema.index({ skills: 1 });
ResumeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Resume', ResumeSchema);
