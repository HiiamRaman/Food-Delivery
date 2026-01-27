import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import Stripe from "stripe";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";

// //Intialize stripe with stripe key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


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














export const createOrder = asyncHandler(async (req, res) => {
  /**
   * CREATE ORDER WITH STRIPE
   *
   * MENTAL FLOW:
   * 1. Get logged-in user
   * 2. Get active cart
   * 3. Convert cart items → order items (snapshot)
   * 4. Calculate totals
   * 5. Create order
   * 6. Create Stripe PaymentIntent
   */

  const userId = req.user._id;

  // 1. Get active cart (NO populate)
  const cart = await Cart.findOne({
    user: userId,
    isActive: true,
  });

  // 2. Validate cart
  if (!cart || cart.item.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  // 3. Convert cart → order items (USE SNAPSHOT DATA)
  const orderItems = cart.item.map((item) => ({
    food: item.food,          // ObjectId already exists
    quantity: item.quantity,
    price: item.price,        // snapshot price (IMPORTANT)
  }));

  // 4. Calculate totals
  const subTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = 50;
  const totalAmount = subTotal + deliveryFee;

  // 5. Create order
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

  // 6. Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "NPR",
    metadata: {
      orderId: order._id.toString(),
    },
  });

  return res.status(200).json(
    new ApiResponse(200, {
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
    })
  );
});
