// src/pages/Genre.jsx
// ─────────────────────────────────────────────
// Genre browse page
// Reads ?name=Action from URL, fetches all movies in that genre
// ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { movieAPI } from "../api/axios";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Genre() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const genre = searchParams.get("name") || "";

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!genre) return;
    setLoading(true);
    setError("");

    // Uses /movies/genre endpoint — proper genre filter, not title search
    movieAPI
      .byGenre(genre)
      .then((res) => setMovies(res.data))
      .catch(() => {
        setMovies([]);
        setError(`No movies found for genre "${genre}"`);
      })
      .finally(() => setLoading(false));
  }, [genre]);

  const handleMovieClick = async (movie) => {
    if (movie.overview) {
      setSelectedMovie(movie);
    } else {
      try {
        const res = await movieAPI.details(movie.title);
        setSelectedMovie(res.data);
      } catch {
        setSelectedMovie(movie);
      }
    }
  };

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
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
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
          <span className="text-sm">Back</span>
        </button>

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-netflix-gray text-sm mb-1">Genre</p>
          <h1 className="text-white text-3xl font-bold">{genre}</h1>
          {!loading && movies.length > 0 && (
            <p className="text-netflix-gray text-sm mt-1">
              {movies.length} movies
            </p>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-netflix-gray text-lg">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="text-netflix-red hover:underline text-sm mt-3"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* ── Movies grid ── */}
        {!loading && movies.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {movies.map((movie, i) => (
              <MovieCard
                key={`${movie.title}-${i}`}
                movie={movie}
                onClick={handleMovieClick}
              />
            ))}
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
  );
}
