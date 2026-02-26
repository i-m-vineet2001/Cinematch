// Global login state
// src/context/AuthContext.jsx
// ─────────────────────────────────────────────
// Global authentication state using React Context
//
// What is Context?
// Instead of passing user/token as props through every component,
// Context lets any component in the tree read auth state directly.
//
// Usage in any component:
//   const { user, login, logout, isLoggedIn } = useAuth()
// ─────────────────────────────────────────────
import { createContext, useContext, useState } from 'react'
import { authAPI } from '../api/axios'

// 1. Create the context object
const AuthContext = createContext(null)

// 2. Provider component — wraps the whole app in App.jsx
export function AuthProvider({ children }) {
  // Read saved user from localStorage on first load
  // This keeps the user logged in after a page refresh
  const [user, setUser] = useState(
    () => localStorage.getItem('cinematch_user') || null
  )

  const isLoggedIn = !!user  // true if user string exists

  // ── Login ──────────────────────────────────
  const login = async (username, password) => {
    // Call FastAPI /auth/login
    const res = await authAPI.login(username, password)
    const token = res.data.access_token

    // Save token + username to localStorage so they survive refresh
    localStorage.setItem('cinematch_token', token)
    localStorage.setItem('cinematch_user', username)
    setUser(username)
  }

  // ── Signup ─────────────────────────────────
  const signup = async (username, password) => {
    // Call FastAPI /auth/signup — then auto login
    await authAPI.signup(username, password)
    await login(username, password)
  }

  // ── Logout ─────────────────────────────────
  const logout = () => {
    localStorage.removeItem('cinematch_token')
    localStorage.removeItem('cinematch_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom hook — makes using context cleaner in components
export function useAuth() {
  return useContext(AuthContext)
}