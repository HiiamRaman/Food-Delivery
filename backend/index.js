import dotenv from "dotenv";
dotenv.config({});
import http from "http";
import { Server } from "socket.io";
import { connectDb } from "./src/db/index.js";
import { app } from "./app.js";
import mongoose from "mongoose";
import { riderSocket } from "./src/sockets/ridersocket.js";
const port = process.env.PORT || 8000;

// Create HTTP server (Socket.IO needs raw HTTP, not just Express)
const server = http.createServer(app);
// Initialize Socket.IO server
const io = new Server(server, {
  cors: { origin: "*" }, // allow frontend connections
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
app.set("io",io);

export { io, server };

//
riderSocket(io);

// mongodb connection
connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(` app listening on port http://localhost:${port}`);
     
    });
  })
  .catch((error) => {
    console.log("Mongodb connection Error", error);
    process.exit(1);
  });
