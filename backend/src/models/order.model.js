import mongoose from "mongoose";

export const orderItemSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  }
);
export const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:{
        type:[orderItemSchema],
        required:true
    },
    subTotal:{
        type:Number,
        required:true
    },
    deliveryFee:{
        type:Number,
        default:0
    },
    totalAmount:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        enum:["COD", "CARD", "ESEWA", "KHALTI"],
        required:true
    },
    paymentStatus:{
        type:String,
        enum:["pending", "paid", "failed"],
        default:"pending"

    },
    orderStatus:{
        type:String,
        enum:["placed", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
        default:"placed"
    },
    deliveryAddress: {
  firstName: {
     type: String, required: true 
    },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  zipcode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true }
}
}, { timestamps: true });
export const Order = new mongoose.model("Order", orderSchema);
