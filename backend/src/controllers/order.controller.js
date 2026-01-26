import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import Stripe from "stripe";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
//Intialize stripe with stripe key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = asyncHandler(async () => {
  /**
   * CREATE ORDER WITH STRIPE
   *
   * MENTAL FLOW:
   * 1. Get logged-in user
   * 2. Get user's active cart
   * 3. Copy cart items into order (price snapshot)
   * 4. Create order with payment = pending
   * 5. Create Stripe PaymentIntent
   * 6. Send clientSecret to frontend
   */
  // 1. Get logged-in user
  const userId = req.user._id;

  //get active cart

  const cart = await Cart.findOne({ user: userId, isActive: true }).populate(
    "item.food",
    "name price",
  );
  // If cart is empty, stop
  if (!cart || cart.item.length === 0) {
    throw ApiError(400, "cart is empty");
  }
  // convert cart to order
  const orderItems = cart.item.map((item) => ({
    food: item.food._id,
    quantity: item.quantity,
    price: item.food.price,
  }));
  //calclate Total
  const subTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = 50;
  const totalAmount = subTotal + deliveryFee;
  //createOrder
  const order = await Order.create({
    user: userId,
    items: orderItems,
    subTotal,
    deliveryFee,
    totalAmount,
    paymentMethod: "STRIPE",
    paymentStatus: "pending",
    orderStatus: "placed",
    deliveryAddress: req.body.deliveryAddress,
  });

  //create stripe paymentInetnt
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "usd",
    metadata: {
      orderId: order._id.toString(),
    },
  });
  return res.status(200).json(
    new ApiResponse(200, {
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
    }),
  );
});
