import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 5 * 60 * 1000, //5min
    },
    purpose: {
      type: String,
      enum: ["SIGNUP", "RESET_PASSWORD", "CHANGE_PASSWORD"],
      required: true,
    },
  },
  { timestamps: true },
);

export const OTP = mongoose.model("OTP", otpSchema);
