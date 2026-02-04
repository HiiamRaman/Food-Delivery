/**
 * STRIPE WEBHOOK
 *
 * MENTAL FLOW:
 * 1. Stripe sends event
 * 2. Verify event
 * 3. If payment succeeded
 * 4. Update order as PAID
 */

// import { asyncHandler } from "../utils/asyncHandler.js";
// import Stripe from "stripe";
// import { Order } from "../models/order.model.js";
// import { ApiError } from "../utils/apiError.js";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// export const stripeWebHook = asyncHandler(async (req, res) => {
//   const signature = req.headers["stripe-signature"];
//   let event;
//   try {
//     //verify request really came from Stripe
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET,
//     );
//   } catch (error) {
//     console.log("Error", error);
//     throw new ApiError(400, "Webhook Error");
//   }

//   // 1. Check event type sent by Stripe
//   if (event.type === "payment_intent.succeeded") {
//     // 2. Get payment details
//     const paymentIntent = event.data.object;
//     // 3. Extract orderId saved earlier
//     const orderId = paymentIntent.metadata.orderId;
//     // 4. Update order as paid and confirmed
//     await Order.findByIdAndUpdate(orderId, {
//       paymentStatus: "paid",
//       orderStatus: "confirmed",
//     });
//   }
//   // 5. Inform Stripe that webhook was received successfully
//   res.json({ received: true });
// });









// import Stripe from "stripe";
// import { Order } from "../models/order.model.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const stripeWebHook = async (req, res) => {
//   console.log("🔔 Stripe webhook endpoint hit");

//   const signature = req.headers["stripe-signature"];
//   console.log("🧾 Stripe signature header:", signature ? "FOUND" : "MISSING");

//   let event;

//   try {
//     console.log("🔐 Verifying Stripe signature...");

//     event = stripe.webhooks.constructEvent(
//       req.body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );

   
//   } catch (error) {
//     console.error("❌ Signature verification failed");
//     console.error("❌ Error message:", error.message);
//     return res.status(400).send("Webhook Error");
//   }

//   try {


//     if (event.type === "payment_intent.succeeded") {
//       console.log("💰 Payment intent succeeded event received");

//       const paymentIntent = event.data.object;
//       console.log("📄 PaymentIntent ID:", paymentIntent.id);

//       const metadata = paymentIntent.metadata;
//       console.log("🧷 Payment metadata:", metadata);

//       const orderId = metadata?.orderId;
//       console.log("🆔 Extracted orderId:", orderId);

//       if (!orderId) {
//         console.warn("⚠️ orderId not found in metadata — skipping DB update");
//         return res.json({ received: true });
//       }

//       console.log("🛠 Updating order in database...");

//       const updatedOrder = await Order.findByIdAndUpdate(
//         orderId,
//         {
//           paymentStatus: "paid",
//           orderStatus: "confirmed",
//         },
//         { new: true }
//       );

//       console.log("✅ Order updated successfully:", updatedOrder?._id);
//     } else {
//       console.log("ℹ️ Event ignored (not payment_intent.succeeded)");
//     }

//     console.log("📨 Sending success response to Stripe");
//     return res.json({ received: true });

//   } catch (err) {
//     console.error("❌ Error while processing webhook event");
//     console.error(err);
//     console.log("📨 Sending 200 OK to prevent Stripe retry");
//     return res.json({ received: true });
//   }
// };






import Stripe from "stripe";
import { Order } from "../models/order.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * STRIPE WEBHOOK
 * Mental flow:
 * 1. Stripe sends an event
 * 2. Verify the signature
 * 3. If payment succeeded:
 *    - Extract orderId from metadata
 *    - Update order status in DB
 * 4. Respond to Stripe
 */
export const stripeWebHook = async (req, res) => {
  console.log("🔔 Stripe webhook endpoint hit");

  const signature = req.headers["stripe-signature"];
  console.log("🧾 Stripe signature header:", signature ? "FOUND" : "MISSING");

  let event;

  try {
    console.log("🔐 Verifying Stripe signature...");
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("✅ Stripe signature verified successfully");
  } catch (err) {
    console.error("❌ Signature verification failed");
    console.error("❌ Error:", err.message);
    return res.status(400).send("Webhook Error: Invalid signature");
  }

  try {
    console.log("📦 Handling Stripe event type:", event.type);

    if (event.type === "payment_intent.succeeded") {
      console.log("💰 Payment succeeded event received");

      const paymentIntent = event.data.object;
      console.log("📄 PaymentIntent ID:", paymentIntent.id);
      console.log("💳 Amount received:", paymentIntent.amount_received);

      const metadata = paymentIntent.metadata;
      console.log("🧷 Payment metadata:", metadata);

      const orderId = metadata?.orderId;
      if (!orderId) {
        console.warn("⚠️ orderId not found in metadata — skipping DB update");
        return res.json({ received: true });
      }

      console.log("🆔 Updating order with ID:", orderId);

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus: "paid", orderStatus: "confirmed" },
        { new: true }
      );

      if (!updatedOrder) {
        console.error("❌ Order not found in DB:", orderId);
      } else {
        console.log("✅ Order updated successfully:", updatedOrder._id);
      }
    } else {
      console.log("ℹ️ Event ignored (not payment_intent.succeeded)");
    }

    console.log("📨 Sending 200 OK to Stripe");
    return res.json({ received: true });
  } catch (err) {
    console.error("❌ Error processing webhook event:", err);
    console.log("📨 Sending 200 OK to prevent Stripe retry");
    return res.json({ received: true });
  }
};
