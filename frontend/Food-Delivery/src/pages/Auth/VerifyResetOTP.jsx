import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/axios.client";
import { toast } from "react-toastify";
import "./OTP.css";


export default function VerifyResetOtp() {
  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  // =====================================================
  // VERIFY RESET OTP
  // =====================================================

  const handleVerify = async () => {
    try {
      if (!email) {
        toast.error("Email not found");
        return;
      }

      if (!otp) {
        toast.error("Please enter OTP");
        return;
      }

      await api.post("/user/verify-reset-otp", {
        email,
        otp,
      });

      toast.success("OTP verified successfully");

      navigate("/reset-password", {
        state: { email },
      });
    } catch (error) {
      console.error("VERIFY RESET OTP ERROR:", error.response?.data);

      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  // =====================================================
  // RESEND RESET OTP
  // =====================================================

  const handleResendOtp = async () => {
    try {
      if (!email) {
        toast.error("Email not found");
        return;
      }

      setResending(true);

      const response = await api.post("/user/resend-reset-otp", {
        email,
      });

      console.log("RESEND RESET OTP RESPONSE:", response.data);

      toast.success("New OTP sent to your email");

      // Clear previous OTP
      setOtp("");
    } catch (error) {
      console.error("RESEND RESET OTP ERROR:", error.response?.data);

      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        {/* ================= HEADER ================= */}

        <div className="verify-header">
          <h2 className="verify-title">Verify Reset OTP</h2>

          <p className="verify-subtitle">Enter the OTP sent to</p>

          <p className="verify-email">{email}</p>
        </div>

        {/* ================= OTP INPUT ================= */}

        <div className="verify-input-group">
          <label className="verify-label">OTP Code</label>

          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              // Only allow numbers
              const value = e.target.value.replace(/\D/g, "");

              setOtp(value);
            }}
            className="verify-input"
          />
        </div>

        {/* ================= VERIFY BUTTON ================= */}

        <button onClick={handleVerify} className="verify-button">
          Verify OTP
        </button>

        {/* ================= RESEND OTP ================= */}

        <div className="flex flex-col items-center gap-2 mt-5">
          <p className="m-0 text-sm text-gray-500">Didn’t receive OTP?</p>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            className="
              px-5
              py-2
              rounded-xl
              bg-orange-50
              text-orange-500
              text-sm
              font-semibold
              border
              border-orange-200
              transition-all
              duration-200
              hover:bg-orange-500
              hover:text-white
              hover:border-orange-500
              disabled:bg-gray-100
              disabled:text-gray-400
              disabled:border-gray-200
              disabled:cursor-not-allowed
            "
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
