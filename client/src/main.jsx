import React from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import App from './App'
import './index.css'

const productionApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://careersight-ai.onrender.com'

// Use the local backend in development, and the deployed Render backend in production unless overridden.
axios.defaults.baseURL = import.meta.env.DEV
  ? 'http://localhost:5000'
  : productionApiBaseUrl

if (import.meta.env.DEV === false && !import.meta.env.VITE_API_BASE_URL) {
  console.warn(`VITE_API_BASE_URL is not set, using ${productionApiBaseUrl} as the production API base URL.`)
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
