import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/axios.client";
import { toast } from "react-toastify";
import "./OTP.css";
import React from "react";

export default function VerifySignupOtp() {

  const [otp, setOtp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async () => {
    try {

      if (!otp) {
        toast.error("Please enter OTP");
        return;
      }

      await api.post("/user/verify-signup-otp", {
        email,
        otp
       
      });

      toast.success("Email verified successfully");

      navigate("/");

    } catch (error) {

      toast.error(
  
  "OTP verification failed"
);
    }
  };

  return (

    <div className="verify-container">

      <div className="verify-card">

        {/* Header */}
        <div className="verify-header">

          <h2 className="verify-title">
            Verify Your Account
          </h2>

          <p className="verify-subtitle">
            Enter the OTP sent to
          </p>

          <p className="verify-email">
            {email}
          </p>

        </div>

        {/* OTP Input */}
        <div className="verify-input-group">

          <label className="verify-label">
            OTP Code
          </label>

          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="verify-input"
          />

        </div>

        {/* Button */}
        <button
          onClick={handleVerify}
          className="verify-button"
        >
          Verify OTP
        </button>

        {/* Footer */}
        <p className="verify-footer">
          Didn’t receive OTP? Check spam folder
        </p>

      </div>

    </div>
  );
}