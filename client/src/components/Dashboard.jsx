import React, { useState } from 'react'
import ResumeUpload from './ResumeUpload'

function CircularScore({ score, theme }) {
  const isDark = theme === 'midnight'
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  // Color mapping based on score
  let strokeColor = 'stroke-rose-500'
  let textColor = 'text-rose-500'
  let bgColor = 'bg-rose-500/10'
  
  if (score >= 80) {
    strokeColor = 'stroke-emerald-500'
    textColor = 'text-emerald-500'
    bgColor = 'bg-emerald-500/10'
  } else if (score >= 50) {
    strokeColor = 'stroke-amber-500'
    textColor = 'text-amber-500'
    bgColor = 'bg-amber-500/10'
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-200/40 bg-white/50 dark:border-slate-800/40 dark:bg-slate-900/30">
      <div className="relative h-24 w-24">
        {/* Background Track */}
        <svg className="h-full w-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            className={`fill-none stroke-2 ${isDark ? 'stroke-slate-800' : 'stroke-slate-100'}`}
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            className={`fill-none stroke-3 transition-all duration-1000 ease-out ${strokeColor}`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black tracking-tighter">{score}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Score</span>
        </div>
      </div>
      <span className={`mt-3 text-xs font-bold px-2.5 py-1 rounded-full ${textColor} ${bgColor}`}>
        {score >= 80 ? 'Good Fit' : score >= 50 ? 'Developing' : 'Needs Work'}
      </span>
    </div>
  )
}

function StatCard({ label, value, icon, theme }) {
  const isDark = theme === 'midnight'
  return (
    <div className={`rounded-2xl border p-4.5 flex items-center gap-4 ${
      isDark ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200/50 bg-white shadow-sm'
    }`}>
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${
        isDark ? 'bg-slate-900 text-violet-400' : 'bg-indigo-50 text-indigo-600'
      }`}>
        {icon}
      </div>
      <div>
        <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</div>
        <div className="mt-1 text-xl font-bold tracking-tight">{value}</div>
      </div>
    </div>
  )
}

export default function Dashboard({ user, onLogout, theme, onToggleTheme }) {
  const [resume, setResume] = useState(null)
  const [resumes, setResumes] = useState([])
  const [completedWeeks, setCompletedWeeks] = useState({
    1: false,
    2: false,
    3: false,
    4: false
  })

  const handleResult = (r) => {
    setResume(r)
    setResumes((s) => [r, ...s].slice(0, 6))
    // Reset roadmap checkboxes for new resume
    setCompletedWeeks({ 1: false, 2: false, 3: false, 4: false })
  }

  const isDark = theme === 'midnight'

  const toggleWeek = (weekNum) => {
    setCompletedWeeks(prev => ({
      ...prev,
      [weekNum]: !prev[weekNum]
    }))
  }

  // Predefined total skills counts to calculate match % dynamically
  const ROLE_TOTALS = {
    'Frontend Intern': 5,
    'Backend Intern': 6,
    'Full Stack Intern': 6,
    'Data Analyst Intern': 5
  }

  const calculateMatch = (roleName, missingSkillsList) => {
    const total = ROLE_TOTALS[roleName] || 5
    const missing = (missingSkillsList || []).length
    const match = Math.max(0, Math.min(100, Math.round(((total - missing) / total) * 100)))
    return match
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-[#050713] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Dynamic Glow blobs */}
      <div className="absolute top-0 right-0 h-[40vh] w-[40vw] bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[40vh] w-[40vw] bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Main Navbar */}
      <nav className={`border-b sticky top-0 z-50 backdrop-blur-md ${
        isDark ? 'border-slate-800/80 bg-slate-950/80' : 'border-slate-200/50 bg-white/80'
      }`}>
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-bold shadow-md">
              C
            </div>
            <span className="text-base font-extrabold tracking-wider uppercase">CareerSight AI</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleTheme}
              className={`p-2.5 rounded-xl border transition ${
                isDark ? 'border-slate-800 hover:bg-slate-900 text-slate-300' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
              title="Toggle Theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <div className={`hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-glow" />
              {user.name}
            </div>
            <button 
              onClick={onLogout} 
              className={`rounded-xl border px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                isDark 
                  ? 'border-slate-800 hover:bg-slate-900 hover:text-white text-slate-300' 
                  : 'border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-700'
              }`}
            >
              Logout <span>↳</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Grid Wrapper */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight">Student Workspace</h2>
          <p className={`text-sm mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Analyze your resume, discover matching internship positions, and track your week-by-week upgrades.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-start">
          {/* LEFT GRID: Upload & History */}
          <div className="space-y-6">
            <div className={`rounded-3xl border p-6 ${
              isDark ? 'border-slate-800/80 bg-slate-900/30' : 'border-slate-200/50 bg-white shadow-sm'
            }`}>
              <h3 className="text-lg font-bold tracking-tight mb-2">Upload Resume</h3>
              <p className={`text-xs mb-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Upload your resume in PDF or TXT. Our analyzer parses structural text to measure suitability scores and roadmap skill upgrades.
              </p>
              <ResumeUpload onResult={handleResult} theme={theme} />
            </div>

            <div className={`rounded-3xl border p-6 ${
              isDark ? 'border-slate-800/80 bg-slate-900/30' : 'border-slate-200/50 bg-white shadow-sm'
            }`}>
              <h3 className="text-md font-bold tracking-tight mb-4">Analysis History</h3>
              <div className="space-y-3">
                {resumes.length === 0 && (
                  <p className={`text-xs text-center py-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    No scans in this session yet. Upload a file above to start.
                  </p>
                )}
                {resumes.map((r, idx) => (
                  <button
                    key={r._id || idx}
                    onClick={() => setResume(r)}
                    className={`w-full text-left flex items-center justify-between rounded-xl border p-3.5 transition hover:scale-[1.01] active:scale-[0.99] ${
                      resume?._id === r._id
                        ? (isDark ? 'border-violet-500 bg-violet-950/20' : 'border-indigo-600 bg-indigo-50/30')
                        : (isDark ? 'border-slate-800 bg-slate-950/40 hover:bg-slate-900/40' : 'border-slate-200 bg-white hover:bg-slate-50')
                    }`}
                  >
                    <div className="truncate max-w-[180px]">
                      <div className="text-xs font-bold truncate">{r.originalName}</div>
                      <div className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Scanned just now
                      </div>
                    </div>
                    <div className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                      r.score >= 80 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : r.score >= 50 ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      Score: {r.score}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT GRID: Report Dashboard */}
          <div className="space-y-6">
            {!resume ? (
              <div className={`rounded-3xl border border-dashed p-16 text-center flex flex-col items-center justify-center ${
                isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-white'
              }`}>
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-bold">Awaiting Scan Details</h3>
                <p className={`text-xs max-w-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Once you select and scan a resume, a dashboard detailing skill gaps and matching metrics will load here.
                </p>
              </div>
            ) : (
              <div className={`rounded-3xl border p-6 space-y-6 animate-rise ${
                isDark ? 'border-slate-800/80 bg-slate-900/30' : 'border-slate-200/50 bg-white shadow-sm'
              }`}>
                <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight">Resume Evaluation Report</h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Filename: <span className="font-bold">{resume.originalName}</span>
                    </p>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    Real-time AI
                  </div>
                </div>

                {/* Score Section */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <CircularScore score={resume.score} theme={theme} />
                  <div className="sm:col-span-2 grid grid-rows-2 gap-3.5">
                    <StatCard label="Technical Skills Detected" value={resume.skills?.length || 0} icon="🛠️" theme={theme} />
                    <StatCard label="Education Level" value={resume.education?.[0] || 'Undergraduate'} icon="🎓" theme={theme} />
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className={`rounded-2xl border p-4.5 ${isDark ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200/50 bg-slate-50/40'}`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5 mb-3">
                      <span>✓</span> Core Strengths
                    </h4>
                    <ul className="space-y-2 text-xs">
                      {(resume.strengths && resume.strengths.length > 0) ? (
                        resume.strengths.map((str, i) => (
                          <li key={i} className="flex gap-2 text-slate-600 dark:text-slate-300">
                            <span className="text-emerald-500">•</span> {str}
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-400">Excellent technical layout and terminology.</li>
                      )}
                    </ul>
                  </div>

                  <div className={`rounded-2xl border p-4.5 ${isDark ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200/50 bg-slate-50/40'}`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5 mb-3">
                      <span>⚠</span> Areas to Improve
                    </h4>
                    <ul className="space-y-2 text-xs">
                      {(resume.weaknesses && resume.weaknesses.length > 0) ? (
                        resume.weaknesses.map((w, i) => (
                          <li key={i} className="flex gap-2 text-slate-600 dark:text-slate-300">
                            <span className="text-rose-500">•</span> {w}
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-400">No major formatting anomalies found.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Skills Section */}
                <div className={`rounded-2xl border p-5 ${isDark ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-white'}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-3">Detected Keywords & Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills && resume.skills.length > 0 ? (
                      resume.skills.map((s, i) => (
                        <span 
                          key={i} 
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            isDark ? 'bg-slate-800/80 text-slate-200 border border-slate-700/50' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">No specific tech skills recognized in text.</span>
                    )}
                  </div>
                </div>

                {/* Internship Role Matching */}
                <div className={`rounded-2xl border p-5 ${isDark ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-white'}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-4">Recommended Internship Roles</h4>
                  <div className="space-y-5">
                    {resume.recommendedRoles?.map((role) => {
                      const matchPct = calculateMatch(role, resume.missingSkills?.[role])
                      let barColor = 'bg-rose-500'
                      if (matchPct >= 80) barColor = 'bg-emerald-500'
                      else if (matchPct >= 50) barColor = 'bg-amber-500'

                      return (
                        <div key={role} className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span>{role}</span>
                            <span className="font-bold">{matchPct}% Match</span>
                          </div>
                          {/* Progress Bar */}
                          <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${matchPct}%` }} />
                          </div>
                          {/* Gaps */}
                          {resume.missingSkills?.[role] && resume.missingSkills[role].length > 0 ? (
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                Missing:
                              </span>
                              {resume.missingSkills[role].map((m, i) => (
                                <span 
                                  key={i} 
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    isDark ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40' : 'bg-amber-50 text-amber-700 border border-amber-100'
                                  }`}
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-[10px] text-emerald-500 font-bold">✓ Matches all target requirements!</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 4-Week Learning Roadmap */}
                <div className={`rounded-2xl border p-5 ${isDark ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-white'}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-4">4-Week Upgrade Timeline</h4>
                  <div className="space-y-4 relative pl-4 border-l border-slate-200 dark:border-slate-800">
                    {resume.roadmap?.map((stepText, i) => {
                      const weekNum = i + 1
                      const isCompleted = completedWeeks[weekNum]
                      
                      return (
                        <div key={i} className="relative group">
                          {/* Timeline node circle */}
                          <div 
                            onClick={() => toggleWeek(weekNum)}
                            className={`absolute -left-[25px] top-0.5 flex h-4.5 w-4.5 cursor-pointer items-center justify-center rounded-full border text-[9px] font-bold transition-all duration-300 ${
                              isCompleted
                                ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                                : (isDark 
                                    ? 'bg-slate-900 border-slate-700 hover:border-violet-500 text-slate-400' 
                                    : 'bg-white border-slate-300 hover:border-indigo-600 text-slate-500')
                            }`}
                          >
                            {isCompleted ? '✓' : `0${weekNum}`}
                          </div>

                          <div className={`pl-2 transition duration-300 cursor-pointer ${
                            isCompleted ? 'opacity-50 line-through' : ''
                          }`} onClick={() => toggleWeek(weekNum)}>
                            <div className="text-xs font-bold tracking-tight">Week {weekNum} Goals</div>
                            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {stepText.replace(/^Week \d+:\s*/i, '')}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
