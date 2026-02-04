import { Order } from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const getOrder = asyncHandler(async (req, res) => {
  console.log("=== GET ORDER START ===");
  const { id } = req.params;
  const userId = req.user?._id;
  console.log("User ID:", userId, "Order ID:", id);

  if (!userId) throw new ApiError(401, "Unauthorized");

  const order = await Order.findById(id);
  console.log("Fetched Order:", order);

  if (!order) throw new ApiError(404, "Order not found");

  if (order.user.toString() !== userId.toString())
    throw new ApiError(403, "Forbidden");

  res.status(200).json({ success: true, data: { order } });
  console.log("=== GET ORDER END ===");
});
