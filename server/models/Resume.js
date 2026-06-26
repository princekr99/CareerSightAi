const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  originalName: String,
  text: String,
  skills: [String],
  education: [String],
  score: Number,
  strengths: [String],
  weaknesses: [String],
  recommendedRoles: [String],
  missingSkills: Object,
  roadmap: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);
