// export const riderSocket = (io) => {
//   io.on("connection", (socket) => {
//     socket.on("start_order_tracking", (order) => {
//       const route = order.route;

//       if (!route || route.length === 0) {
//         return;
//       }

//       let i = 0;

//       const interval = setInterval(() => {
//         if (i >= route.length) {
//           clearInterval(interval);

//           io.emit("delivery_completed", {
//             status: "delivered",
//           });

//           return;
//         }

//         const location = route[i];

//         // 🔥 IMPORTANT FIX HERE
//         io.emit("rider_location_update", location);

//         i++;
//       }, 5000);
//     });

//     socket.on("disconnect", () => {
//       console.log("Rider Disconnected", socket.id);
//     });
//   });
// };








































export const riderSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🚀 CONNECTED:", socket.id);

    // =========================
    // 1. JOIN ORDER ROOM
    // =========================
    socket.on("join_order", (orderId) => {
      socket.join(`order:${orderId}`);
      console.log("👤 JOINED:", orderId);
    });

    // =========================
    // 2. DISPATCH ORDER (START MOVEMENT)
    // =========================
    socket.on("admin:dispatch_order", ({ orderId, route }) => {
      console.log("🚀 DISPATCH RECEIVED");
console.log("📦 ROUTE:", route);
      const room = `order:${orderId}`;

      console.log("🚀 DISPATCH:", orderId);
      console.log("📍 ROUTE LENGTH:", route.length);

      // send status update
      io.to(room).emit("order:status_changed", {
        status: "out_for_delivery",
      });

      // start movement
      let i = 0;

      const interval = setInterval(() => {
        if (i >= route.length) {
          clearInterval(interval);

          console.log("🏁 DELIVERED:", orderId);

          io.to(room).emit("order:delivered", {
            status: "delivered",
          });

          return;
        }

        const position = route[i];

        console.log("📡 MOVE:", position);

        io.to(room).emit("order:location_update", position);

        i++;
      }, 2000);
    });

    // =========================
    // 3. DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      console.log("❌ DISCONNECTED:", socket.id);
    });
  });
};