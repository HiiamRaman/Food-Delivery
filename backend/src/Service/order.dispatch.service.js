// Order flow:
// placed → confirmed → preparing → out_for_delivery → delivered
// placed / confirmed / preparing → cancelled

import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/API/apiError.js";
import { startRiderMovement } from "./rider.service.js";

const emitOrderStatus = (io, orderId, status) => {
  io.to(orderId.toString()).emit("orderStatusUpdated", {
    orderId,
    status,
  });
};

// ================= CONFIRM ORDER =================

export const confirmOrder = async (orderId, io) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.orderStatus !== "placed") {
    throw new ApiError(
      400,
      `Only placed orders can be confirmed. Current status: ${order.orderStatus}`,
    );
  }

  order.orderStatus = "confirmed";

  await order.save();

  emitOrderStatus(io, orderId, order.orderStatus);

  return order;
};

// ================= MARK PREPARING =================

export const markPreparing = async (orderId, io) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.orderStatus !== "confirmed") {
    throw new ApiError(
      400,
      `Only confirmed orders can be marked as preparing. Current status: ${order.orderStatus}`,
    );
  }

  order.orderStatus = "preparing";

  await order.save();

  emitOrderStatus(io, orderId, order.orderStatus);

  return order;
};

// ================= DISPATCH ORDER =================

export const dispatchOrderByAdmin = async (orderId, io) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.dispatchApproved) {
    throw new ApiError(400, "Order has already been dispatched");
  }

  if (order.orderStatus !== "preparing") {
    throw new ApiError(
      400,
      `Only preparing orders can be dispatched. Current status: ${order.orderStatus}`,
    );
  }

  if (!order.route || order.route.length === 0) {
    throw new ApiError(400, "Order route is not available");
  }

  order.dispatchApproved = true;
  order.orderStatus = "out_for_delivery";

  await order.save();

  emitOrderStatus(io, orderId, order.orderStatus);

  console.log("✅ Admin approved dispatch:", orderId);

  startRiderMovement(io, orderId.toString(), order.route);

  return order;
};

// ================= CANCEL ORDER =================

export const cancelOrderByAdmin = async (orderId, io) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.orderStatus === "cancelled") {
    throw new ApiError(400, "Order is already cancelled");
  }

  if (order.orderStatus === "delivered") {
    throw new ApiError(400, "Delivered order cannot be cancelled");
  }

  if (order.orderStatus === "out_for_delivery") {
    throw new ApiError(400, "Order cannot be cancelled after dispatch");
  }

  const cancellableStatuses = ["placed", "confirmed", "preparing"];

  if (!cancellableStatuses.includes(order.orderStatus)) {
    throw new ApiError(
      400,
      `Order cannot be cancelled from status: ${order.orderStatus}`,
    );
  }

  order.orderStatus = "cancelled";

  await order.save();

  emitOrderStatus(io, orderId, order.orderStatus);

  return order;
};


export const getAllOrdersForAdmin = async () => {
  const orders = await Order.find()
    .populate("user", "username email fullname")
    .sort({ createdAt: -1 });

  return orders;
};
export const getOrderByIdForAdmin = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("user", "username fullname email");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
};
