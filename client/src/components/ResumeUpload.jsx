import React, { useState, useRef } from 'react'
import axios from 'axios'

export default function ResumeUpload({ onResult, theme }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef()

  const isDark = theme === 'midnight'

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
        setError('')
      }
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile)
      setError('')
    }
  }

  const validateFile = (f) => {
    const ext = f.name.split('.').pop().toLowerCase()
    if (ext !== 'pdf' && ext !== 'txt') {
      setError('Only PDF or Text files are supported')
      return false
    }
    if (f.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB')
      return false
    }
    return true
  }

  const submit = async (e) => {
    e && e.preventDefault()
    if (!file) return setError('Please select a file to upload')
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('resume', file)
      const token = localStorage.getItem('token')
      const resp = await axios.post('/api/resume/upload', form, { 
        headers: { 
          Authorization: token ? `Bearer ${token}` : '' 
        } 
      })
      onResult(resp.data.resume)
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload and analysis failed. Check API configurations.')
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <div className="space-y-4">
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

      <label 
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition duration-300 ${
          dragActive
            ? (isDark ? 'border-violet-500 bg-violet-950/20' : 'border-indigo-600 bg-indigo-50/50')
            : (isDark 
                ? 'border-slate-800 bg-slate-900/20 hover:border-slate-700 hover:bg-slate-900/40' 
                : 'border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50')
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={inputRef} 
          type="file" 
          accept="application/pdf,.pdf,.txt" 
          onChange={handleFileChange} 
          className="sr-only" 
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl transition-transform duration-300 group-hover:scale-110 ${
            isDark ? 'bg-slate-800 text-violet-400' : 'bg-indigo-50 text-indigo-600'
          }`}>
            📄
          </div>
          <div>
            <span className="text-sm font-semibold">
              {file ? 'File selected!' : 'Drag & drop resume here, or '}
            </span>
            {!file && (
              <span className={`text-sm font-bold underline transition ${
                isDark ? 'text-violet-400 hover:text-violet-300' : 'text-indigo-600 hover:text-indigo-500'
              }`}>
                browse files
              </span>
            )}
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            PDF or Plain Text formats only (Max 2MB)
          </p>
          
          {file && (
            <div className={`mt-3 rounded-lg border px-3 py-1.5 text-xs font-semibold flex items-center gap-2 ${
              isDark ? 'border-slate-800 bg-slate-950/60 text-slate-300' : 'border-slate-200 bg-white text-slate-700'
            }`}>
              <span className="text-emerald-500">✓</span> {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>
      </label>

      <div className="flex gap-3">
        <button 
          onClick={submit} 
          disabled={loading || !file}
          className={`rounded-xl px-5 py-3 text-sm font-bold shadow-md transition hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 flex-1 ${
            loading || !file
              ? (isDark ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none')
              : (isDark 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white hover:shadow-violet-600/20' 
                  : 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:shadow-indigo-500/20')
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Analyzing Resume...</span>
            </>
          ) : (
            'Scan & Score Resume'
          )}
        </button>
        
        {file && (
          <button 
            onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = '' }} 
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              isDark 
                ? 'border-slate-800 hover:bg-slate-900 text-slate-300' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
