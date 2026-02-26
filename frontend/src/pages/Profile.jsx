// // Favourites + history;

// // src/pages/Profile.jsx
// // ─────────────────────────────────────────────
// // User profile page
// // - Stats: username, total favourites, total searches
// // - Favourites list with remove button
// // - Recommendation history with clear button
// // ─────────────────────────────────────────────
// import { useState, useEffect } from 'react'
// import { userAPI, movieAPI } from '../api/axios'
// import { useAuth } from '../context/AuthContext'
// import MovieModal from '../components/MovieModal'
// import Navbar from '../components/Navbar'

// export default function Profile() {
//   const { user } = useAuth()
//   const [profile, setProfile]       = useState(null)
//   const [favourites, setFavourites] = useState([])
//   const [history, setHistory]       = useState([])
//   const [selectedMovie, setSelectedMovie] = useState(null)
//   const [activeTab, setActiveTab]   = useState('favourites')  // 'favourites' | 'history'
//   const [loading, setLoading]       = useState(true)

//   // ── Load profile data ──
//   useEffect(() => {
//     Promise.all([
//       userAPI.profile(),
//       userAPI.getFavourites(),
//       userAPI.getHistory()
//     ]).then(([profileRes, favRes, histRes]) => {
//       setProfile(profileRes.data)
//       setFavourites(favRes.data.favourites)
//       setHistory(histRes.data.history)
//     }).finally(() => setLoading(false))
//   }, [])

//   const removeFavourite = async (title) => {
//     await userAPI.removeFavourite(title)
//     setFavourites(prev => prev.filter(f => f !== title))
//   }

//   const clearHistory = async () => {
//     await userAPI.clearHistory()
//     setHistory([])
//   }

//   const openMovie = async (title) => {
//     try {
//       const res = await movieAPI.details(title)
//       setSelectedMovie(res.data)
//     } catch {
//       setSelectedMovie({ title })
//     }
//   }

//   const handleMovieClick = async (movie) => {
//     try {
//       const res = await movieAPI.details(movie.title)
//       setSelectedMovie(res.data)
//     } catch {
//       setSelectedMovie(movie)
//     }
//   }

//   if (loading) return (
//     <div className="min-h-screen bg-netflix-black flex items-center justify-center">
//       <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-netflix-black">
//       <Navbar />

//       <div className="pt-24 px-8 pb-16 max-w-4xl mx-auto">

//         {/* ── Profile header ── */}
//         <div className="flex items-center gap-5 mb-10">
//           <div className="w-20 h-20 rounded-lg bg-netflix-red flex items-center justify-center text-white text-3xl font-bold">
//             {user?.charAt(0).toUpperCase()}
//           </div>
//           <div>
//             <h1 className="text-white text-2xl font-semibold">{user}</h1>
//             <p className="text-netflix-gray text-sm">Member since {profile?.created_at?.slice(0, 10)}</p>
//             <div className="flex gap-4 mt-2 text-sm">
//               <span className="text-white">{favourites.length} <span className="text-netflix-gray">Saved</span></span>
//               <span className="text-white">{history.length} <span className="text-netflix-gray">Searches</span></span>
//             </div>
//           </div>
//         </div>

//         {/* ── Tabs ── */}
//         <div className="flex border-b border-white/10 mb-6">
//           {['favourites', 'history'].map(tab => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
//                 activeTab === tab
//                   ? 'text-white border-b-2 border-netflix-red'
//                   : 'text-netflix-gray hover:text-white'
//               }`}
//             >
//               {tab === 'favourites' ? '❤️ My List' : '🕐 History'}
//             </button>
//           ))}
//         </div>

//         {/* ── Favourites tab ── */}
//         {activeTab === 'favourites' && (
//           <div>
//             {favourites.length === 0 ? (
//               <p className="text-netflix-gray text-center py-12">
//                 No saved movies yet. Click the heart on any movie to save it!
//               </p>
//             ) : (
//               <div className="space-y-2">
//                 {favourites.map((title, i) => (
//                   <div key={i}
//                     className="flex items-center justify-between bg-white/5 hover:bg-white/10
//                                rounded-lg px-4 py-3 group transition-colors">
//                     <button
//                       onClick={() => openMovie(title)}
//                       className="text-white text-sm font-medium hover:text-netflix-red transition-colors text-left"
//                     >
//                       {title}
//                     </button>
//                     <button
//                       onClick={() => removeFavourite(title)}
//                       className="text-netflix-gray hover:text-netflix-red transition-colors
//                                  opacity-0 group-hover:opacity-100 text-xs"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── History tab ── */}
//         {activeTab === 'history' && (
//           <div>
//             <div className="flex justify-between items-center mb-4">
//               <p className="text-netflix-gray text-sm">{history.length} searches</p>
//               {history.length > 0 && (
//                 <button
//                   onClick={clearHistory}
//                   className="text-netflix-red hover:text-netflix-darkred text-sm transition-colors"
//                 >
//                   Clear All
//                 </button>
//               )}
//             </div>

//             {history.length === 0 ? (
//               <p className="text-netflix-gray text-center py-12">
//                 No search history yet. Start exploring movies!
//               </p>
//             ) : (
//               <div className="space-y-4">
//                 {[...history].reverse().map((entry, i) => (
//                   <div key={i} className="bg-white/5 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <button
//                         onClick={() => openMovie(entry.searched_movie)}
//                         className="text-white font-medium hover:text-netflix-red transition-colors"
//                       >
//                         {entry.searched_movie}
//                       </button>
//                       <span className="text-netflix-gray text-xs">
//                         {new Date(entry.timestamp).toLocaleDateString()}
//                       </span>
//                     </div>
//                     <div className="flex flex-wrap gap-2">
//                       {entry.recommendations.slice(0, 5).map((rec, j) => (
//                         <button
//                           key={j}
//                           onClick={() => openMovie(rec)}
//                           className="text-xs bg-white/10 hover:bg-netflix-red/30 text-netflix-light
//                                      hover:text-white px-2 py-1 rounded transition-colors"
//                         >
//                           {rec}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
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


// src/pages/Profile.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAPI, movieAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import MovieModal from '../components/MovieModal'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile]       = useState(null)
  const [favourites, setFavourites] = useState([])
  const [history, setHistory]       = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [activeTab, setActiveTab]   = useState('favourites')
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      userAPI.profile(),
      userAPI.getFavourites(),
      userAPI.getHistory()
    ]).then(([profileRes, favRes, histRes]) => {
      setProfile(profileRes.data)
      setFavourites(favRes.data.favourites)
      setHistory(histRes.data.history)
    }).finally(() => setLoading(false))
  }, [])

  const removeFavourite = async (title) => {
    await userAPI.removeFavourite(title)
    setFavourites(prev => prev.filter(f => f !== title))
  }

  const clearHistory = async () => {
    await userAPI.clearHistory()
    setHistory([])
  }

  const openMovie = async (title) => {
    try {
      const res = await movieAPI.details(title)
      setSelectedMovie(res.data)
    } catch {
      setSelectedMovie({ title })
    }
  }

  const handleMovieClick = async (movie) => {
    try {
      const res = await movieAPI.details(movie.title)
      setSelectedMovie(res.data)
    } catch {
      setSelectedMovie(movie)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-netflix-black flex flex-col">
      <Navbar />

      <div className="flex-1 pt-24 px-8 pb-16 max-w-4xl mx-auto w-full">

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

        {/* ── Profile header ── */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-20 h-20 rounded-lg bg-netflix-red flex items-center justify-center text-white text-3xl font-bold">
            {user?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-white text-2xl font-semibold">{user}</h1>
            <p className="text-netflix-gray text-sm">Member since {profile?.created_at?.slice(0, 10)}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-white">{favourites.length} <span className="text-netflix-gray">Saved</span></span>
              <span className="text-white">{history.length} <span className="text-netflix-gray">Searches</span></span>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-white/10 mb-6">
          {['favourites', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-white border-b-2 border-netflix-red'
                  : 'text-netflix-gray hover:text-white'
              }`}
            >
              {tab === 'favourites' ? '❤️ My List' : '🕐 History'}
            </button>
          ))}
        </div>

        {/* ── Favourites tab ── */}
        {activeTab === 'favourites' && (
          <div>
            {favourites.length === 0 ? (
              <p className="text-netflix-gray text-center py-12">
                No saved movies yet. Click the heart on any movie to save it!
              </p>
            ) : (
              <div className="space-y-2">
                {favourites.map((title, i) => (
                  <div key={i}
                    className="flex items-center justify-between bg-white/5 hover:bg-white/10
                               rounded-lg px-4 py-3 group transition-colors">
                    <button
                      onClick={() => openMovie(title)}
                      className="text-white text-sm font-medium hover:text-netflix-red transition-colors text-left"
                    >
                      {title}
                    </button>
                    <button
                      onClick={() => removeFavourite(title)}
                      className="text-netflix-gray hover:text-netflix-red transition-colors
                                 opacity-0 group-hover:opacity-100 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── History tab ── */}
        {activeTab === 'history' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-netflix-gray text-sm">{history.length} searches</p>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-netflix-red hover:text-netflix-darkred text-sm transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-netflix-gray text-center py-12">
                No search history yet. Start exploring movies!
              </p>
            ) : (
              <div className="space-y-4">
                {[...history].reverse().map((entry, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => openMovie(entry.searched_movie)}
                        className="text-white font-medium hover:text-netflix-red transition-colors"
                      >
                        {entry.searched_movie}
                      </button>
                      <span className="text-netflix-gray text-xs">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {entry.recommendations.slice(0, 5).map((rec, j) => (
                        <button
                          key={j}
                          onClick={() => openMovie(rec)}
                          className="text-xs bg-white/10 hover:bg-netflix-red/30 text-netflix-light
                                     hover:text-white px-2 py-1 rounded transition-colors"
                        >
                          {rec}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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