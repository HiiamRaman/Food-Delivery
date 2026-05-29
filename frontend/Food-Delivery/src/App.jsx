import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Login from "./components/Login/Login.jsx";
import VerifySignupOtp from "./pages/Auth/OTP.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Success from "./pages/Success/Success.jsx";
import Tracking from "./pages/Tracking/tracking.jsx";
import VerifyResetOtp from "./pages/Auth/VerifyResetOTP.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import ChangePassword from "./pages/Auth/Changepassword.jsx";
import ForgotPassword from "./pages/Auth/forgotpassword.jsx";


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
          <Route path="/tracking/:id" element={<Tracking />} />
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/success" element={<Success />} />
          <Route path="/otp-verify" element={<VerifySignupOtp />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/Forgot-password" element={<ForgotPassword/>} />
          {/* Optional fallback route to handle undefined paths */}
          <Route path="*" element={<p>Page not found</p>} />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={3000} />

        <Footer />
      </div>
    </>
  );
}

export default App;
