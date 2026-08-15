import React, { useState } from "react";
import "./Signup.css";

import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../utils/axios.client";

function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
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

    const signupData = {
      username: formData.username.trim(),
      fullname: formData.fullname.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    try {
      setLoading(true);

      await api.post("/user/register", signupData);

      toast.success("OTP sent to your email");

      navigate("/otp-verify", {
        state: {
          email: signupData.email,
        },
      });
    } catch (error) {
      console.error("SIGNUP ERROR:", error);

      toast.error(
        error.response?.data?.data ||
          "Unable to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-wrapper">
        {/* ================= LEFT SIDE ================= */}

        <section className="signup-info">
          {/* Brand */}

          <div className="signup-brand">
            <Sparkles
              className="signup-brand-sparkle"
              size={17}
            />

            <span className="signup-brand-text">
              Raman<span>.</span>
            </span>
          </div>

          {/* Main Content */}

          <div className="signup-info-content">
            <p className="signup-label">
              YOUR TABLE IS WAITING
            </p>

            <div className="signup-title-wrapper">
              <Sparkles
                className="signup-title-sparkle"
                size={20}
              />

              <h1 className="signup-title">
                Discover. Order.
                <br />
                Enjoy every bite.
              </h1>
            </div>

            <p className="signup-description">
              Join Raman and discover meals you love,
              track every order, and make every craving easier.
            </p>

            <div className="signup-features">
              <div>
                <strong>Explore</strong>
                <span>Local favorites</span>
              </div>

              <div>
                <strong>Track</strong>
                <span>Every order</span>
              </div>

              <div>
                <strong>Enjoy</strong>
                <span>Every bite</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= RIGHT SIDE ================= */}

        <section className="signup-form-section">
          <form
            className="signup-form"
            onSubmit={onSubmit}
          >
            {/* Heading */}

            <div className="signup-heading">
              <span>JOIN RAMAN</span>

              <h2>Create your account</h2>

              <p>
                A few details and you're ready to order.
              </p>
            </div>

            {/* Username */}

            <div className="signup-field">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={onChangeHandler}
                autoComplete="username"
                required
              />
            </div>

            {/* Full Name */}

            <div className="signup-field">
              <label htmlFor="fullname">
                Full name
              </label>

              <input
                id="fullname"
                name="fullname"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullname}
                onChange={onChangeHandler}
                autoComplete="name"
                required
              />
            </div>

            {/* Email */}

            <div className="signup-field">
              <label htmlFor="email">
                Email
              </label>

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

            <div className="signup-field">
              <label htmlFor="password">
                Password
              </label>

              <div className="signup-password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={onChangeHandler}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev,
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}

            <label className="signup-condition">
              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the Terms and Conditions
              </span>
            </label>

            {/* Submit */}

            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

            {/* Bottom */}

            <div className="signup-bottom">
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/login")
                  }
                >
                  Log in
                </button>
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Signup;
