import { OTP } from "../models/otp.model.js";
import { sendEmail } from "../utils/email.utils.js";
import { createOtpService } from "../Service/otp.services.js";
import { ApiError } from "../utils/API/apiError.js";
import { ApiResponse } from "../utils/API/apiResponse.js";
import { asyncHandler } from "../utils/API/asyncHandler.js";
import { User } from "../models/user.model.js";
import { generateOTP } from "../utils/OTP/generateotp.utils.js";
import { verifyOtpService } from "../Service/verifyotp.service.js";
import { changePasswordService } from "../Service/password.service.js";


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

export const resetPassword = asyncHandler(async(req,res)=>{
  const {email,newPassword} = req.body;
  if(!email||!newPassword){
    throw new ApiError(400,"Both email and newPassword are required!!")
  }
  const user = await User.findOne({email})
  if(!user){
    throw new ApiError(404,"user not found!!")
  }
if (!user.resetPasswordVerified) {
    throw new ApiError(400, "OTP not verified");
  }
  user.password = newPassword;
   // reset flag after use
  user.resetPasswordVerified = false;
  user.resetPasswordVerifiedAt = null;
await user.save();

return res.status(200).json(new ApiResponse(200,{},"Password Reset successfull!!"))
})

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both password are required !!");
  }
  // optional validation
  if (newPassword.length < 7) {
    throw new ApiError(400, "New password must be at least 7 characters");
  }

  await changePasswordService({
    userId: req.user._id,
    oldPassword,
    newPassword,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed SuccessFully!!"));
});
