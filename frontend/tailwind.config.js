// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Netflix palette
        netflix: {
          red: "#E50914",
          darkred: "#B20710",
          black: "#141414",
          dark: "#1a1a1a",
          gray: "#808080",
          light: "#e5e5e5",
        },
      },
      fontFamily: {
        netflix: [
          "Netflix Sans",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      backgroundImage: {
        // Subtle gradient used on hero sections
        "hero-gradient":
          "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(20,20,20,1) 100%)",
      },
    },
  },
  plugins: [],
};
