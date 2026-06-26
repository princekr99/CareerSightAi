import React, { useState } from 'react'
import ResumeUpload from './ResumeUpload'

function StatCard({ label, value, color = 'from-indigo-500 to-cyan-400' }) {
  return (
    <div className="rounded-xl bg-gradient-to-br p-4 text-white shadow" style={{ backgroundImage: `linear-gradient(135deg,var(--tw-gradient-stops))` }}>
      <div className="text-sm font-medium opacity-90">{label}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  )
}

export default function Dashboard({ user, onLogout }) {
  const [resume, setResume] = useState(null)
  const [resumes, setResumes] = useState([])

  const handleResult = (r) => {
    setResume(r)
    setResumes((s) => [r, ...s].slice(0, 6))
  }

  return (
    <div className="mx-auto mt-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome, {user.name}</h2>
          <p className="text-sm text-slate-600">Instant resume feedback and actionable roadmap</p>
        </div>
        <div>
          <button onClick={onLogout} className="rounded-md border px-3 py-2 text-sm">Logout</button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-lg font-semibold">Upload resume</h3>
            <p className="mt-1 text-sm text-slate-500">Supported: PDF or text. We'll extract skills and suggest a roadmap.</p>
            <div className="mt-4">
              <ResumeUpload onResult={handleResult} />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h4 className="text-md font-semibold">Recent uploads</h4>
            <div className="mt-3 space-y-2">
              {resumes.length === 0 && <div className="text-sm text-slate-500">No uploads yet</div>}
              {resumes.map((r) => (
                <div key={r._id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="text-sm font-medium">{r.originalName}</div>
                    <div className="text-xs text-slate-500">Score: <strong>{r.score}</strong></div>
                  </div>
                  <div className="text-xs text-slate-500">{new Date().toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h3 className="text-lg font-semibold">Analysis</h3>
            {!resume ? (
              <div className="mt-4 text-sm text-slate-500">Upload a resume to see the analysis here.</div>
            ) : (
              <div className="mt-4 grid gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <StatCard label="Resume Score" value={resume.score} />
                  <StatCard label="Skills Detected" value={resume.skills?.length || 0} />
                  <StatCard label="Recommended Roles" value={resume.recommendedRoles?.length || 0} />
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold">Top skills</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {resume.skills?.slice(0, 12).map((s, i) => (
                      <div key={i} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{s}</div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold">Roadmap</h4>
                  <ol className="mt-2 list-decimal pl-5 text-sm text-slate-700">
                    {resume.roadmap?.map((r, i) => <li key={i}>{r}</li>)}
                  </ol>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold">Missing skills by role</h4>
                  <div className="mt-2 space-y-2 text-sm text-slate-700">
                    {resume.recommendedRoles?.map((role) => (
                      <div key={role}>
                        <div className="font-medium">{role}</div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {(resume.missingSkills?.[role] || []).map((m, i) => (
                            <div key={i} className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">{m}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
