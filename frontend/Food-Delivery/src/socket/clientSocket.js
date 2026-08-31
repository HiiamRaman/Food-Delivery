import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL;

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
