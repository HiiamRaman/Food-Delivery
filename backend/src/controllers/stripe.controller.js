/**
 * STRIPE WEBHOOK
 *
 * MENTAL FLOW:
 * 1. Stripe sends event
 * 2. Verify event
 * 3. If payment succeeded
 * 4. Update order as PAID
 */

import { asyncHandler } from "../utils/asyncHandler.js";
import Stripe from "stripe";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/apiError.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const stripeWebHook = asyncHandler(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    //verify request really came from Stripe
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_SECRET_KEY,
    );
  } catch (error) {
    console.log("Error", error);
    throw new ApiError(400, "Webhook Error");
  }

  // 1. Check event type sent by Stripe
  if (event.type === "payment_intent.suceeded") {
    // 2. Get payment details
    const paymentIntent = event.data.object;
    // 3. Extract orderId saved earlier
    const orderId = paymentIntent.metadata.orderId;
    // 4. Update order as paid and confirmed
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      orderStatus: "confirmed",
    });
  }
  // 5. Inform Stripe that webhook was received successfully
  res.json({ received: true });
});
