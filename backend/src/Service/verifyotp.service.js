import crypto from "crypto";
import { OTP } from "../models/otp.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/API/apiError.js";

export const verifyOtpService = async ({ email, otp, purpose }) => {
  // IMPORTANT
  otp = otp.trim();

  // hash incoming otp
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  console.log("HASHED INPUT OTP:", hashedOtp);

  // find otp
  const otpRecord = await OTP.findOne({
    email,
    otp: hashedOtp,
    purpose,
  });

  console.log("DB OTP RECORD:", otpRecord);

  if (!otpRecord) {
    throw new ApiError(400, "Invalid OTP");
  }

  // expiry check
  if (otpRecord.expiresAt < Date.now()) {
    await OTP.deleteOne({
      _id: otpRecord._id,
    });

    throw new ApiError(400, "OTP expired");
  }

  // cleanup
  await OTP.deleteMany({
    email,
    purpose,
  });

  let result = {};

  // signup verification
  if (purpose === "SIGNUP") {
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true },
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    result = {
      message: "User verified successfully",
      user: user._id,
      isVerified: user.isVerified,
    };
  }

  return result;
};
