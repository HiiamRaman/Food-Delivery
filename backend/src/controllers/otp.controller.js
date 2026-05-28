import { OTP } from "../models/otp.model.js";
import { sendEmail } from "../utils/email.utils.js";
import { createOtpService } from "../Service/otp.services.js";
import { ApiError } from "../utils/API/apiError.js";
import { ApiResponse } from "../utils/API/apiResponse.js";
import { asyncHandler } from "../utils/API/asyncHandler.js";
import { User } from "../models/user.model.js";
import { generateOTP } from "../utils/OTP/generateotp.utils.js";
import { verifyOtpService } from "../Service/verifyotp.service.js";
// export const sendSignupOtp = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     throw new ApiError(400, "Email is required");
//   }

//   const otp = generateOTP();

//   console.log("Generated OTP:", otp);

//   // 1. STORE OTP FIRST (IMPORTANT)
//   await createOtpService({
//     email,
//     otp,
//     purpose: "SIGNUP",
//     expiresInMinutes: 5,
//   });

//   // 2. SEND EMAIL
//   await sendEmail({
//     to: email,
//     subject: "Verify Your Account - OTP",
//     html: `<h1>${otp}</h1>`,
//   });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "OTP sent successfully"));
// });

export const verifySignupOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new ApiError(400, "Email and Otp are required!!!");
  }
  await verifyOtpService({ email, otp, purpose: "SIGNUP" });
  const user = await User.findOneAndUpdate(
    { email },
    { isVerified: true },
    { new: true },
  );
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Account Verified SuccessFully"));
});

export const sendResetPasswordOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found!!");
  }
  const otp = generateOTP();
  await createOtpService({ email, otp, purpose: "RESET_PASSWORD" });

  await sendEmail({
    to: email,
    subject: "Reset Password OTP",
    html: `<h1>${otp}</h1>`,
  });
  return res.status(200).json(new ApiResponse(200, {}, "Reset OTP sent"));
});

export const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new ApiError(400, "Both email and otp are required!");
  }
  await verifyOtpService({
    email,
    otp,
    purpose: "RESET_PASSWORD",
  });
  return res.status(200).json(new ApiResponse(200,{},"OTP verified successfully"))
});
