export const riderSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("start_order_tracking", (order) => {
      const route = order.route;

      if (!route || route.length === 0) {
        return;
      }

      let i = 0;

      const interval = setInterval(() => {
        if (i >= route.length) {
          clearInterval(interval);

          io.emit("delivery_completed", {
            status: "delivered",
          });

          return;
        }

        const location = route[i];

        // 🔥 IMPORTANT FIX HERE
        io.emit("rider_location_update", location);

        i++;
      }, 5000);
    });

    socket.on("disconnect", () => {
      console.log("Rider Disconnected", socket.id);
    });
  });
};
