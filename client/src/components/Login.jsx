import React, { useState } from 'react'
import axios from 'axios'

export default function Login({ onLogin, theme }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      return setError('Please fill in all fields')
    }
    setLoading(true)
    setError('')
    try {
      const resp = await axios.post('/api/auth/login', { email, password })
      const { token, user } = resp.data
      localStorage.setItem('token', token)
      localStorage.setItem('careersight_user', JSON.stringify(user))
      onLogin(user)
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Verify backend service is online.')
    } finally {
      setLoading(false)
    }
  }

  const isDark = theme === 'midnight'

  return (
    <form onSubmit={submit} className="space-y-5">
      {error && (
        <div className={`rounded-xl border p-3.5 text-xs font-semibold flex items-center gap-2.5 animate-rise ${
          isDark 
            ? 'bg-rose-950/30 border-rose-800/40 text-rose-300' 
            : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 font-bold">!</span>
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="yourname@domain.com"
          className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
            isDark
              ? 'border-slate-800 bg-slate-950/40 text-white placeholder-slate-600 focus:border-violet-500'
              : 'border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:border-indigo-600'
          }`}
          disabled={loading}
        />
      </div>

      <div className="space-y-1.5">
        <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
            isDark
              ? 'border-slate-800 bg-slate-950/40 text-white placeholder-slate-600 focus:border-violet-500'
              : 'border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:border-indigo-600'
          }`}
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-xl py-3 text-sm font-bold shadow-md transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 ${
          isDark
            ? 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white hover:shadow-violet-600/20'
            : 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:shadow-indigo-500/20'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  )
}
