import React, { useState } from "react";
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
    <div className="min-h-screen bg-white text-slate-900">
      {showLogin && <Login setShowLogin={setShowLogin} />}

      <Navbar setShowLogin={setShowLogin} />

      <main className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/success" element={<Success />} />
          <Route path="/tracking/:id" element={<Tracking />} />

          <Route path="/otp-verify" element={<VerifySignupOtp />} />
          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="*"
            element={
              <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="text-center">
                  <h1 className="text-4xl font-bold">404</h1>
                  <p className="mt-2 text-slate-500">Page not found</p>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />

      <Footer />
    </div>
  );
}

export default App;
