// Simple AI helper: tries to call Gemini API if key provided, otherwise uses a lightweight heuristic.
const axios = require('axios');

const ROLE_SKILLS = {
  'Frontend Intern': ['html', 'css', 'javascript', 'react', 'vue'],
  'Backend Intern': ['node', 'express', 'python', 'java', 'sql', 'mongodb'],
  'Full Stack Intern': ['html', 'css', 'javascript', 'node', 'react', 'mongodb'],
  'Data Analyst Intern': ['python', 'sql', 'excel', 'pandas', 'statistics']
};

// Fallback heuristic analysis
function heuristicAnalyze(text) {
  const lowercase = text.toLowerCase();
  const keywords = Array.from(new Set(lowercase.match(/[a-z0-9+#\.\-]+/g) || []));

  // Simple skill detection: check keywords against role skills
  const skillsFound = [];
  Object.values(ROLE_SKILLS).flat().forEach((skill) => {
    if (lowercase.includes(skill)) skillsFound.push(skill);
  });

  const education = [];
  if (/bachelor|bs\b|b\.sc|bsc/.test(lowercase)) education.push('Bachelors');
  if (/master|ms\b|m\.sc|msc/.test(lowercase)) education.push('Masters');

  // score out of 100 based on skills found
  const score = Math.min(90, 40 + skillsFound.length * 10);

  // strengths/weaknesses simple split
  const strengths = skillsFound.slice(0, 5);
  const weaknesses = ['system design', 'advanced algorithms'].filter(w => !skillsFound.includes(w));

  // Recommended roles by matching counts
  const roleScores = {};
  Object.entries(ROLE_SKILLS).forEach(([role, reqs]) => {
    const common = reqs.filter(r => skillsFound.includes(r)).length;
    roleScores[role] = common;
  });

  const recommendedRoles = Object.entries(roleScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(r => r[0]);

  // missing skills per recommended role
  const missingSkills = {};
  recommendedRoles.forEach((role) => {
    missingSkills[role] = ROLE_SKILLS[role].filter(s => !skillsFound.includes(s));
  });

  // Simple 4-week roadmap
  const roadmap = [
    'Week 1: Strengthen fundamentals and core languages (HTML/CSS/JS or Python/SQL)',
    'Week 2: Build small projects focused on chosen role',
    'Week 3: Learn frameworks/tools relevant to the role',
    'Week 4: Polish resume, prepare 2-3 portfolio items, practice interviews'
  ];

  return { skills: skillsFound, education, score, strengths, weaknesses, recommendedRoles, missingSkills, roadmap };
}

async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('No GEMINI API key');

  // Placeholder: user must replace with actual Gemini API details.
  const endpoint = 'https://api.gemini.example/v1/analyze';
  const resp = await axios.post(endpoint, { prompt }, { headers: { Authorization: `Bearer ${key}` } });
  return resp.data;
}

async function analyzeResume(text) {
  try {
    if (process.env.GEMINI_API_KEY) {
      // If Gemini key present, attempt to use it; expect structured response
      const resp = await callGemini(text);
      // Expect resp to contain the fields; otherwise fallback
      if (resp && resp.skills) return resp;
    }
  } catch (err) {
    console.warn('Gemini call failed, falling back to heuristic:', err.message);
  }
  return heuristicAnalyze(text);
}

module.exports = { analyzeResume };
