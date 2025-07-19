import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FrontendURL, // e.g., 'http://localhost:5173'
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    // Emit updated online users list to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Find and remove the disconnected user
    const userId = Object.keys(userSocketMap).find(
      key => userSocketMap[key] === socket.id
    );
    if (userId) {
      delete userSocketMap[userId];
      // Emit updated online users list after disconnect
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});
export { io, server, app };

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};
