import mongoose from "mongoose";
export const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      enum: ["PERCENT", "FLAT"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    minCartValue: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
export const Coupon = mongoose.model("Coupon", couponSchema);
