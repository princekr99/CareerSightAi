import React, { useState, useRef } from 'react'
import axios from 'axios'

export default function ResumeUpload({ onResult }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const onDrop = (f) => {
    setFile(f)
    setError('')
  }

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (f) onDrop(f)
  }

  const submit = async (e) => {
    e && e.preventDefault()
    if (!file) return setError('Select a file to upload')
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('resume', file)
      const token = localStorage.getItem('token')
      const resp = await axios.post('/api/resume/upload', form, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      onResult(resp.data.resume)
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload failed')
    } finally { setLoading(false) }
  }

  return (
    <div>
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <label className="group relative flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-6 hover:border-indigo-300">
        <input ref={inputRef} type="file" accept="application/pdf,.pdf,.txt" onChange={handleFile} className="sr-only" />
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl">📄</div>
          <div className="text-sm font-medium text-slate-900">Drag & drop your resume here, or click to select</div>
          <div className="text-xs text-slate-500">PDF or text file — under 2MB recommended</div>
          {file && <div className="mt-2 text-sm text-slate-700">Selected: <strong>{file.name}</strong></div>}
        </div>
      </label>

      <div className="mt-4 flex gap-3">
        <button onClick={submit} className="rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow" disabled={loading}>{loading ? 'Uploading…' : 'Upload Resume'}</button>
        <button onClick={() => { setFile(null); inputRef.current && (inputRef.current.value = '') }} className="rounded-full border px-4 py-2 text-sm">Clear</button>
      </div>
    </div>
  )
}
