// // Search results

// // src/pages/Search.jsx
// // ─────────────────────────────────────────────
// // Search results page
// // Reads ?q= from the URL, calls API, shows results as cards
// // ─────────────────────────────────────────────
// import { useState, useEffect } from 'react'
// import { useSearchParams } from 'react-router-dom'
// import { movieAPI } from '../api/axios'
// import MovieCard from '../components/MovieCard'
// import MovieModal from '../components/MovieModal'
// import Navbar from '../components/Navbar'

// export default function Search() {
//   // useSearchParams reads ?q= from the URL
//   const [searchParams] = useSearchParams()
//   const query = searchParams.get('q') || ''

//   const [results, setResults] = useState([])
//   const [selectedMovie, setSelectedMovie] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   // Re-run search whenever the URL query changes
//   useEffect(() => {
//     if (!query) return

//     setLoading(true)
//     setError('')

//     movieAPI.search(query)
//       .then(res => setResults(res.data))
//       .catch(() => {
//         setResults([])
//         setError(`No movies found for "${query}"`)
//       })
//       .finally(() => setLoading(false))
//   }, [query])

//   const handleMovieClick = async (movie) => {
//     if (movie.overview) {
//       setSelectedMovie(movie)
//     } else {
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

//       <div className="pt-24 px-8 pb-16">
//         {/* Header */}
//         <h2 className="text-netflix-gray text-sm mb-1">Results for</h2>
//         <h1 className="text-white text-2xl font-semibold mb-8">"{query}"</h1>

//         {/* Loading spinner */}
//         {loading && (
//           <div className="flex items-center justify-center py-20">
//             <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
//           </div>
//         )}

//         {/* Error */}
//         {error && !loading && (
//           <div className="text-center py-20">
//             <p className="text-netflix-gray text-lg">{error}</p>
//             <p className="text-netflix-gray text-sm mt-2">Try searching for something else</p>
//           </div>
//         )}

//         {/* Results grid */}
//         {!loading && results.length > 0 && (
//           <>
//             <p className="text-netflix-gray text-sm mb-4">{results.length} results found</p>
//             <div className="flex flex-wrap gap-4">
//               {results.map((movie, i) => (
//                 <MovieCard
//                   key={`${movie.title}-${i}`}
//                   movie={movie}
//                   onClick={handleMovieClick}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>

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



// src/pages/Search.jsx
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { movieAPI } from '../api/axios'
import MovieCard from '../components/MovieCard'
import MovieModal from '../components/MovieModal'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Search() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) return
    setLoading(true)
    setError('')
    movieAPI.search(query)
      .then(res => setResults(res.data))
      .catch(() => {
        setResults([])
        setError(`No movies found for "${query}"`)
      })
      .finally(() => setLoading(false))
  }, [query])

  const handleMovieClick = async (movie) => {
    if (movie.overview) {
      setSelectedMovie(movie)
    } else {
      try {
        const res = await movieAPI.details(movie.title)
        setSelectedMovie(res.data)
      } catch {
        setSelectedMovie(movie)
      }
    }
  }

  return (
    <div className="min-h-screen bg-netflix-black flex flex-col">
      <Navbar />

      <div className="flex-1 pt-24 px-8 pb-16">

        {/* ── Back button ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-netflix-gray hover:text-white
                     transition-colors mb-6 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back</span>
        </button>

        {/* Header */}
        <h2 className="text-netflix-gray text-sm mb-1">Results for</h2>
        <h1 className="text-white text-2xl font-semibold mb-8">"{query}"</h1>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-netflix-gray text-lg">{error}</p>
            <p className="text-netflix-gray text-sm mt-2">Try searching for something else</p>
          </div>
        )}

        {/* Results grid */}
        {!loading && results.length > 0 && (
          <>
            <p className="text-netflix-gray text-sm mb-4">{results.length} results found</p>
            <div className="flex flex-wrap gap-4">
              {results.map((movie, i) => (
                <MovieCard
                  key={`${movie.title}-${i}`}
                  movie={movie}
                  onClick={handleMovieClick}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onMovieClick={handleMovieClick}
        />
      )}
    </div>
  )
}