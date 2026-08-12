import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import React from "react";
// Admin Panel - main.jsx or index.jsx (entry point)
const params = new URLSearchParams(window.location.search);
const tokenFromUrl = params.get("token");

if (tokenFromUrl) {
  localStorage.setItem("accessToken", tokenFromUrl);
  // Clean URL
  window.history.replaceState({}, document.title, window.location.pathname);
}
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
