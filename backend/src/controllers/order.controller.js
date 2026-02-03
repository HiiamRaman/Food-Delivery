// import { Order } from "../models/order.model.js";
// import { User } from "../models/user.model.js";
// import Stripe from "stripe";
// import { ApiError } from "../utils/apiError.js";
// import { ApiResponse } from "../utils/apiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { Cart } from "../models/cart.model.js";



// export const createOrder = asyncHandler(async (req,res) => {
//   /**
//    * CREATE ORDER WITH STRIPE
//    *
//    * MENTAL FLOW:
//    * 1. Get logged-in user
//    * 2. Get user's active cart
//    * 3. Copy cart items into order (price snapshot)
//    * 4. Create order with payment = pending
//    * 5. Create Stripe PaymentIntent
//    * 6. Send clientSecret to frontend
//    */
//   // 1. Get logged-in user
//   const userId = req.user._id;
  
//   console.log(req.user); // test
//   //get active cart

//   const cart = await Cart.findOne({ user: userId, isActive: true }).populate(
//     "item.food",
//     "name price",
//   );
//   // If cart is empty, stop
//   if (!cart || cart.item.length === 0) {
//     throw new  ApiError(400, "cart is empty");
//   }
//   // convert cart to order
//   const orderItems = cart.item.map((item) => ({
//     food: item.food._id,
//     quantity: item.quantity,
//     price: item.food.price,
//   }));
//   //calclate Total
//   const subTotal = orderItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0,
//   );
//   const deliveryFee = 50;
//   const totalAmount = subTotal + deliveryFee;
//   //createOrder
//   const order = await Order.create({
//     user: userId,
//     items: orderItems,
//     subTotal,
//     deliveryFee,
//     totalAmount,
//     paymentMethod: "CARD",
//     paymentStatus: "pending",
//     orderStatus: "placed",
//     deliveryAddress: req.body.deliveryAddress,
//   });

//   //create stripe paymentInetnt
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: totalAmount * 100,
//     currency: "usd",
//     metadata: {
//       orderId: order._id.toString(),
//     },
//   });
//   return res.status(200).json(
//     new ApiResponse(200, {
//       success: true,
//       clientSecret: paymentIntent.client_secret,
//       orderId: order._id,
//     }),
//   );
// });












import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { ApiError } from "../utils/apiError.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = "http://localhost:5173";

export const createOrder = asyncHandler(async (req, res) => {
  console.log("===== CREATE ORDER START =====");

  /* ─────────────── 1. USER DEBUG ─────────────── */
  console.log("USER FROM TOKEN:", req.user);

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized: user not found in token");
  }
  console.log("USER ID:", userId.toString());

  /* ─────────────── 2. REQUEST BODY DEBUG ─────────────── */
  console.log("REQUEST BODY:", req.body);
  console.log("DELIVERY ADDRESS:", req.body.deliveryAddress);

  /* ─────────────── 3. FETCH CART ─────────────── */
  const cart = await Cart.findOne({ user: userId, isActive: true });
  console.log("CART FOUND:", cart);

  if (!cart) {
    throw new ApiError(400, "No active cart found");
  }

  console.log("CART ITEMS:", cart.item);
  console.log("CART ITEMS COUNT:", cart.item.length);

  if (cart.item.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  /* ─────────────── 4. CONVERT CART → ORDER ITEMS ─────────────── */
  const orderItems = cart.item.map((cartItem) => ({
    food: cartItem.food,
    quantity: cartItem.quantity,
    price: cartItem.price,
    name: cartItem.foodName || "Food Item",
  }));

  console.log("ORDER ITEMS:", orderItems);

  /* ─────────────── 5. CALCULATE TOTALS ─────────────── */
  const subTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 50;
  const totalAmount = subTotal + deliveryFee;

  console.log("SUBTOTAL:", subTotal);
  console.log("DELIVERY FEE:", deliveryFee);
  console.log("TOTAL AMOUNT:", totalAmount);

  /* ─────────────── 6. CREATE ORDER ─────────────── */
  console.log("CREATING ORDER IN DB...");

  const order = await Order.create({
    user: userId,
    items: orderItems,
    subTotal,
    deliveryFee,
    totalAmount,
    paymentMethod: "CARD",
    paymentStatus: "pending",
    orderStatus: "placed",
    deliveryAddress: req.body.deliveryAddress,
  });

  console.log("ORDER CREATED:", order._id.toString());

  /* ─────────────── 7. STRIPE URL DEBUG ─────────────── */
  console.log(
    "STRIPE SUCCESS URL:",
    `${FRONTEND_URL}/success?orderId=${order._id}`
  );
  console.log("STRIPE CANCEL URL:", `${FRONTEND_URL}/cancel`);

  /* ─────────────── 8. CREATE STRIPE SESSION ─────────────── */
  console.log("CREATING STRIPE SESSION...");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: orderItems.map((item) => ({
      price_data: {
        currency: "inr", // Stripe supported currency
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${FRONTEND_URL}/success?orderId=${order._id}`,
    cancel_url: `${FRONTEND_URL}/cancel`,
    metadata: { orderId: order._id.toString() },
  });

  console.log("STRIPE SESSION URL:", session.url);
  console.log("===== CREATE ORDER SUCCESS =====");

  /* ─────────────── 9. RESPONSE ─────────────── */
  res.status(200).json({
    success: true,
    data: {
      url: session.url,
      orderId: order._id,
    },
    message: "Checkout session created",
  });
});