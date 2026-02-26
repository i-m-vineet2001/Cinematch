// src/components/MovieRow.jsx
// ─────────────────────────────────────────────
// Netflix-style horizontal scrollable movie row
// - Genre label on the left
// - "Explore All" navigates to /search?q=<genre>
// - Arrow buttons to scroll left/right
// ─────────────────────────────────────────────
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies, onMovieClick }) {
  const rowRef = useRef(null);
  const navigate = useNavigate();

  // Scroll the row left or right by 600px on arrow click
  const scroll = (direction) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({
        left: direction === "left" ? -600 : 600,
        behavior: "smooth",
      });
    }
  };

  // "Explore All" → goes to search page filtered by this genre
  const handleExploreAll = () => {
    navigate(`/genre?name=${encodeURIComponent(title)}`);
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-8 group/row">
      {/* ── Row title + Explore All ── */}
      <div className="flex items-center gap-3 px-8 mb-3">
        <h2 className="text-netflix-light font-semibold text-lg">{title}</h2>

        {/* Explore All — visible on row hover, clickable */}
        <button
          onClick={handleExploreAll}
          className="flex items-center gap-1 text-netflix-red text-sm
                     opacity-0 group-hover/row:opacity-100 transition-all
                     hover:text-white hover:gap-2"
        >
          Explore All
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* ── Scroll container ── */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/50
                     flex items-center justify-center opacity-0 group-hover/row:opacity-100
                     transition-opacity hover:bg-black/80"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* ── Movies list ── */}
        <div
          ref={rowRef}
          className="flex gap-2 overflow-x-auto hide-scrollbar px-8 pb-2"
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={`${movie.title}-${index}`}
              movie={movie}
              onClick={onMovieClick}
            />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/50
                     flex items-center justify-center opacity-0 group-hover/row:opacity-100
                     transition-opacity hover:bg-black/80"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
