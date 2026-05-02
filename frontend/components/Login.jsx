import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        'http://localhost:5000/login',
        { username, password },
        { withCredentials: true }
      )
      if (res.data.message) {
        setIsAuthenticated(true)
        navigate('/admin')
      }
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-4 text-[#e6e6e6] font-sans">
      
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center gap-2 text-sm text-[#a3a3a3] hover:text-[#e6e6e6] transition-colors">
          <ArrowLeft size={16} />
          Back to Chat
        </Link>
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[#e6e6e6]">
            Welcome back
          </h2>
          <p className="text-sm text-[#a3a3a3] mt-2">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 bg-[#171717] p-8 rounded-2xl border border-[#2a2a2a] shadow-sm">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#a3a3a3] mb-1.5">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              autoFocus
              className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-[#e6e6e6] placeholder-[#666666] focus:outline-none focus:border-[#d97757] transition-colors"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#a3a3a3] mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm text-[#e6e6e6] placeholder-[#666666] focus:outline-none focus:border-[#d97757] transition-colors"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-[#e6e6e6] text-[#0f0f0f] hover:bg-[#ffffff] py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Sign in
          </button>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login
