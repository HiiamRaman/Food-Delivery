// pages/Settings/ChangePassword.jsx

import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/axios.client";
import PasswordInput from "../../components/Auth/PasswordInput";
import "./Changepassword.css";

export default function ChangePassword() {

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const {
      oldPassword,
      newPassword,
      confirmPassword,
    } = formData;

    if (
      !oldPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      await api.post("/user/change-password", {
        oldPassword,
        newPassword,
      });

      toast.success("Password changed successfully");

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to change password"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="change-password-container">

      <form
        className="change-password-card"
        onSubmit={handleSubmit}
      >

        <h2 className="change-password-title">
          Change Password
        </h2>

        <PasswordInput
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          placeholder="Current Password"
        />

        <PasswordInput
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="New Password"
        />

        <PasswordInput
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm New Password"
        />

        <button
          type="submit"
          className="change-password-btn"
          disabled={loading}
        >
          {loading
            ? "Updating..."
            : "Update Password"}
        </button>

      </form>

    </div>
  );
}