import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'

import './App.css'
import ClaudeChat from './components/claude/ClaudeChat'
import Navbar from '../components/Navbar'
import AdminDashboard from '../components/AdminDashboard'
import Login from '../components/Login' // create a simple login component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
      return
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:5000/check-auth', {
        withCredentials: true
      })
      setIsAuthenticated(res.data.authenticated)
    } catch {
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  // Still checking auth
  if (isAuthenticated === null) {
    return (
      <div className="overflow-hidden min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClaudeChat isAuthenticated={isAuthenticated} />} />
        
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} theme={theme} />}
        />
        
        <Route
          path="/admin"
          element={
            isAuthenticated ? (
              <AdminDashboard theme={theme} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
