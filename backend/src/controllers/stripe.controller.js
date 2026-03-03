import Stripe from "stripe";
import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async (req, res) => {
  try {
    console.log("🚀 Reached createStripeSession");

    // ✅ Check Stripe Key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY is missing!");
      return res.status(500).json({ message: "Stripe key missing" });
    }

    const userId = req.user?._id;
    if (!userId) {
      console.error("❌ JWT user not found!");
      return res.status(401).json({ message: "Unauthorized: No user" });
    }
    console.log("👤 User ID:", userId);

    const FRONTEND_URL = "http://localhost:5173";

    // =======================
    // 1️⃣ Get User Cart
    // =======================
    const cart = await Cart.findOne({ user: userId }).populate("item.food");
    console.log("🛒 User Cart:", cart);

    if (!cart || cart.item.length === 0) {
      console.log("❌ Cart is empty");
      return res.status(400).json({ message: "Cart is empty" });
    }

    // =======================
    // 2️⃣ Prepare Order Items
    // =======================
    const orderItems = cart.item
      .filter(ci => ci.food)
      .map(ci => ({
        food: ci.food._id,
        name: ci.food.name,
        quantity: ci.quantity,
        price: ci.food.price,
      }));

    console.log("📦 Order Items Snapshot:", orderItems);

    const subTotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFee = 50; // static delivery fee
    const totalAmount = subTotal + deliveryFee;
    console.log("💰 Pricing:", { subTotal, deliveryFee, totalAmount });

    // =======================
    // 3️⃣ Create Order in DB (Pending Payment)
    // =======================
    const newOrder = await Order.create({
      user: userId,
      items: orderItems,
      pricing: { subTotal, deliveryFee, totalAmount },
      payment: { method: "CARD", status: "pending" },
      deliveryAddress: req.body.deliveryAddress || {}, // frontend sends this
    });
    console.log("✅ New Order Created:", newOrder._id);

    // =======================
    // 4️⃣ Prepare Stripe Line Items
    // =======================
    const line_items = orderItems.map(i => ({
      price_data: {
        currency: "usd",
        product_data: { name: i.name },
        unit_amount: Math.round(i.price * 100), // cents
      },
      quantity: i.quantity,
    }));
    console.log("💳 Stripe Line Items:", line_items);

    // =======================
    // 5️⃣ Create Stripe Session
    // =======================
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${FRONTEND_URL}/success?orderId=${newOrder._id}`,
      cancel_url: `${FRONTEND_URL}/cart`,
      metadata: { orderId: newOrder._id.toString() },
    });
    console.log("🔗 Stripe Session URL:", session.url);

    // =======================
    // 6️⃣ Return session URL
    // =======================
    return res.status(200).json({
      statusCode: 200,
      success: true,
      data: { url: session.url },
      message: "Stripe session created",
    });
  } catch (error) {
    console.error("❌ Error in createStripeSession:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error: error,
    });
  }
};
