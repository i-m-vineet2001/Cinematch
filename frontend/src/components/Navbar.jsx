// src/components/Navbar.jsx
// ─────────────────────────────────────────────
// Netflix-style top navigation bar
// - Transparent at top, solid black on scroll
// - Left: CineMatch logo
// - Right: Search, Profile, Logout
// ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // ── Scroll effect — navbar goes solid on scroll ──
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-netflix-black"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-8 py-4">
        {/* ── Logo ── */}
        <Link
          to="/"
          className="text-netflix-red font-bold text-3xl tracking-widest select-none"
        >
          CINEMATCH
        </Link>

        {/* ── Right side ── */}
        <div className="flex items-center gap-6">
          {/* Search bar — expands on click */}
          <form onSubmit={handleSearch} className="flex items-center">
            {showSearch && (
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setShowSearch(false)}
                placeholder="Search movies..."
                className="bg-black/80 border border-white/50 text-white px-3 py-1 text-sm rounded mr-2 outline-none w-48 focus:border-white transition-all"
              />
            )}
            <button
              type={showSearch ? "submit" : "button"}
              onClick={() => !showSearch && setShowSearch(true)}
              className="text-white hover:text-netflix-light transition-colors"
            >
              {/* Search icon (SVG) */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {isLoggedIn ? (
            <>
              {/* Profile link */}
              <Link
                to="/profile"
                className="text-white hover:text-netflix-light text-sm transition-colors flex items-center gap-1"
              >
                <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center font-bold text-sm">
                  {user?.charAt(0).toUpperCase()}
                </div>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-netflix-gray hover:text-white text-sm transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-netflix-red hover:bg-netflix-darkred text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
