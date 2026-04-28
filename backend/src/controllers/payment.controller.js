// import { Order } from "../models/order.model.js";
// import { ApiResponse } from "../utils/apiResponse.js";
// import { ApiError } from "../utils/apiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// export const handlePaymentSuccess = asyncHandler(async (req, res) => {
//   const { orderId, paymentId } = req.body;
//   // 1. Validate input first
//   if (!orderId || !paymentId) {
//     throw new ApiError(400, "OrderId and PaymentId are required");
//   }
//   const order = await Order.findById(orderId);
//   if (!order) {
//     throw new ApiError(404, "Order Not Found");
//   }
//   order.payment.status = "paid";
//   order.payment.transactionId = paymentId;
//   order.orderStatus = "confirmed";
//   await order.save();

//   //start tracking for delivery
//   const io = req.app.get("io");
//   if (order.route && order.route.length > 0) {
//     let i = 0;
//     const interval = setInterval(() => {
//       if (i >= order.route.length) {
//         clearInterval(interval);
//         console.log("🚚 Delivery completed");
//         return;
//       }

//       io.emit("rider_location_update", order.route[i]);
//       i++;
//     }, 3000);
//   }

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(
//         200,
//         { success: true, order },
//         "Payment confirmed & tracking started",
//       ),
//     );
// });







// mark order as paid
// store transactionId

import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const handlePaymentSuccess = asyncHandler(async (req, res) => {
  const { paymentId, orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // 🔥 PAYMENT UPDATE (core logic)
  order.payment.status = "paid";
  order.payment.transactionId = paymentId;

  await order.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { order },
      "Payment updated successfully"
    )
  );
});