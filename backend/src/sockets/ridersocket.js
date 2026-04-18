export const riderSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Rider Connected ", socket.id);
    // 1. Rider joins their room
    socket.on("join_Rider", (riderId) => {
      socket.join(riderId);
      console.log(`🚴 Rider joined room: ${riderId}`);
    });
    // 2. Rider sends live location
    socket.on("rider_location", (data) => {
      //data = {riderId,lat,lng}
      console.log("Location Received", data);
      // Broadcast to all clients (customers/admin)
      io.emit("rider_location_update", data);
    });
    // 3. Order assigned to rider
    socket.on("assign_Order", (data) => {
      // data = { riderId, order }
      console.log("Order assigned", data);
      io.to(data.riderId).emit("new_order", data.order);
    });
    //disconnect
    socket.on("disconnect", () => {
      console.log("Rider Disconnected", socket.id);
    });
  });
};
