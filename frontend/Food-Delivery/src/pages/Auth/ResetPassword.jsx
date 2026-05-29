import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/axios.client";
import { toast } from "react-toastify";
import PasswordInput from "../../components/Auth/PasswordInput";
import "./ResetPassword.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleResetPassword = async () => {
    if (!password) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/user/reset-password", {
        email,
        newPassword: password,
      });

      toast.success("Password reset successful");
      navigate("/");
    } catch (error) {
      toast.error(
    error.response?.data?.data || 
    error.response?.data?.message ||
    "Something went wrong"
  );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">

        <div className="reset-header">
          <h2 className="reset-title">Reset Password</h2>
          <p className="reset-subtitle">
            Enter your new password below
          </p>
        </div>

        {/* IMPORTANT WRAPPER */}
        <div className="reset-input-wrapper">
          <PasswordInput
            className="reset-input"
            name="newPassword"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="reset-btn"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </div>
    </div>
  );
}