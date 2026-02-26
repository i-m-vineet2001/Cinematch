// Netflix-style login page

// src/pages/Login.jsx
// ─────────────────────────────────────────────
// Netflix-style login page
// - Full screen dark background
// - Centered card with red branding
// - Shows error message on bad credentials
// ─────────────────────────────────────────────
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      navigate('/')  // Redirect to home on success
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center relative">

      {/* Background subtle pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.08),_transparent_60%)]" />

      <div className="relative z-10 w-full max-w-sm">

        {/* Logo */}
        <h1 className="text-netflix-red text-4xl font-bold tracking-widest text-center mb-10">
          CINEMATCH
        </h1>

        {/* Card */}
        <div className="bg-black/75 rounded-lg px-10 py-12 border border-white/5">
          <h2 className="text-white text-2xl font-semibold mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
                className="w-full bg-zinc-700 text-white rounded px-4 py-4 text-sm
                           outline-none focus:ring-1 focus:ring-white/50
                           placeholder-zinc-400 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full bg-zinc-700 text-white rounded px-4 py-4 text-sm
                           outline-none focus:ring-1 focus:ring-white/50
                           placeholder-zinc-400 transition-all"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-netflix-red/10 border border-netflix-red/30 rounded px-3 py-2">
                <p className="text-netflix-red text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-netflix-red hover:bg-netflix-darkred text-white font-semibold
                         py-4 rounded text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Signup link */}
          <p className="text-netflix-gray text-sm mt-6 text-center">
            New to CineMatch?{' '}
            <Link to="/signup" className="text-white hover:underline">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}