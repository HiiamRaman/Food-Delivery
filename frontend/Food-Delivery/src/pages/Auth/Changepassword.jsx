import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../../utils/axios.client";
import PasswordInput from "./PasswordInput.jsx";

import "./Changepassword.css";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= INPUT CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const oldPassword = formData.oldPassword.trim();
    const newPassword = formData.newPassword.trim();
    const confirmPassword = formData.confirmPassword.trim();

    // Check empty fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    // Password length
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    // Old and new password should not be the same
    if (oldPassword === newPassword) {
      toast.error(
        "New password must be different from your current password",
      );
      return;
    }

    // Confirm password
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/user/change-password",
        {
          oldPassword,
          newPassword,
        },
      );

      toast.success(
        response.data?.message ||
          "Password changed successfully",
      );

      // Reset form
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Go back to profile
      navigate("/profile");
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);

      /*
        Your backend has previously returned errors like:

        {
          statusCode: 401,
          data: "invalid password",
          message: "something went wrong",
          success: false
        }

        So check data first, then message.
      */

      const errorMessage =
        error.response?.data?.data ||
        error.response?.data?.message ||
        error.message ||
        "Failed to change password";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-wrapper">
        {/* ================= BACK ================= */}

        <button
          type="button"
          className="change-password-back"
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft size={17} />

          Back to profile
        </button>

        <div className="change-password-layout">
          {/* ================= SECURITY INFO ================= */}

          <aside className="security-info-card">
            <div className="security-icon">
              <ShieldCheck size={28} />
            </div>

            <p className="security-label">
              ACCOUNT SECURITY
            </p>

            <h1>Protect your account.</h1>

            <p className="security-description">
              Use a strong password that you don't use
              on other websites.
            </p>

            <div className="security-tips">
              <div>
                <span>01</span>

                <p>Use at least 8 characters.</p>
              </div>

              <div>
                <span>02</span>

                <p>
                  Combine letters, numbers and symbols.
                </p>
              </div>

              <div>
                <span>03</span>

                <p>
                  Avoid using personal information.
                </p>
              </div>
            </div>
          </aside>

          {/* ================= FORM CARD ================= */}

          <section className="change-password-card">
            <div className="change-password-header">
              <div className="change-password-header-icon">
                <LockKeyhole size={20} />
              </div>

              <div>
                <h2>Change password</h2>

                <p>
                  Enter your current password and choose
                  a secure new one.
                </p>
              </div>
            </div>

            <form
              className="change-password-form"
              onSubmit={handleSubmit}
            >
              {/* Current Password */}

              <div className="change-password-field">
                <label htmlFor="oldPassword">
                  Current password
                </label>

                <PasswordInput
                  id="oldPassword"
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
              </div>

              <div className="change-password-divider" />

              {/* New Password */}

              <div className="change-password-field">
                <label htmlFor="newPassword">
                  New password
                </label>

                <PasswordInput
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Create new password"
                  autoComplete="new-password"
                />
              </div>

              {/* Confirm Password */}

              <div className="change-password-field">
                <label htmlFor="confirmPassword">
                  Confirm new password
                </label>

                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
              </div>

              {/* Submit */}

              <button
                type="submit"
                className="change-password-btn"
                disabled={loading}
              >
                {loading
                  ? "Updating password..."
                  : "Update password"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
