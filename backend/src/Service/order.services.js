import { Order } from "../models/order.model.js";
export const updateOrderStatus = async (orderId, status, io) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: status },
    { new: true }
  );
  const generateRoute = () => {
  return [
    { lat: 27.7172, lng: 85.324 },
    { lat: 27.721, lng: 85.325 },
    { lat: 27.725, lng: 85.33 },
    { lat: 27.727, lng: 85.336 },
    { lat: 27.729, lng: 85.339 },
  ];
};

  if (!order) throw new Error("Order not found");

  console.log("🟢 DB UPDATED:", order._id);

  // 🔥 SOCKET TRIGGER (NEXT STEP)
 if (status === "out_for_delivery") {
  console.log("🔥 STATUS:", status);
  console.log("🚀 Dispatching rider...");
   const route = generateRoute();
   console.log("📦 ROUTE SENT:", route.length);
   io.to(`order:${orderId}`).emit("test:event", {
  message: "socket working"
});

  io.to(`order:${orderId}`).emit("order:status_changed", {
    status: "out_for_delivery",
  });

  io.to(`order:${orderId}`).emit("admin:dispatch_order", {
    orderId,
    route ,// or generated route
  });
}

  return order;
};







// 🔥 NEXT BIG STEP (VERY IMPORTANT)

// You should connect:

// Payment success → order status becomes confirmed → socket emits → rider starts movement

// This is your real food delivery pipeline