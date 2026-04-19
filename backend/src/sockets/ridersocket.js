export const riderSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Rider Connected", socket.id);

    socket.on("start_order_tracking", (order) => {
      console.log("Order received", order);
      const route = order.route;
      let i = 0;
      const interval = setInterval(() => {
        if (i >= route.length) {
          clearInterval(interval);
          console.log("Rider Reached Destination");
          return;
        }
        socket.emit("rider_location_update", route[i]);
        i++;
      }, 3000);
    });

    socket.on("disconnect", () => {
      console.log("Rider Disconnected", socket.id);
    });
  });
};

// thoery

// Frontend sends route
//         ↓
// Backend starts timer
//         ↓
// Every 4 seconds:
//     → pick next location
//     → send to frontend
//         ↓
// Frontend updates marker on map
//         ↓
// Rider looks like moving 🚚
