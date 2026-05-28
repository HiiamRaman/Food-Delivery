

import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/API/apiError.js";
import { ApiResponse } from "../utils/API/apiResponse.js";
import { asyncHandler } from "../utils/API/asyncHandler.js";

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