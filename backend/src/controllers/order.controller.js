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














// import Stripe from "stripe";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { Order } from "../models/order.model.js";
// import { Cart } from "../models/cart.model.js";
// import { ApiError } from "../utils/apiError.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const FRONTEND_URL = "http://localhost:5173";

// export const createOrder = asyncHandler(async (req, res) => {
//   // 1️⃣ Get logged-in user
//   const userId = req.user?._id;
//   console.log("USER ID from token:", userId);

//   if (!userId) {
//     console.error("Unauthorized: user not found in token");
//     throw new ApiError(401, "Unauthorized: user not found in token");
//   }

//   // 2️⃣ Fetch active cart
//   const cart = await Cart.findOne({ user: userId, isActive: true });
//   console.log("Fetched cart:", cart);

//   if (!cart) {
//     console.error("No active cart found for user:", userId);
//     throw new ApiError(400, "No active cart found");
//   }

//   if (!cart.item || cart.item.length === 0) {
//     console.error("Cart is empty for user:", userId);
//     throw new ApiError(400, "Cart is empty");
//   }

//   // 3️⃣ Convert cart → order items
//   const orderItems = cart.item.map((cartItem, index) => {
//     console.log(`Cart item #${index + 1}:`, cartItem);
//     return {
//       food: cartItem.food,
//       quantity: cartItem.quantity,
//       price: cartItem.price,
//       name: cartItem.foodName || "Food Item",
//     };
//   });

//   console.log("Converted order items:", orderItems);

//   // 4️⃣ Calculate totals
//   const subTotal = orderItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0,
//   );
//   const deliveryFee = 50;
//   const totalAmount = subTotal + deliveryFee;

//   console.log(
//     "SubTotal:",
//     subTotal,
//     "DeliveryFee:",
//     deliveryFee,
//     "TotalAmount:",
//     totalAmount,
//   );

//   // 5️⃣ Create order in DB
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

//   console.log("Order created with ID:", order._id.toString());

//   // 6️⃣ Stripe URLs
//   const successUrl = `${FRONTEND_URL}/success?orderId=${order._id}`;
//   const cancelUrl = `${FRONTEND_URL}/cancel`;
//   console.log("Stripe success URL:", successUrl);
//   console.log("Stripe cancel URL:", cancelUrl);

//   // 7️⃣ Create Stripe session
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: orderItems.map((item, index) => {
//       console.log(`Stripe line item #${index + 1}:`, item);
//       return {
//         price_data: {
//           currency: "usd",
//           product_data: { name: item.name },
//           unit_amount: item.price * 100, // Stripe expects cents
//         },
//         quantity: item.quantity,
//       };
//     }),
//     mode: "payment",
//     success_url: successUrl,
//     cancel_url: cancelUrl,
//     metadata: { orderId: order._id.toString() },
//   });

//   console.log("Stripe session URL:", session.url);

//   // 8️⃣ Return response
//   res.status(200).json({
//     success: true,
//     data: { url: session.url, orderId: order._id },
//     message: "Checkout session created successfully",
//   });
// });











import Stripe from "stripe";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { ApiError } from "../utils/apiError.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const FRONTEND_URL = "http://localhost:5173";

export const createOrder = asyncHandler(async (req, res) => {
  console.log("👉 createOrder API HIT");
  /* ───────────── 1. AUTH CHECK ───────────── */
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  /* ───────────── 2. DELIVERY ADDRESS VALIDATION ───────────── */
  const deliveryAddress = req.body?.deliveryAddress;

  if (!deliveryAddress) {
    throw new ApiError(
      400,
      "Delivery address is required to create an order"
    );
  }

  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "street",
    "city",
    "zipcode",
    "country",
    "phone",
  ];

  for (const field of requiredFields) {
    if (!deliveryAddress[field]) {
      throw new ApiError(
        400,
        `Delivery address field '${field}' is missing`
      );
    }
  }

  /* ───────────── 3. FETCH ACTIVE CART ───────────── */
  const cart = await Cart.findOne({ user: userId, isActive: true });

  if (!cart) {
    throw new ApiError(400, "No active cart found");
  }

  if (!cart.item || cart.item.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  /* ───────────── 4. CONVERT CART → ORDER ITEMS ───────────── */
  const orderItems = cart.item.map((item) => ({
    food: item.food,
    quantity: item.quantity,
    price: item.price,
    name: item.foodName || "Food Item",
  }));

  /* ───────────── 5. CALCULATE TOTALS ───────────── */
  const subTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = 50;
  const totalAmount = subTotal + deliveryFee;

  /* ───────────── 6. CREATE ORDER ───────────── */
  const order = await Order.create({
    user: userId,
    items: orderItems,
    subTotal,
    deliveryFee,
    totalAmount,
    paymentMethod: "CARD",
    paymentStatus: "pending",
    orderStatus: "placed",
    deliveryAddress,
  });

  /* ───────────── 7. STRIPE SESSION ───────────── */
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: orderItems.map((item) => ({
      price_data: {
        currency: "usd",
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

  /* ───────────── 8. RESPONSE ───────────── */
  res.status(200).json({
    success: true,
    data: {
      url: session.url,
      orderId: order._id,
    },
    message: "Checkout session created",
  });
});
