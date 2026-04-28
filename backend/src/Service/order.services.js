


// 🔥 NEXT BIG STEP (VERY IMPORTANT)

// You should connect:

// Payment success → order status becomes confirmed → socket emits → rider starts movement

// This is your real food delivery pipeline



















import { Order } from "../models/order.model.js";
export const updateOrderStatus = async (orderId, status, io) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus: status },
    { new: true }
  );

  if (!order) throw new Error("Order not found");

  console.log("🟢 DB UPDATED:", order._id);

  if (status === "out_for_delivery") {
    console.log("🚀 Starting delivery...");

    const route = [
      { lat: 27.7172, lng: 85.324 },
      { lat: 27.721, lng: 85.325 },
      { lat: 27.725, lng: 85.33 },
      { lat: 27.727, lng: 85.336 },
      { lat: 27.729, lng: 85.339 },
    ];

    const room = `order:${orderId}`;

    let i = 0;

    const interval = setInterval(() => {
      if (i >= route.length) {
        clearInterval(interval);

        io.to(room).emit("order:delivered");
        console.log("🏁 Delivered");

        return;
      }

      const point = route[i];

      console.log("📡 MOVE:", point);

      io.to(room).emit("order:location_update", point);

      i++;
    }, 2000);
  }

  return order;
};