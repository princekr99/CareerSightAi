const fs = require('fs');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const ai = require('../utils/ai');
const { randomUUID } = require('crypto');
const memoryStore = require('../utils/memoryStore');
const { isMongoEnabled } = require('../utils/dbState');

// Handles uploaded PDF, extracts text, runs AI analysis, stores result
const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const dataBuffer = req.file.buffer;
    let text = '';

    try {
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text || '';
    } catch (parseError) {
      // Demo fallback: allow a text-based file renamed to .pdf so the UI can be tested easily.
      text = dataBuffer.toString('utf8');
    }

    // Analyze using AI util (Gemini or fallback)
    const analysis = await ai.analyzeResume(text);

    const resumeData = {
      user: req.userId || null,
      originalName: req.file.originalname,
      text,
      skills: analysis.skills,
      education: analysis.education,
      score: analysis.score,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      recommendedRoles: analysis.recommendedRoles,
      missingSkills: analysis.missingSkills,
      roadmap: analysis.roadmap
    };

    if (isMongoEnabled()) {
      const resume = await Resume.create(resumeData);
      return res.json({ resume });
    }

    const resume = { _id: randomUUID(), ...resumeData };
    memoryStore.resumes.push(resume);

    res.json({ resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process resume' });
  }
};

module.exports = { uploadResume };
