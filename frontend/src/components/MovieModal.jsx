
// // src/components/MovieModal.jsx
// // ─────────────────────────────────────────────
// // Full-screen modal showing movie details + recommendations
// // - Prominent close button (top right)
// // - Close on backdrop click or Escape key
// // ─────────────────────────────────────────────
// import { useEffect, useState } from 'react'
// import { movieAPI, userAPI } from '../api/axios'
// import { useAuth } from '../context/AuthContext'

// export default function MovieModal({ movie, onClose, onMovieClick }) {
//   const { isLoggedIn } = useAuth()
//   const [recommendations, setRecommendations] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [isFavourite, setIsFavourite] = useState(false)
//   const [favMessage, setFavMessage] = useState('')

//   useEffect(() => {
//     if (!movie || !isLoggedIn) return
//     setLoading(true)
//     movieAPI.recommend(movie.title)
//       .then(res => setRecommendations(res.data))
//       .catch(() => setRecommendations([]))
//       .finally(() => setLoading(false))

//     userAPI.getFavourites()
//       .then(res => setIsFavourite(res.data.favourites.includes(movie.title)))
//       .catch(() => {})
//   }, [movie, isLoggedIn])

//   // Close on Escape key
//   useEffect(() => {
//     const handleKey = (e) => e.key === 'Escape' && onClose()
//     window.addEventListener('keydown', handleKey)
//     return () => window.removeEventListener('keydown', handleKey)
//   }, [onClose])

//   const toggleFavourite = async () => {
//     try {
//       if (isFavourite) {
//         await userAPI.removeFavourite(movie.title)
//         setIsFavourite(false)
//         setFavMessage('Removed from favourites')
//       } else {
//         await userAPI.addFavourite(movie.title)
//         setIsFavourite(true)
//         setFavMessage('Added to favourites!')
//       }
//       setTimeout(() => setFavMessage(''), 2000)
//     } catch {
//       setFavMessage('Please log in to save favourites')
//       setTimeout(() => setFavMessage(''), 2000)
//     }
//   }

//   if (!movie) return null

//   return (
//     <div
//       className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <div
//         className="bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* ── CLOSE BUTTON — prominent, always visible ── */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 z-20 bg-black hover:bg-netflix-red
//                      text-white rounded-full w-9 h-9 flex items-center justify-center
//                      transition-colors shadow-lg border border-white/20"
//           title="Close (Esc)"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
//               d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>

//         {/* ── Header banner ── */}
//         <div className="h-48 bg-gradient-to-br from-netflix-red/30 to-zinc-800 relative flex items-end p-6">
//           <div className="pr-10">
//             <h2 className="text-white text-3xl font-bold">{movie.title}</h2>
//             <div className="flex items-center gap-3 mt-1 text-sm text-netflix-gray flex-wrap">
//               <span className="text-green-400 font-semibold">{movie.rating}/10 ⭐</span>
//               <span>{movie.release_date?.slice(0, 4)}</span>
//               <span>{movie.runtime} min</span>
//               <span className="uppercase border border-netflix-gray px-1 text-xs">{movie.language}</span>
//             </div>
//           </div>
//         </div>

//         {/* ── Body ── */}
//         <div className="p-6 space-y-4">

//           {/* Action buttons */}
//           <div className="flex gap-3 items-center flex-wrap">
//             <button
//               onClick={toggleFavourite}
//               className={`flex items-center gap-2 px-4 py-2 rounded font-medium text-sm transition-colors ${
//                 isFavourite
//                   ? 'bg-netflix-red text-white'
//                   : 'bg-white/10 hover:bg-white/20 text-white'
//               }`}
//             >
//               <svg className="w-4 h-4" fill={isFavourite ? 'currentColor' : 'none'}
//                 stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                   d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//               </svg>
//               {isFavourite ? 'Saved' : 'Add to List'}
//             </button>
//             {favMessage && (
//               <span className="text-green-400 text-sm">{favMessage}</span>
//             )}
//           </div>

//           {/* Overview */}
//           <p className="text-netflix-light text-sm leading-relaxed">{movie.overview}</p>

//           {/* Details grid */}
//           <div className="grid grid-cols-2 gap-2 text-sm">
//             <div><span className="text-netflix-gray">Director: </span>
//               <span className="text-white">{movie.director}</span></div>
//             <div><span className="text-netflix-gray">Genres: </span>
//               <span className="text-white">{movie.genres}</span></div>
//             <div><span className="text-netflix-gray">Budget: </span>
//               <span className="text-white">${movie.budget?.toLocaleString()}</span></div>
//             <div><span className="text-netflix-gray">Revenue: </span>
//               <span className="text-white">${movie.revenue?.toLocaleString()}</span></div>
//             <div><span className="text-netflix-gray">Votes: </span>
//               <span className="text-white">{movie.vote_count?.toLocaleString()}</span></div>
//             <div><span className="text-netflix-gray">Popularity: </span>
//               <span className="text-white">{movie.popularity}</span></div>
//           </div>

//           {/* ── Recommendations ── */}
//           {isLoggedIn && (
//             <div>
//               <h3 className="text-white font-semibold text-lg mb-3 border-t border-white/10 pt-4">
//                 More Like This
//               </h3>
//               {loading ? (
//                 <div className="flex items-center gap-2">
//                   <div className="w-4 h-4 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
//                   <span className="text-netflix-gray text-sm">Loading recommendations...</span>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 gap-2">
//                   {recommendations.slice(0, 8).map((rec, i) => (
//                     <div
//                       key={i}
//                       onClick={() => onMovieClick({ title: rec.title })}
//                       className="flex items-center justify-between bg-white/5 hover:bg-white/10
//                                  rounded px-3 py-2 cursor-pointer transition-colors group/rec"
//                     >
//                       <span className="text-white text-sm group-hover/rec:text-netflix-red transition-colors">
//                         {i + 1}. {rec.title}
//                       </span>
//                       <span className="text-netflix-gray text-xs">
//                         {(rec.similarity_score * 100).toFixed(0)}% match
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {!isLoggedIn && (
//             <p className="text-netflix-gray text-sm border-t border-white/10 pt-4">
//               <a href="/login" className="text-netflix-red hover:underline">Sign in</a> to see recommendations
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }



// src/components/MovieModal.jsx
import { useEffect, useState } from 'react'
import { movieAPI, userAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function MovieModal({ movie, onClose, onMovieClick }) {
  const { isLoggedIn } = useAuth()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [isFavourite, setIsFavourite] = useState(false)
  const [favMessage, setFavMessage] = useState('')

  const hasPoster = movie?.poster_url && movie.poster_url !== ""

  useEffect(() => {
    if (!movie || !isLoggedIn) return
    setLoading(true)
    movieAPI.recommend(movie.title)
      .then(res => setRecommendations(res.data))
      .catch(() => setRecommendations([]))
      .finally(() => setLoading(false))

    userAPI.getFavourites()
      .then(res => setIsFavourite(res.data.favourites.includes(movie.title)))
      .catch(() => {})
  }, [movie, isLoggedIn])

  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const toggleFavourite = async () => {
    try {
      if (isFavourite) {
        await userAPI.removeFavourite(movie.title)
        setIsFavourite(false)
        setFavMessage('Removed from favourites')
      } else {
        await userAPI.addFavourite(movie.title)
        setIsFavourite(true)
        setFavMessage('Added to favourites!')
      }
      setTimeout(() => setFavMessage(''), 2000)
    } catch {
      setFavMessage('Please log in to save favourites')
      setTimeout(() => setFavMessage(''), 2000)
    }
  }

  if (!movie) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black hover:bg-netflix-red
                     text-white rounded-full w-9 h-9 flex items-center justify-center
                     transition-colors shadow-lg border border-white/20"
          title="Close (Esc)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ── Header — poster + title side by side ── */}
        <div className="flex gap-0 h-56 relative overflow-hidden rounded-t-lg">

          {/* Poster on the left */}
          <div className="flex-shrink-0 w-36">
            {hasPoster ? (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <span className="text-4xl">🎬</span>
              </div>
            )}
          </div>

          {/* Movie info on the right with gradient bg */}
          <div className="flex-1 bg-gradient-to-br from-zinc-800 to-zinc-900
                          flex items-end p-5 pr-12 relative">
            {/* Subtle gradient overlay from poster */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-white text-2xl font-bold leading-tight">{movie.title}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-400 flex-wrap">
                <span className="text-green-400 font-semibold">{movie.rating}/10 ⭐</span>
                <span>{movie.release_date?.slice(0, 4)}</span>
                <span>{movie.runtime} min</span>
                <span className="uppercase border border-gray-500 px-1 text-xs">{movie.language}</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">{movie.director}</p>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-6 space-y-4">

          {/* Action buttons */}
          <div className="flex gap-3 items-center flex-wrap">
            <button
              onClick={toggleFavourite}
              className={`flex items-center gap-2 px-4 py-2 rounded font-medium text-sm transition-colors ${
                isFavourite
                  ? 'bg-netflix-red text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <svg className="w-4 h-4" fill={isFavourite ? 'currentColor' : 'none'}
                stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isFavourite ? 'Saved' : 'Add to List'}
            </button>
            {favMessage && (
              <span className="text-green-400 text-sm">{favMessage}</span>
            )}
          </div>

          {/* Overview */}
          <p className="text-gray-300 text-sm leading-relaxed">{movie.overview}</p>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-500">Genres: </span>
              <span className="text-white">{movie.genres}</span></div>
            <div><span className="text-gray-500">Budget: </span>
              <span className="text-white">${movie.budget?.toLocaleString()}</span></div>
            <div><span className="text-gray-500">Revenue: </span>
              <span className="text-white">${movie.revenue?.toLocaleString()}</span></div>
            <div><span className="text-gray-500">Votes: </span>
              <span className="text-white">{movie.vote_count?.toLocaleString()}</span></div>
          </div>

          {/* ── Recommendations ── */}
          {isLoggedIn && (
            <div>
              <h3 className="text-white font-semibold text-lg mb-3 border-t border-white/10 pt-4">
                More Like This
              </h3>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-500 text-sm">Loading recommendations...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {recommendations.slice(0, 8).map((rec, i) => (
                    <div
                      key={i}
                      onClick={() => onMovieClick({ title: rec.title })}
                      className="flex items-center justify-between bg-white/5 hover:bg-white/10
                                 rounded px-3 py-2 cursor-pointer transition-colors group/rec"
                    >
                      <div className="flex items-center gap-3">
                        {/* Mini poster in recommendation list */}
                        {rec.poster_url ? (
                          <img src={rec.poster_url} alt={rec.title}
                            className="w-8 h-10 object-cover rounded flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-10 bg-zinc-700 rounded flex-shrink-0
                                          flex items-center justify-center text-xs">🎬</div>
                        )}
                        <span className="text-white text-sm group-hover/rec:text-netflix-red transition-colors">
                          {i + 1}. {rec.title}
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs flex-shrink-0">
                        {(rec.similarity_score * 100).toFixed(0)}% match
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isLoggedIn && (
            <p className="text-gray-500 text-sm border-t border-white/10 pt-4">
              <a href="/login" className="text-netflix-red hover:underline">Sign in</a> to see recommendations
            </p>
          )}
        </div>
      </div>
    </div>
  )
}