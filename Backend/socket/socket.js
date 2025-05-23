const userSocketMap = new Map();

export default function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Handle user connection
    socket.on("userConnected", (userId) => {
      if (!userId) return;
      userSocketMap.set(userId, socket.id);
      console.log("User connected:", userId);
      io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });

    // Handle manual user disconnect (logout)
    socket.on("userDisconnected", () => {
      const userId = Array.from(userSocketMap.entries())
        .find(([_, sockId]) => sockId === socket.id)?.[0];
      
      if (userId) {
        userSocketMap.delete(userId);
        console.log("User disconnected:", userId);
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
      }
    });

    // Handle socket disconnect (browser close, etc)
    socket.on("disconnect", () => {
      const userId = Array.from(userSocketMap.entries())
        .find(([_, sockId]) => sockId === socket.id)?.[0];
      
      if (userId) {
        userSocketMap.delete(userId);
        console.log("Socket disconnected:", userId);
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
      }
    });
  });

  // Return cleanup function
  return () => {
    io.removeAllListeners();
  };
}