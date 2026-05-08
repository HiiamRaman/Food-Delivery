import { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add/Add";
import OrdersPage from "./pages/Order/Order";
import List from "./pages/List/List";
import { ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { connectSocket } from "./Api/axios.admin";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Step 1: Check if token came from customer app via URL
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      // Save it and clean the URL
      localStorage.setItem("accessToken", urlToken);
      window.history.replaceState({}, "", window.location.pathname); // 👈 removes ?token=... from URL
      connectSocket(urlToken); // ✅ connect socket
      return;
    }

    // Step 2: Already logged in (page refresh case)
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // No token = not logged in
      window.location.replace = "http://localhost:5173";
    } else {
      connectSocket(token); // ✅ connect socket
    }
  }, []);

  return (
    <>
      <div>
        <ToastContainer />
        <Navbar />
        <hr />
        <div className="app-content">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Navigate to="/add" />} />
            <Route path="/add" element={<Add />} />
            <Route path="admin/order" element={<OrdersPage />} />
            <Route path="/list" element={<List />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;