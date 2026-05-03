import { io } from "socket.io-client";

const URL = "http://localhost:3000";

export const socket = io(URL, {
  autoConnect: true,
  transports: ["websocket", "polling"], // safe fallback
});

// ✅ correct event
socket.on("connect", () => {
  console.log("🟢 SOCKET CONNECTED:", socket.id);
});

// ✅ correct disconnect event
socket.on("disconnect", () => {
  console.log("🔴 SOCKET DISCONNECTED");
});

// ✅ correct error handler
// socket.on("connect_error", (err) => {
//   console.log("❌ SOCKET ERROR:", err.message);
// });