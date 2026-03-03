// controllers/order.controller.js
import Stripe from "stripe";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

export const createOrder = asyncHandler(async (req, res) => {  try {
   
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized");
  
    /* ---------------- DELIVERY VALIDATION ---------------- */
  
    const deliveryAddress = req.body?.deliveryInfo;
  
    if (
      !deliveryAddress ||
      typeof deliveryAddress !== "object"
    ) {
      throw new ApiError(400, "Valid delivery info required");
    }
  
    /* ---------------- FETCH CART ---------------- */
  
    const cart = await Cart.findOne({ user: userId })
      .populate("item.food")
      .lean();
  
    if (!cart || !Array.isArray(cart.item) || cart.item.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }
  
    /* ---------------- FILTER VALID ITEMS ---------------- */
  
    const validItems = cart.item.filter(
      (ci) => ci?.food && ci.quantity > 0
    );
  
    if (validItems.length === 0) {
      throw new ApiError(400, "Cart has no purchasable items");
    }
  
    /* ---------------- ORDER ITEMS ---------------- */
  
    const orderItems = validItems.map((ci) => ({
      food: ci.food._id,
      name: ci.food.name,
      quantity: ci.quantity,
      price: Number(ci.food.price),
    }));
  
    /* ---------------- PRICING ---------------- */
  
    const subTotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  
    const deliveryFee = subTotal >= 500 ? 0 : 50;
    const totalAmount = subTotal + deliveryFee;
  
    if (totalAmount <= 0) {
      throw new ApiError(400, "Invalid pricing calculation");
    }
  
    /* ---------------- CREATE ORDER ---------------- */
  
    const order = await Order.create({
      user: userId,
      items: orderItems,
      pricing: { subTotal, deliveryFee, totalAmount },
      payment: { method: "CARD", status: "pending" },
      deliveryAddress,
    });
  
    /* ---------------- STRIPE LINE ITEMS ---------------- */
  
    const line_items = orderItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
  
    if (deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Delivery Fee" },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }
  
    /* ---------------- STRIPE SESSION ---------------- */
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
  
      success_url: `${FRONTEND_URL}/success?orderId=${order._id}`,
      cancel_url: `${FRONTEND_URL}/cart`,
  
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });
  
    if (!session?.url) {
      throw new ApiError(500, "Stripe session creation failed");
    }
  
    /* ---------------- RESPONSE ---------------- */
  
    res.status(200).json({
      statusCode: 200,
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
        orderId: order._id,
      },
      message: "Order + Stripe session created",
    });

  
} 
catch (error) 
{
  console.log("error",error)
  return res.status(500).json("error")  
}
  });