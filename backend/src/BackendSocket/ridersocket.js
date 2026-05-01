
// sockets/
//   ├── ridersocket.js        (connection + events only)
// services/
//   ├── rider.service.js (movement logic)






export const riderSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    // 📦 join tracking room
    socket.on("joinOrderTracking", (orderId) => {
      if (!orderId) return;

      socket.join(orderId);
      console.log("👁️ Tracking started:", orderId);
    });

    // 📦 leave tracking room
    socket.on("leaveOrderTracking", (orderId) => {
      if (!orderId) return;

      socket.leave(orderId);
      console.log("🚫 Tracking stopped:", orderId);
    });

   

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });
};