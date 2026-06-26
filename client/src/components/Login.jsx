import React, { useState } from 'react'
import axios from 'axios'

export default function Login({ onLogin, switchToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const resp = await axios.post('/api/auth/login', { email, password })
      const { token, user } = resp.data
      localStorage.setItem('token', token)
      localStorage.setItem('careersight_user', JSON.stringify(user))
      onLogin(user)
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-md border px-3 py-2" />
      <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-md border px-3 py-2" />
      <div className="flex items-center justify-between">
        <button className="rounded-full bg-indigo-600 px-4 py-2 text-white">Sign in</button>
        <button type="button" onClick={switchToSignup} className="text-sm text-slate-600">Create account</button>
      </div>
    </form>
  )
}
