import mongoose from "mongoose";

/* ===========================
   Order Item (Snapshot Model)
   =========================== */
const orderItemSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
      index: true,
    },
    name: {
      // snapshot for analytics & safety
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      // price at order time
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
  },
  { _id: false },
);

/* ===========================
   Delivery Address Schema
   =========================== */
const addressSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/.+\@.+\..+/, "Invalid email address"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    zipcode: { type: String, required: true, trim: true },
    country: {
      type: String,
      required: true,
      default: "Nepal",
    },
  },
  { _id: false },
);

/* ===========================
   Main Order Schema
   =========================== */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    route: [
      {
        lat: Number,
        lng: Number,
        _id: false,
      },
    ],
    dispatchApproved: {
      type: Boolean,
      default: false,
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "Order must contain at least one item",
      },
    },

    pricing: {
      subTotal: {
        type: Number,
        required: true,
        min: 0,
      },
      deliveryFee: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    payment: {
      method: {
        type: String,
        enum: ["COD", "CARD", "ESEWA", "KHALTI"],
        required: true,
        immutable: true,
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
        index: true,
      },
      transactionId: {
        type: String, // Stripe paymentIntentId / Khalti ref
      },
    },

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
    assignedOrder:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
default:null,
    },
    riderAcceptted:{
      type:Boolean,
      default:false,
    },

    deliveryAddress: {
      type: addressSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/* ===========================
   Data Integrity Hooks
   =========================== */
// orderSchema.pre("validate", function (next) {
//   this.pricing.totalAmount =
//     this.pricing.subTotal + this.pricing.deliveryFee;
//   // next();
// });

/* ===========================
   Indexes (Performance)
   =========================== */
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "payment.status": 1 });
orderSchema.index({ orderStatus: 1 });

export const Order = mongoose.model("Order", orderSchema);
