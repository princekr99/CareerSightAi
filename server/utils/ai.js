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

async function callGemini(text) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('No GEMINI API key');

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
  
  const systemInstruction = `You are an expert resume analyzer. Analyze the provided resume text and extract the following details. Your output must strictly follow the JSON schema:
- skills: Array of detected technologies, programming languages, libraries, frameworks, tools (all lowercase).
- education: Array of degrees found (e.g. "Bachelors", "Masters", "B.Tech").
- score: Integer rating from 0 to 100 based on resume strength, formatting, and relevance.
- strengths: Array of 3-5 key strengths or callouts (e.g. "Strong Java background", "Open-source contributor").
- weaknesses: Array of 2-4 areas of improvement.
- recommendedRoles: Array of matching career roles (e.g. "Frontend Intern", "Backend Intern", "Full Stack Intern", "Data Analyst Intern").
- missingSkills: An object mapping EACH of the recommended roles to an array of skills standard for that role that the user is missing in their resume.
- roadmap: A 4-week actionable weekly learning roadmap to improve skills and qualify for recommended roles (4 strings).`;

  const payload = {
    contents: [
      {
        parts: [
          { text: `Resume text:\n\n${text}` }
        ]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          skills: { type: "ARRAY", items: { type: "STRING" } },
          education: { type: "ARRAY", items: { type: "STRING" } },
          score: { type: "INTEGER" },
          strengths: { type: "ARRAY", items: { type: "STRING" } },
          weaknesses: { type: "ARRAY", items: { type: "STRING" } },
          recommendedRoles: { type: "ARRAY", items: { type: "STRING" } },
          missingSkills: {
            type: "OBJECT",
            properties: {
              "Frontend Intern": { type: "ARRAY", items: { type: "STRING" } },
              "Backend Intern": { type: "ARRAY", items: { type: "STRING" } },
              "Full Stack Intern": { type: "ARRAY", items: { type: "STRING" } },
              "Data Analyst Intern": { type: "ARRAY", items: { type: "STRING" } }
            }
          },
          roadmap: { type: "ARRAY", items: { type: "STRING" } }
        },
        required: ["skills", "education", "score", "strengths", "weaknesses", "recommendedRoles", "missingSkills", "roadmap"]
      }
    }
  };

  const resp = await axios.post(endpoint, payload);
  const resultText = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!resultText) throw new Error('Empty response from Gemini API');
  return JSON.parse(resultText);
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
