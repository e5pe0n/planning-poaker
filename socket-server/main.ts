import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("a user disconnectted");
  });

  socket.on("chat message", (message: string) => {
    console.log("message:", message);
    io.emit("chat message", message);
  });
});

server.listen(3001, () => {
  console.log("server runnig at http://localhost:3001");
});
