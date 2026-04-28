




export const riderSocket = (io) => {
  const active = new Map();

  io.on("connection", (socket) => {
    console.log("CONNECTED:", socket.id);

    socket.on("join_order", (orderId) => {
      socket.join(`order:${orderId}`);
      console.log("JOINED:", orderId);
    });

    socket.on("admin:dispatch_order", ({ orderId, route }) => {
      if (!orderId || !Array.isArray(route)) {
        console.log("INVALID DISPATCH");
        return;
      }

      const room = `order:${orderId}`;

      // STOP old interval if exists
      if (active.has(orderId)) {
        clearInterval(active.get(orderId));
      }

      io.to(room).emit("order:status_changed", {
        status: "out_for_delivery",
      });

      let i = 0;

      const interval = setInterval(() => {
        if (i >= route.length) {
          clearInterval(interval);
          active.delete(orderId);

          io.to(room).emit("order:delivered", {
            status: "delivered",
          });

          return;
        }

        io.to(room).emit("order:location_update", {
          lat: route[i].lat,
          lng: route[i].lng,
        });

        i++;
      }, 2000);

      active.set(orderId, interval);
    });

    socket.on("disconnect", () => {
      console.log("DISCONNECTED:", socket.id);
    });
  });
};