import React, { useContext, useState } from "react";
import "./Login.css";

import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { StoreContext } from "../../Context/StoreContext";
import api from "../../utils/axios.client";

function Login() {
  const navigate = useNavigate();
  const { setToken, loadCartData } = useContext(StoreContext);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const response = await api.post("/user/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const token = response.data?.data?.accessToken;
      const user = response.data?.data?.user;

      if (!token) {
        toast.error("Login failed: token missing");
        return;
      }

      if (!user) {
        toast.error("Login failed: user data missing");
        return;
      }

      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setToken(token);

      if (user.role === "admin") {
        toast.success("Redirecting to Admin Panel...");

        window.location.replace("http://localhost:5174");

        return;
      }

      await loadCartData(token);

      toast.success("Logged in successfully");

      navigate("/");
    } catch (error) {
      const message = error.response?.data?.data;

      toast.error(message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* ================= LEFT ================= */}

        <section className="login-info">
          <div className="animated-brand">
            <Sparkles className="brand-sparkle" size={17} />

            <span className="brand-text">
              Raman<span className="brand-dot">.</span>
            </span>
          </div>

          <div className="login-info-content">
            <p className="login-label">FRESH • FAST • DELICIOUS</p>

            <div className="hero-title-wrapper">
              <Sparkles className="hero-sparkle" size={20} />

              <h1 className="animated-heading">
                Good food.
                <br />
                Better moments.
              </h1>
            </div>

            <p className="login-description">
              Order your favorite meals and get them delivered fresh to your
              doorstep.
            </p>

            <div className="login-features">
              <div>
                <strong>Fast</strong>
                <span>Delivery</span>
              </div>

              <div>
                <strong>Fresh</strong>
                <span>Food</span>
              </div>

              <div>
                <strong>Easy</strong>
                <span>Ordering</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RIGHT ================= */}

        <section className="login-form-section">
          <form className="login-form" onSubmit={onSubmit}>
            <div className="login-heading">
              <span>WELCOME BACK</span>

              <h2>Log in</h2>

              <p>Enter your account details to continue.</p>
            </div>

            {/* Email */}

            <div className="login-field">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={onChangeHandler}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}

            <div className="login-field">
              <label htmlFor="password">Password</label>

              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={onChangeHandler}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>

            {/* Bottom Links */}

            <div className="login-bottom">
              <button
                type="button"
                className="forgot-password"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>

              <p className="signup-link">
                Don't have an account?{" "}
                <button type="button" onClick={() => navigate("/signup")}>
                  Create account
                </button>
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Login;
