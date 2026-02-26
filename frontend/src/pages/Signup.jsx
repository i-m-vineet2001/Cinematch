// Signup page
// src/pages/Signup.jsx
// ─────────────────────────────────────────────
// Signup page — same style as login
// Auto-logs in after successful signup
// ─────────────────────────────────────────────
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername]   = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await signup(username, password)
      navigate('/')  // Auto-login and redirect home
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Try a different username.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.08),_transparent_60%)]" />

      <div className="relative z-10 w-full max-w-sm">

        <h1 className="text-netflix-red text-4xl font-bold tracking-widest text-center mb-10">
          CINEMATCH
        </h1>

        <div className="bg-black/75 rounded-lg px-10 py-12 border border-white/5">
          <h2 className="text-white text-2xl font-semibold mb-2">Create Account</h2>
          <p className="text-netflix-gray text-sm mb-6">Start discovering movies you'll love.</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
              className="w-full bg-zinc-700 text-white rounded px-4 py-4 text-sm
                         outline-none focus:ring-1 focus:ring-white/50 placeholder-zinc-400"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
              className="w-full bg-zinc-700 text-white rounded px-4 py-4 text-sm
                         outline-none focus:ring-1 focus:ring-white/50 placeholder-zinc-400"
            />

            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Confirm password"
              className="w-full bg-zinc-700 text-white rounded px-4 py-4 text-sm
                         outline-none focus:ring-1 focus:ring-white/50 placeholder-zinc-400"
            />

            {error && (
              <div className="bg-netflix-red/10 border border-netflix-red/30 rounded px-3 py-2">
                <p className="text-netflix-red text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-netflix-red hover:bg-netflix-darkred text-white font-semibold
                         py-4 rounded text-sm transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-netflix-gray text-sm mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}