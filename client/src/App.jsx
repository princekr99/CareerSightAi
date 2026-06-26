import React, { useEffect, useMemo, useState } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'

const highlights = [
  { label: 'Resume score', value: '100', tone: 'from-emerald-400 to-teal-500' },
  { label: 'Role match', value: 'AI + Skills', tone: 'from-indigo-400 to-cyan-500' },
  { label: 'Roadmap', value: '4 weeks', tone: 'from-amber-400 to-orange-500' },
]

const themes = {
  aurora: {
    name: 'Aurora',
    shell: 'bg-[#f7f8fc]',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(180deg,_#f8fafc,_#eef2ff_55%,_#f8fafc)]',
    card: 'bg-white/90 border-slate-200',
    softCard: 'bg-white/80 border-slate-200',
    text: 'text-slate-900',
  },
  sunset: {
    name: 'Sunset',
    shell: 'bg-[#fff8f4]',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(236,72,153,0.14),_transparent_28%),linear-gradient(180deg,_#fff7ed,_#fff1f2_55%,_#fff8f4)]',
    card: 'bg-white/90 border-orange-100',
    softCard: 'bg-white/80 border-orange-100',
    text: 'text-slate-900',
  },
}

export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('login')
  const [theme, setTheme] = useState(() => localStorage.getItem('careersight_theme') || 'aurora')

  useEffect(() => {
    const saved = localStorage.getItem('careersight_user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('careersight_theme', theme)
  }, [theme])

  const activeTheme = themes[theme] || themes.aurora
  const toggleTheme = () => setTheme((current) => (current === 'aurora' ? 'sunset' : 'aurora'))

  const handleLogin = (nextUser) => {
    localStorage.setItem('careersight_user', JSON.stringify(nextUser))
    setUser(nextUser)
  }

  const handleSignup = (nextUser) => {
    localStorage.setItem('careersight_user', JSON.stringify(nextUser))
    setUser(nextUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('careersight_user')
    localStorage.removeItem('token')
    setUser(null)
    setView('login')
  }

  const themeToggle = (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm backdrop-blur transition hover:scale-[1.02] hover:bg-white"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
      {themes[theme].name}
    </button>
  )

  if (!user) {
    return (
      <div className={`relative min-h-screen overflow-hidden px-4 py-8 text-slate-900 ${activeTheme.shell}`}>
        <div className={`absolute inset-0 ${activeTheme.glow}`} />
        <div className="absolute left-[-5rem] top-16 h-40 w-40 rounded-full bg-indigo-300/30 blur-3xl animate-float" />
        <div className="absolute bottom-10 right-[-4rem] h-52 w-52 rounded-full bg-cyan-300/30 blur-3xl animate-float-slow" />

        <div className="relative mx-auto flex max-w-6xl justify-end pb-2">
          {themeToggle}
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-700 shadow-sm backdrop-blur animate-rise">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              CareerSight AI
            </div>

            <div className="max-w-2xl space-y-4 animate-rise delay-1">
              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Turn a resume into a clear career action plan.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Upload a resume, detect skills, score it, match internships, show gaps, and generate a simple learning roadmap for students.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item, index) => (
                <div key={item.label} className={`rounded-3xl border ${activeTheme.softCard} bg-white/80 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur animate-rise`} style={{ animationDelay: `${index * 120}ms` }}>
                  <div className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${item.tone}`} />
                  <div className="mt-4 text-sm font-medium text-slate-500">{item.label}</div>
                  <div className="mt-2 text-xl font-semibold text-slate-900">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className={`rounded-3xl border ${activeTheme.softCard} bg-white/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur animate-rise delay-2`}>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">What students get</div>
                <ul className="mt-4 space-y-3 text-sm text-slate-700">
                  <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" /> Resume score out of 100</li>
                  <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-cyan-500" /> Missing skills by role</li>
                  <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" /> 4-week roadmap to improve</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)] animate-rise delay-3">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Recommended flow</div>
                <div className="mt-4 space-y-3 text-sm text-slate-200">
                  <div className="rounded-2xl bg-white/5 px-4 py-3 transition hover:bg-white/10">1. Create account</div>
                  <div className="rounded-2xl bg-white/5 px-4 py-3 transition hover:bg-white/10">2. Upload PDF resume</div>
                  <div className="rounded-2xl bg-white/5 px-4 py-3 transition hover:bg-white/10">3. Review gaps and roadmap</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative animate-rise delay-2">
            <div className="absolute -left-6 top-8 hidden h-28 w-28 rounded-full bg-emerald-300/20 blur-2xl lg:block" />
            <div className="absolute -right-4 bottom-8 hidden h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl lg:block" />

            <div className={`relative overflow-hidden rounded-[2rem] border ${activeTheme.card} bg-white/90 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.16)] backdrop-blur-xl`}>
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-400" />
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 mb-2">Try it now</p>
                  <h2 className="text-2xl font-bold text-slate-900">{view === 'login' ? 'Sign in' : 'Create account'}</h2>
                  <p className="mt-2 text-sm text-slate-600">A clean student-friendly dashboard with fast resume feedback.</p>
                </div>
                <div className="hidden rounded-2xl bg-slate-50 px-3 py-2 text-right sm:block">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Live</div>
                  <div className="text-sm font-semibold text-slate-900">AI Resume Review</div>
                </div>
              </div>
              {view === 'login' ? (
                <>
                  <Login onLogin={handleLogin} />
                  <p className="mt-4 text-sm text-slate-600">
                    New? <button onClick={() => setView('signup')} className="font-semibold text-indigo-600 hover:text-indigo-700">Create account</button>
                  </p>
                </>
              ) : (
                <>
                  <Signup onSignup={handleSignup} />
                  <p className="mt-4 text-sm text-slate-600">
                    Have an account? <button onClick={() => setView('login')} className="font-semibold text-indigo-600 hover:text-indigo-700">Sign in</button>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <Dashboard user={user} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />
}
