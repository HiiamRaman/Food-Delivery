import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import adminApi from "../../Api/axios.admin";
import "./Login.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const response = await adminApi.post("/user/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const token = response.data?.data?.accessToken;
      const user = response.data?.data?.user;

      if (!token || !user) {
        toast.error("Invalid login response");
        return;
      }

      // Only admin users can access admin panel
      if (user.role !== "admin") {
        toast.error("Admin access only");
        return;
      }

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));

      toast.success("Welcome back");

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);

      toast.error(
        error.response?.data?.data ||
          error.response?.data?.message ||
          "Unable to login",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Brand */}

        <div className="admin-login-brand">
          <div className="admin-brand-icon">
            <ShieldCheck size={22} />
          </div>

          <span className="admin-brand-text">
            Raman<span>.</span>
          </span>
        </div>

        {/* Heading */}

        <div className="admin-login-header">
          <span className="admin-login-label">ADMIN PORTAL</span>

          <h1>Welcome back</h1>

          <p>
            Sign in with your administrator account to manage products, orders
            and users.
          </p>
        </div>

        {/* Form */}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {/* Email */}

          <div className="admin-login-field">
            <label htmlFor="email">Email address</label>

            <div className="admin-input-wrapper">
              <Mail size={17} className="admin-input-icon" />

              <input
                id="email"
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}

          <div className="admin-login-field">
            <label htmlFor="password">Password</label>

            <div className="admin-input-wrapper">
              <LockKeyhole size={17} className="admin-input-icon" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                className="admin-password-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Submit */}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in to Admin"}
          </button>
        </form>

        {/* Security */}

        <div className="admin-security-message">
          <LockKeyhole size={13} />

          <span>Authorized administrators only</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
