import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    address: [
      {
        street: String,
        city: String,
        zip: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isActive:{
        type:Boolean,
        default:true
    }
  },
  { timestamps: true }
);
export const User = new mongoose.model("User", userSchema);
