export const riderSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Rider Connected", socket.id);

    socket.on("start_order_tracking", (order) => {
      console.log("📦 Order received", order);

      const route = order.route;

      if (!route || route.length === 0) {
        console.log("❌ No route found");
        return;
      }

      let i = 0;

      const interval = setInterval(() => {
        if (i >= route.length) {
          clearInterval(interval);
          console.log("🏁 Rider Reached Destination");
          return;
        }

        const location = route[i];

        console.log("📍 Sending location:", location);

        // 🔥 IMPORTANT FIX HERE
        io.emit("rider_location_update", location);

        i++;
      }, 3000);
    });

    socket.on("disconnect", () => {
      console.log("Rider Disconnected", socket.id);
    });
  });
};