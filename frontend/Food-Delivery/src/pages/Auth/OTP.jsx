// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import api from "../../utils/axios.client";
// import { toast } from "react-toastify";
// import "./OTP.css";
// import React from "react";

// export default function VerifySignupOtp() {

//   const [otp, setOtp] = useState("");

//   const location = useLocation();
//   const navigate = useNavigate();

//   const email = location.state?.email;

//   const handleVerify = async () => {
//     try {

//       if (!otp) {
//         toast.error("Please enter OTP");
//         return;
//       }

//       await api.post("/user/verify-signup-otp", {
//         email,
//         otp

//       });

//       toast.success("Email verified successfully");

//       navigate("/");

//     } catch (error) {

//       toast.error(

//   "OTP verification failed"
// );
//     }
//   };

//   return (

//     <div className="verify-container">

//       <div className="verify-card">

//         {/* Header */}
//         <div className="verify-header">

//           <h2 className="verify-title">
//             Verify Your Account
//           </h2>

//           <p className="verify-subtitle">
//             Enter the OTP sent to
//           </p>

//           <p className="verify-email">
//             {email}
//           </p>

//         </div>

//         {/* OTP Input */}
//         <div className="verify-input-group">

//           <label className="verify-label">
//             OTP Code
//           </label>

//           <input
//             type="text"
//             maxLength={6}
//             placeholder="Enter 6-digit OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="verify-input"
//           />

//         </div>

//         {/* Button */}
//         <button
//           onClick={handleVerify}
//           className="verify-button"
//         >
//           Verify OTP
//         </button>

//         {/* Footer */}
//         <p className="verify-footer">
//           Didn’t receive OTP? Check spam folder
//         </p>

//       </div>

//     </div>
//   );
// }










import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/axios.client";
import { toast } from "react-toastify";
import "./OTP.css";
import React from "react";

export default function VerifySignupOtp() {
  const [otp, setOtp] = useState("");

  // Resend loading state
  const [resending, setResending] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Get email passed from Signup page
  const email = location.state?.email;

  // =====================================================
  // VERIFY OTP
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

      await api.post("/user/verify-signup-otp", {
        email,
        otp,
      });

      toast.success(
        "Email verified successfully"
      );

      navigate("/");

    } catch (error) {
      console.error(
        "OTP verification error:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    }
  };

  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResendOtp = async () => {
    try {
      // Make sure we have email
      if (!email) {
        toast.error("Email not found");
        return;
      }

      // Start loading
      setResending(true);

      // Call your backend API
      const response = await api.post(
        "/user/resend-otp",
        {
          email,
        }
      );

      console.log(
        "RESEND OTP RESPONSE:",
        response.data
      );

      toast.success(
        "New OTP sent to your email"
      );

      // Clear old OTP
      setOtp("");

    } catch (error) {
      console.error(
        "RESEND OTP ERROR:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to resend OTP"
      );

    } finally {
      // Stop loading
      setResending(false);
    }
  };

  return (
    <div className="verify-container">

      <div className="verify-card">

        {/* ================= HEADER ================= */}

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

        {/* ================= OTP INPUT ================= */}

        <div className="verify-input-group">

          <label className="verify-label">
            OTP Code
          </label>

          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              // Only allow numbers
              const value =
                e.target.value.replace(
                  /\D/g,
                  ""
                );

              setOtp(value);
            }}
            className="verify-input"
          />

        </div>

        {/* ================= VERIFY BUTTON ================= */}

        <button
          onClick={handleVerify}
          className="verify-button"
        >
          Verify OTP
        </button>

        {/* ================= RESEND ================= */}

       {/* ================= RESEND OTP ================= */}

<div className="flex flex-col items-center gap-2 mt-5">

  <p className="m-0 text-sm text-gray-500">
    Didn’t receive OTP?
  </p>

  <button
    type="button"
    onClick={handleResendOtp}
    disabled={resending}
    className="
      px-4
      py-2
      rounded-lg
      text-sm
      font-semibold
      text-orange-500
      bg-transparent
      transition-all
      duration-200
      hover:text-orange-600
      hover:bg-orange-50
      disabled:text-gray-400
      disabled:bg-transparent
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
