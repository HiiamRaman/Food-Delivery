import crypto from "crypto";
import { OTP } from "../models/otp.model.js";

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
