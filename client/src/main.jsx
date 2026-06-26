import React from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import App from './App'
import './index.css'

// Use the local backend in development. In production, Netlify proxies /api to the backend.
axios.defaults.baseURL = import.meta.env.DEV ? 'http://localhost:5000' : (import.meta.env.VITE_API_BASE_URL || '')

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
