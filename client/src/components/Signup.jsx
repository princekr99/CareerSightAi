import React, { useState } from 'react'
import axios from 'axios'

export default function Signup({ onSignup, switchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      const resp = await axios.post('/api/auth/signup', { name, email, password })
      const { token, user } = resp.data
      localStorage.setItem('token', token)
      localStorage.setItem('careersight_user', JSON.stringify(user))
      onSignup(user)
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed. Check API URL and backend availability.')
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" className="w-full rounded-md border px-3 py-2" />
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-md border px-3 py-2" />
      <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-md border px-3 py-2" />
      <div className="flex items-center justify-between">
        <button className="rounded-full bg-indigo-600 px-4 py-2 text-white">Create account</button>
        <button type="button" onClick={switchToLogin} className="text-sm text-slate-600">Sign in</button>
      </div>
    </form>
  )
}
