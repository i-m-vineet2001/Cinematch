// src/components/Footer.jsx
// ─────────────────────────────────────────────
// Full Netflix-style footer
// - CineMatch logo + tagline
// - 4 columns of links
// - Copyright bar at bottom
// ─────────────────────────────────────────────

const FOOTER_LINKS = [
  {
    heading: "Navigation",
    links: ["Home", "Search", "My List", "Profile"],
    paths: ["/", "/search", "/profile", "/profile"],
  },
  {
    heading: "Genres",
    links: ["Action", "Comedy", "Drama", "Thriller"],
    paths: [
      "/search?q=Action",
      "/search?q=Comedy",
      "/search?q=Drama",
      "/search?q=Thriller",
    ],
  },
  {
    heading: "About",
    links: ["How It Works", "Tech Stack", "GitHub", "Contact"],
    paths: ["#", "#", "#", "#"],
  },
  {
    heading: "Account",
    links: ["Sign In", "Sign Up", "My Favourites", "History"],
    paths: ["/login", "/signup", "/profile", "/profile"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-netflix-black border-t border-white/10 mt-16 px-8 pt-12 pb-6">
      <div className="max-w-6xl mx-auto">
        {/* ── Logo + tagline ── */}
        <div className="mb-8">
          <h2 className="text-netflix-red text-2xl font-bold tracking-widest">
            CINEMATCH
          </h2>
          <p className="text-netflix-gray text-sm mt-1">
            Discover movies you'll love — powered by AI recommendations.
          </p>
        </div>

        {/* ── Link columns ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-netflix-light text-sm font-semibold mb-3">
                {col.heading}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link, i) => (
                  <li key={link}>
                    <a
                      href={col.paths[i]}
                      className="text-netflix-gray text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div
          className="border-t border-white/10 pt-6 flex flex-col md:flex-row
                        items-center justify-between gap-3"
        >
          {/* Tech stack badges */}
          <div className="flex gap-2 flex-wrap">
            {["React", "FastAPI", "Python", "scikit-learn", "TailwindCSS"].map(
              (tech) => (
                <span
                  key={tech}
                  className="text-xs border border-white/10 text-netflix-gray
                           px-2 py-0.5 rounded"
                >
                  {tech}
                </span>
              ),
            )}
          </div>

          {/* Copyright */}
          <p className="text-netflix-gray text-xs">
            © {new Date().getFullYear()} CineMatch. Built by Vineet.
          </p>
        </div>
      </div>
    </footer>
  );
}
