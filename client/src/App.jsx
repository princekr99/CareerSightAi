import React, { useEffect, useState } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'

const highlights = [
  { label: 'Resume score', value: 'Instant Analysis', tone: 'from-violet-500 to-purple-600' },
  { label: 'Role match', value: 'AI Matchmaking', tone: 'from-cyan-400 to-indigo-500' },
  { label: 'Roadmap', value: '4-Week Timeline', tone: 'from-amber-400 to-orange-500' },
]

export const themes = {
  aurora: {
    name: 'Aurora Light',
    shell: 'bg-slate-50/50',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_30%),linear-gradient(180deg,_#f8fafc,_#eef2ff_60%,_#f8fafc)]',
    card: 'glass-card-light shadow-[0_30px_90px_rgba(15,23,42,0.06)] border-slate-200/50 text-slate-900',
    softCard: 'bg-white/70 border-slate-200/40 text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.03)]',
    text: 'text-slate-900',
    title: 'text-slate-950',
    textMuted: 'text-slate-600',
    accent: 'text-indigo-600',
    accentBg: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    button: 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:shadow-indigo-500/20',
  },
  midnight: {
    name: 'Midnight Dark',
    shell: 'bg-[#050713]',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.15),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.12),_transparent_35%),linear-gradient(180deg,_#050713,_#0b0e27_70%,_#050713)]',
    card: 'glass-card-dark shadow-[0_30px_90px_rgba(0,0,0,0.5)] border-slate-800/80 text-slate-100',
    softCard: 'bg-slate-900/60 border-slate-800/50 text-slate-200 shadow-[0_12px_30px_rgba(0,0,0,0.2)]',
    text: 'text-slate-100',
    title: 'text-white',
    textMuted: 'text-slate-400',
    accent: 'text-violet-400',
    accentBg: 'bg-violet-950/40 border-violet-800/50 text-violet-300',
    button: 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:shadow-violet-600/30',
  }
}

export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('login')
  const [theme, setTheme] = useState(() => localStorage.getItem('careersight_theme') || 'midnight')

  useEffect(() => {
    const saved = localStorage.getItem('careersight_user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('careersight_theme', theme)
    if (theme === 'midnight') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const activeTheme = themes[theme] || themes.midnight
  const toggleTheme = () => setTheme((current) => (current === 'aurora' ? 'midnight' : 'aurora'))

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
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] shadow-sm backdrop-blur transition hover:scale-[1.03] active:scale-[0.98] ${
        theme === 'midnight'
          ? 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-900'
          : 'border-slate-200 bg-white/80 text-slate-700 hover:bg-white'
      }`}
    >
      {theme === 'midnight' ? (
        <>
          <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.46 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" />
          </svg>
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          <span>Dark Mode</span>
        </>
      )}
    </button>
  )

  if (!user) {
    return (
      <div className={`relative min-h-screen overflow-hidden px-4 py-8 transition-colors duration-300 ${activeTheme.shell} ${activeTheme.text}`}>
        {/* Glow effects */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${activeTheme.glow}`} />
        <div className="absolute left-[-5rem] top-16 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-10 right-[-4rem] h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl animate-float-slow pointer-events-none" />

        <div className="relative mx-auto flex max-w-6xl justify-between items-center pb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-bold shadow-md shadow-violet-500/20">
              C
            </div>
            <span className={`text-lg font-black tracking-wider uppercase ${theme === 'midnight' ? 'text-white' : 'text-slate-900'}`}>
              CareerSight AI
            </span>
          </div>
          {themeToggle}
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-10rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-10">
            <div className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] shadow-sm backdrop-blur animate-rise ${activeTheme.accentBg}`}>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-glow" />
              Elevate Your Internship Prospects
            </div>

            <div className="max-w-2xl space-y-5 animate-rise delay-1">
              <h1 className={`text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] ${activeTheme.title}`}>
                Turn your resume into a clear <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">career action plan</span>.
              </h1>
              <p className={`max-w-xl text-base sm:text-lg leading-relaxed ${activeTheme.textMuted}`}>
                Upload your resume to instantly receive a matching score, map essential technical skills, detect gaps, and map out a customized 4-week learning roadmap.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item, index) => (
                <div
                  key={item.label}
                  className={`rounded-2xl border p-5 transition duration-300 hover:scale-[1.02] ${activeTheme.softCard} animate-rise`}
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${item.tone}`} />
                  <div className={`mt-4 text-xs font-semibold uppercase tracking-wider ${activeTheme.textMuted}`}>{item.label}</div>
                  <div className="mt-2.5 text-lg font-bold">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className={`rounded-2xl border p-5 backdrop-blur animate-rise delay-2`}>
                <div className={`text-xs font-bold uppercase tracking-[0.2em] ${activeTheme.accent}`}>What You Analyze</div>
                <ul className="mt-4 space-y-3.5 text-sm">
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 font-bold text-[10px]">✓</span> 
                    Interactive score out of 100
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-500 font-bold text-[10px]">✓</span> 
                    Target skills mapping for key roles
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">✓</span> 
                    Step-by-step 4-week upgrade path
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur animate-rise delay-3">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Simple Roadmap</div>
                <div className="mt-4 space-y-2.5 text-xs text-slate-300">
                  <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 transition hover:bg-white/10 flex items-center gap-3">
                    <span className="font-mono text-indigo-400 font-bold">01</span> Sign Up / Login
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 transition hover:bg-white/10 flex items-center gap-3">
                    <span className="font-mono text-indigo-400 font-bold">02</span> Upload PDF Resume
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 transition hover:bg-white/10 flex items-center gap-3">
                    <span className="font-mono text-indigo-400 font-bold">03</span> Get Instant AI Insights
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative animate-rise delay-2">
            <div className="absolute -left-6 top-8 hidden h-28 w-28 rounded-full bg-emerald-500/5 blur-2xl lg:block pointer-events-none" />
            <div className="absolute -right-4 bottom-8 hidden h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl lg:block pointer-events-none" />

            <div className={`relative overflow-hidden rounded-3xl border p-8 backdrop-blur-xl ${activeTheme.card}`}>
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400" />
              <div className="mb-8">
                <p className={`text-xs font-bold uppercase tracking-[0.2em] mb-2.5 ${activeTheme.accent}`}>Access Portal</p>
                <h2 className="text-2xl font-black">{view === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                <p className={`mt-2 text-sm leading-relaxed ${activeTheme.textMuted}`}>
                  {view === 'login' 
                    ? 'Enter your credentials to access your saved resume reviews and career insights.' 
                    : 'Register to upload resumes, perform key analytics, and receive customized roadmap recommendations.'}
                </p>
              </div>

              {view === 'login' ? (
                <>
                  <Login onLogin={handleLogin} theme={theme} />
                  <p className={`mt-6 text-sm text-center ${activeTheme.textMuted}`}>
                    Need an account?{' '}
                    <button onClick={() => setView('signup')} className="font-bold text-violet-500 hover:text-violet-400 transition underline underline-offset-4">
                      Create account
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <Signup onSignup={handleSignup} theme={theme} />
                  <p className={`mt-6 text-sm text-center ${activeTheme.textMuted}`}>
                    Already registered?{' '}
                    <button onClick={() => setView('login')} className="font-bold text-violet-500 hover:text-violet-400 transition underline underline-offset-4">
                      Sign in
                    </button>
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
