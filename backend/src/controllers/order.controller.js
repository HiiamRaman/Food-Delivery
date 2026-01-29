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

export const createOrder = asyncHandler(async (req, res) => {
  /**
   * CREATE ORDER + STRIPE CHECKOUT SESSION
   *
   * Flow:
   * 1. Get logged-in user
   * 2. Fetch active cart
   * 3. Validate cart
   * 4. Convert cart → order snapshot
   * 5. Calculate totals
   * 6. Create order in DB
   * 7. Create Stripe Checkout Session
   * 8. Return session URL + orderId to frontend
   */
const FRONTEND_URL = "http://localhost:5173"
  const userId = req.user._id;

  // Fetch active cart
  const cart = await Cart.findOne({ user: userId, isActive: true });
  if (!cart || cart.item.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  // Convert cart items → order snapshot
  const orderItems = cart.item.map((cartItem) => ({
    food: cartItem.food,        // ObjectId
    quantity: cartItem.quantity,
    price: cartItem.price,
    name: cartItem.foodName,    // optional snapshot
  }));

  // Calculate totals
  const subTotal = orderItems.reduce(
    (sum, orderItem) => sum + orderItem.price * orderItem.quantity,
    0
  );
  const deliveryFee = 50;
  const totalAmount = subTotal + deliveryFee;

  // Create order in DB
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

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: orderItems.map((orderItem) => ({
      price_data: {
        currency: "npr",
        product_data: { name: orderItem.name },
        unit_amount: orderItem.price * 100,
      },
      quantity: orderItem.quantity,
    })),
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/success?orderId=${order._id}`,
    cancel_url: `${FRONTEND_URL}/cancel`,
    metadata: { orderId: order._id.toString() },
  });

  // Return session URL + orderId to frontend
  res.status(200).json({
    success: true,
    data: {
      url: session.url,
      orderId: order._id,
    },
    message: "Checkout session created",
  });
});
