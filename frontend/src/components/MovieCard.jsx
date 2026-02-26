// Individual movie card with hover

// src/components/MovieCard.jsx
// ─────────────────────────────────────────────
// Individual movie card — Netflix style
// - Dark card with gradient overlay
// - Hover: scales up, shows rating + genre
// - Click: opens MovieModal
// ─────────────────────────────────────────────

// Netflix uses real poster images from TMDB API.
// Since our dataset doesn't have poster URLs, we generate
// a styled placeholder with the movie title and a color
// derived from the title (so each card has a unique color).

function getTitleColor(title) {
  // Generate a consistent hue from the title string
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 40%, 25%)`
}

export default function MovieCard({ movie, onClick }) {
  const bgColor = getTitleColor(movie.title)

  return (
    <div
      onClick={() => onClick(movie)}
      className="relative flex-shrink-0 w-40 h-56 rounded-md overflow-hidden cursor-pointer
                 transform transition-all duration-300 hover:scale-110 hover:z-10
                 hover:shadow-2xl hover:shadow-black/80 group"
      style={{ backgroundColor: bgColor }}
    >
      {/* ── Gradient overlay (always visible) ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* ── Movie title ── */}
      <div className="absolute bottom-0 left-0 right-0 p-2">
        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
          {movie.title}
        </p>

        {/* ── Hover info — rating + genre ── */}
        <div className="max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-300">
          <div className="flex items-center gap-1 mt-1">
            {/* Star icon */}
            <svg className="w-3 h-3 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-yellow-400 text-xs">{movie.rating?.toFixed(1)}</span>
          </div>
          <p className="text-netflix-gray text-xs mt-0.5 truncate">
            {movie.genres?.split(' ').slice(0, 2).join(' · ')}
          </p>
        </div>
      </div>

      {/* ── "Add to favourites" button on hover ── */}
      <button
        onClick={(e) => {
          e.stopPropagation() // Don't open modal when clicking this
          if (onClick.onFavourite) onClick.onFavourite(movie.title)
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100
                   transition-opacity bg-black/60 rounded-full p-1"
        title="Add to favourites"
      >
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>
  )
}