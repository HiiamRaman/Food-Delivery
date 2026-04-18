import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Login from "./components/Login/Login.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Success from "./pages/Success/Success.jsx";
import Map from "./socket/Map.jsx";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {/* Login Modal */}
      {showLogin && <Login setShowLogin={setShowLogin} />}

      <div className="app">
        <Navbar setShowLogin={setShowLogin} />

        {/* App Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/success" element={<Success />} />
          {/* <Route path="/success" element={<Success />}/> */}

          {/* Optional fallback route to handle undefined paths */}
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={3000} />

        <Footer />
        <Map/>
      </div>
    </>
  );
}

export default App;
