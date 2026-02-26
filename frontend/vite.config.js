// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls to FastAPI backend so we don't get CORS issues in dev
    proxy: {
      "/auth": "http://localhost:8000",
      "/movies": "http://localhost:8000",
      "/user": "http://localhost:8000",
    },
  },
});
