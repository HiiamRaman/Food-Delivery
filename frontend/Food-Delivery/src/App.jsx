import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Login from "./components/Login/Login.jsx";
import Signup from "./components/signup/Signup.jsx";
import VerifySignupOtp from "./pages/Auth/OTP.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Success from "./pages/Success/Success.jsx";
import Tracking from "./pages/Tracking/tracking.jsx";
import VerifyResetOtp from "./pages/Auth/VerifyResetOTP.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import ChangePassword from "./pages/Auth/Changepassword.jsx";
import ForgotPassword from './pages/Auth/ForgotPassword.jsx';
import FoodDisplay from "./components/FoodDisplay/FoodDisplay.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Favorites from "./pages/Favorites/Favorites.jsx";
import MyOrders from "./pages/MyOrder/MyOrders.jsx";
import Addresses from "./pages/Address/Address.jsx";
import FoodDetail from "./pages/Food-Details/FoodDetail.jsx";
function App() {
  const [showLogin, setShowLogin] = useState(false);

  // Controls whether the auth modal shows Login or Signup
  const [authMode, setAuthMode] = useState("login");

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ================= AUTH MODAL ================= */}

      {showLogin &&
        (authMode === "login" ? (
          <Login setShowLogin={setShowLogin} setAuthMode={setAuthMode} />
        ) : (
          <Signup setShowLogin={setShowLogin} setAuthMode={setAuthMode} />
        ))}

      {/* ================= NAVBAR ================= */}

      <Navbar setShowLogin={setShowLogin} setAuthMode={setAuthMode} />

      {/* ================= ROUTES ================= */}

      <main className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/addresses" element={<Addresses />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/food-display" element={<FoodDisplay />} />
           <Route path="/food/:id" element={<FoodDetail />} />
          <Route path="/order" element={<PlaceOrder />} />

          <Route path="/success" element={<Success />} />

          <Route path="/tracking/:id" element={<Tracking />} />

          {/* ================= AUTH ROUTES ================= */}

          <Route path="/otp-verify" element={<VerifySignupOtp />} />

          <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ================= 404 ================= */}

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

      {/* ================= TOAST ================= */}

      <ToastContainer position="top-right" autoClose={3000} />

      {/* ================= FOOTER ================= */}

      <Footer />
    </div>
  );
}

export default App;
