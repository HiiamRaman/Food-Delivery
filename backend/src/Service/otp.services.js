import crypto from "crypto";
import { OTP } from "../models/otp.model.js";
import { sendEmail } from "../utils/email.utils.js";
import { ApiError } from "../utils/API/apiError.js";
import { User } from "../models/user.model.js";
export const createOtpService = async ({
  email,
  otp,
  purpose,
  expiresInMinutes = 10,
}) => {
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  await OTP.deleteMany({ email, purpose });

  const saved = await OTP.create({
    email,
    otp: hashedOtp,
    purpose,
    expiresAt: Date.now() + expiresInMinutes * 60 * 1000,
  });

  return true;
};

export const deleteOtpService = async ({ email, purpose }) => {
  await OTP.deleteMany({ email, purpose });
  return true;
};

export const sendOtpService = async ({ email, purpose }) => {
  // 1. Generate a 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // 2. Hash OTP before storing it in database
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  // 3. Delete any previous OTP for this email + purpose
  await OTP.deleteMany({
    email,
    purpose,
  });

  // 4. Create expiry time
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // 5. Store hashed OTP
  await OTP.create({
    email,
    otp: hashedOtp,
    purpose,
    expiresAt,
  });

  // 6. Send ORIGINAL OTP to user's email
  await sendEmail({
    to: email,
    subject: "Your Signup OTP",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  });

  return {
    message: "OTP sent successfully",
  };
};


// services/otp.service.js
;

export const resendOtpService = async ({
  email,
  purpose,
  expiresInMinutes = 5,
}) => {
  // 1. Find the user
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 2. For signup, don't resend if already verified
  if (purpose === "SIGNUP" && user.isVerified) {
    throw new ApiError(400, "User is already verified");
  }

  // 3. Generate a NEW OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // 4. Hash the OTP before storing it
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // 5. Delete previous OTP
  await OTP.deleteMany({
    email,
    purpose,
  });

  // 6. Create expiration time
  const expiresAt = new Date(
    Date.now() + expiresInMinutes * 60 * 1000
  );

  // 7. Store the NEW hashed OTP
  await OTP.create({
    email,
    otp: hashedOtp,
    purpose,
    expiresAt,
  });

  // 8. Send NEW OTP to email
  await sendEmail({
    to: email,
    subject: "Your New Verification OTP",
    html: `
      <h2>Verify Your Account</h2>
      <p>Your new OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in ${expiresInMinutes} minutes.</p>
    `,
  });

  return {
    email,
    message: "OTP resent successfully",
  };
};
