// React entry point
// src/main.jsx
// ─────────────────────────────────────────────
// React entry point — mounts the app into index.html's #root div
// ─────────────────────────────────────────────
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
