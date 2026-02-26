// // Main browse page

// // src/pages/Home.jsx
// // ─────────────────────────────────────────────
// // Main browse page — Netflix home layout
// // - Hero banner with featured movie
// // - Genre rows (Action, Comedy, Sci-Fi, etc.)
// // - Clicking any card opens MovieModal
// // ─────────────────────────────────────────────
// import { useState, useEffect } from 'react'
// import { movieAPI } from '../api/axios'
// import { useAuth } from '../context/AuthContext'
// import MovieRow from '../components/MovieRow'
// import MovieModal from '../components/MovieModal'
// import Navbar from '../components/Navbar'

// // Genres to show as rows — matches your dataset
// const GENRES = ['Action', 'Comedy', 'Drama', 'Science Fiction', 'Thriller', 'Romance', 'Horror', 'Animation']

// export default function Home() {
//   const { user, isLoggedIn } = useAuth()
//   const [genreMovies, setGenreMovies] = useState({})  // { Action: [...], Comedy: [...] }
//   const [featuredMovie, setFeaturedMovie] = useState(null)
//   const [selectedMovie, setSelectedMovie] = useState(null)  // Opens modal
//   const [loading, setLoading] = useState(true)

//   // ── Load all genre rows on mount ──
//   useEffect(() => {
//     const loadAll = async () => {
//       try {
//         // Fetch all genres in parallel for speed
//         const results = await Promise.all(
//           GENRES.map(genre =>
//             movieAPI.byGenre(genre)
//               .then(res => ({ genre, movies: res.data }))
//               .catch(() => ({ genre, movies: [] }))
//           )
//         )

//         const movieMap = {}
//         results.forEach(({ genre, movies }) => {
//           if (movies.length > 0) movieMap[genre] = movies
//         })
//         setGenreMovies(movieMap)

//         // Pick a random popular movie as the hero banner
//         const allMovies = results.flatMap(r => r.movies)
//         if (allMovies.length > 0) {
//           const topMovies = allMovies.filter(m => m.rating >= 7.5)
//           setFeaturedMovie(topMovies[Math.floor(Math.random() * topMovies.length)])
//         }
//       } finally {
//         setLoading(false)
//       }
//     }
//     loadAll()
//   }, [])

//   // When user clicks a recommendation inside the modal, open that movie
//   const handleMovieClick = async (movie) => {
//     if (movie.overview) {
//       setSelectedMovie(movie)
//     } else {
//       // Recommendation cards only have title — fetch full details
//       try {
//         const res = await movieAPI.details(movie.title)
//         setSelectedMovie(res.data)
//       } catch {
//         setSelectedMovie(movie)
//       }
//     }
//   }

//   return (
//     <div className="min-h-screen bg-netflix-black">
//       <Navbar />

//       {/* ── Hero Banner ── */}
//       {featuredMovie && (
//         <div className="relative h-[70vh] flex items-end pb-16 px-8
//                         bg-gradient-to-br from-netflix-red/20 via-zinc-900 to-netflix-black">
//           {/* Gradient overlay at bottom */}
//           <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />

//           <div className="relative z-10 max-w-xl">
//             <h1 className="text-white text-5xl font-bold mb-3 leading-tight">
//               {featuredMovie.title}
//             </h1>
//             <p className="text-netflix-light text-sm mb-6 line-clamp-3 leading-relaxed">
//               {featuredMovie.overview}
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => handleMovieClick(featuredMovie)}
//                 className="flex items-center gap-2 bg-white text-black font-bold
//                            px-6 py-3 rounded hover:bg-white/80 transition-colors text-sm"
//               >
//                 {/* Play icon */}
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
//                 </svg>
//                 View Details
//               </button>
//               <button
//                 onClick={() => handleMovieClick(featuredMovie)}
//                 className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white
//                            font-semibold px-6 py-3 rounded transition-colors text-sm"
//               >
//                 More Info
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── Welcome message ── */}
//       <div className="px-8 py-4">
//         {isLoggedIn ? (
//           <p className="text-netflix-gray text-sm">
//             Welcome back, <span className="text-white font-semibold">{user}</span> 👋
//           </p>
//         ) : (
//           <p className="text-netflix-gray text-sm">
//             <a href="/login" className="text-netflix-red hover:underline">Sign in</a> to get personalised recommendations
//           </p>
//         )}
//       </div>

//       {/* ── Genre Rows ── */}
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
//         </div>
//       ) : (
//         <div className="pb-16">
//           {GENRES.map(genre => (
//             genreMovies[genre] && (
//               <MovieRow
//                 key={genre}
//                 title={genre}
//                 movies={genreMovies[genre]}
//                 onMovieClick={handleMovieClick}
//               />
//             )
//           ))}
//         </div>
//       )}

//       {/* ── Movie Modal ── */}
//       {selectedMovie && (
//         <MovieModal
//           movie={selectedMovie}
//           onClose={() => setSelectedMovie(null)}
//           onMovieClick={handleMovieClick}
//         />
//       )}
//     </div>
//   )
// }



// src/pages/Home.jsx
// ─────────────────────────────────────────────
// Main browse page — Netflix home layout
// - Hero banner with featured movie
// - Genre rows (Action, Comedy, Sci-Fi, etc.)
// - Clicking any card opens MovieModal
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react'
import { movieAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import MovieRow from '../components/MovieRow'
import MovieModal from '../components/MovieModal'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Genres to show as rows — matches your dataset
const GENRES = ['Action', 'Comedy', 'Drama', 'Science Fiction', 'Thriller', 'Romance', 'Horror', 'Animation']

export default function Home() {
  const { user, isLoggedIn } = useAuth()
  const [genreMovies, setGenreMovies] = useState({})  // { Action: [...], Comedy: [...] }
  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)  // Opens modal
  const [loading, setLoading] = useState(true)

  // ── Load all genre rows on mount ──
  useEffect(() => {
    const loadAll = async () => {
      try {
        // Fetch all genres in parallel for speed
        const results = await Promise.all(
          GENRES.map(genre =>
            movieAPI.byGenre(genre)
              .then(res => ({ genre, movies: res.data }))
              .catch(() => ({ genre, movies: [] }))
          )
        )

        const movieMap = {}
        results.forEach(({ genre, movies }) => {
          if (movies.length > 0) movieMap[genre] = movies
        })
        setGenreMovies(movieMap)

        // Pick a random popular movie as the hero banner
        const allMovies = results.flatMap(r => r.movies)
        if (allMovies.length > 0) {
          const topMovies = allMovies.filter(m => m.rating >= 7.5)
          setFeaturedMovie(topMovies[Math.floor(Math.random() * topMovies.length)])
        }
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  // When user clicks a recommendation inside the modal, open that movie
  const handleMovieClick = async (movie) => {
    if (movie.overview) {
      setSelectedMovie(movie)
    } else {
      // Recommendation cards only have title — fetch full details
      try {
        const res = await movieAPI.details(movie.title)
        setSelectedMovie(res.data)
      } catch {
        setSelectedMovie(movie)
      }
    }
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />

      {/* ── Hero Banner ── */}
      {featuredMovie && (
        <div className="relative h-[70vh] flex items-end pb-16 px-8
                        bg-gradient-to-br from-netflix-red/20 via-zinc-900 to-netflix-black">
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />

          <div className="relative z-10 max-w-xl">
            <h1 className="text-white text-5xl font-bold mb-3 leading-tight">
              {featuredMovie.title}
            </h1>
            <p className="text-netflix-light text-sm mb-6 line-clamp-3 leading-relaxed">
              {featuredMovie.overview}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleMovieClick(featuredMovie)}
                className="flex items-center gap-2 bg-white text-black font-bold
                           px-6 py-3 rounded hover:bg-white/80 transition-colors text-sm"
              >
                {/* Play icon */}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                View Details
              </button>
              <button
                onClick={() => handleMovieClick(featuredMovie)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white
                           font-semibold px-6 py-3 rounded transition-colors text-sm"
              >
                More Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Welcome message ── */}
      <div className="px-8 py-4">
        {isLoggedIn ? (
          <p className="text-netflix-gray text-sm">
            Welcome back, <span className="text-white font-semibold">{user}</span> 👋
          </p>
        ) : (
          <p className="text-netflix-gray text-sm">
            <a href="/login" className="text-netflix-red hover:underline">Sign in</a> to get personalised recommendations
          </p>
        )}
      </div>

      {/* ── Genre Rows ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="pb-16">
          {GENRES.map(genre => (
            genreMovies[genre] && (
              <MovieRow
                key={genre}
                title={genre}
                movies={genreMovies[genre]}
                onMovieClick={handleMovieClick}
              />
            )
          ))}
        </div>
      )}

      {/* ── Movie Modal ── */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onMovieClick={handleMovieClick}
        />
      )}

      <Footer />
    </div>
  )
}