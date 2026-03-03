import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook Error:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Update order as paid
    await Order.create({
      user: session.metadata.userId,
      items: [], // optional: snapshot from cart if you want
      pricing: {
        subTotal: 0,
        deliveryFee: 0,
        totalAmount: session.amount_total / 100,
      },
      payment: {
        method: "CARD",
        status: "paid",
        transactionId: session.payment_intent,
      },
      orderStatus: "confirmed",
      deliveryAddress: {}, // optional: if you capture delivery info later
    });

    console.log("✅ Payment confirmed for session:", session.id);
  }

  res.json({ received: true });
});
