// All API calls to FastAPI

// src/api/axios.js
// ─────────────────────────────────────────────
// Central API layer — all calls to FastAPI go through here
// Using axios interceptors to automatically attach JWT token
// ─────────────────────────────────────────────
import axios from 'axios'

// Base URL — in dev, Vite proxy forwards these to localhost:8000
const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' }
})

// ── Request Interceptor ───────────────────────
// Automatically adds "Authorization: Bearer <token>" to every request
// So we don't have to manually add it in every component
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cinematch_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response Interceptor ──────────────────────
// If backend returns 401 (token expired), auto logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cinematch_token')
      localStorage.removeItem('cinematch_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────
export const authAPI = {
  signup: (username, password) =>
    api.post('/auth/signup', { username, password }),

  login: (username, password) =>
    api.post('/auth/login', { username, password }),
}

// ── Movies ────────────────────────────────────
export const movieAPI = {
  home: () =>
    api.get('/movies/home'),

  search: (query) =>
    api.get(`/movies/search?q=${encodeURIComponent(query)}`),

  details: (title) =>
    api.get(`/movies/details?title=${encodeURIComponent(title)}`),

  recommend: (title, topN = 10) =>
    api.get(`/movies/recommend?title=${encodeURIComponent(title)}&top_n=${topN}`),

  byGenre: (genre) =>
    api.get(`/movies/genre?name=${encodeURIComponent(genre)}`),
}

// ── User ──────────────────────────────────────
export const userAPI = {
  profile: () =>
    api.get('/user/profile'),

  getFavourites: () =>
    api.get('/user/favourites'),

  addFavourite: (title) =>
    api.post('/user/favourites', { title }),

  removeFavourite: (title) =>
    api.delete('/user/favourites', { data: { title } }),

  getHistory: () =>
    api.get('/user/history'),

  clearHistory: () =>
    api.delete('/user/history'),
}

export default api