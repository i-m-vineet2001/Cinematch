// Redirect to login if not authenticated
// src/components/ProtectedRoute.jsx
// ─────────────────────────────────────────────
// Route guard — if user is not logged in, redirect to /login
//
// Usage in App.jsx:
//   <Route path="/profile" element={
//     <ProtectedRoute><Profile /></ProtectedRoute>
//   } />
// ─────────────────────────────────────────────
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()

  // If not logged in, send to login page
  // 'replace' replaces history so back button doesn't loop
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}