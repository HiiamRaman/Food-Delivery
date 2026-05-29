import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios.client";
import { toast } from "react-toastify";
import "./ForgotPassword.css";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {

      setLoading(true);

      await api.post("user/reset-signup-otp", {
        email
      });

      toast.success("OTP sent to your email");

      navigate("/verify-reset-otp", {
        state: { email }
      });

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to send OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">

      <div className="forgot-card">

        <h2>Forgot Password</h2>

        <p>Enter your email to receive OTP</p>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSendOtp}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

      </div>

    </div>
  );
}