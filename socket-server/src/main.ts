import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
import * as env from "env-var";
import path from "path";

if (process.env.APP_ENV === "local") {
  dotenv.config({ path: path.join(__dirname, "../.env.local") });
}

const config = {
  frontendOrigin: env.get("FRONTEND_ORIGIN").required().asString(),
} as const;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.frontendOrigin,
  },
});

const rooms = new Map<string, Set<string>>();

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("a user disconnectted");
  });

  socket.on("chat message", (message: string) => {
    console.log("message:", message);
    io.emit("chat message", message);
  });

  socket.on("join", (data: { roomId: string; username: string }) => {
    const { roomId, username } = data;
    socket.join(roomId);
    const users = (rooms.get(roomId) ?? new Set()).add(username);
    rooms.set(roomId, users);
    io.to(roomId).emit(
      "join",
      `${Array.from(users.values()).join(", ") || "no one"} in Room(${roomId})`,
    );
  });

  socket.on("leave", (data: { roomId: string; username: string }) => {
    const { roomId, username } = data;
    const users = rooms.get(roomId) ?? new Set();
    users.delete(username);
    rooms.set(roomId, users);
    io.to(roomId).emit(
      "leave",
      `${Array.from(users.values()).join(", ") || "no one"} in Room(${roomId})`,
    );
    socket.leave(roomId);
  });

  socket.on("reset", () => {
    rooms.clear();
  });
});

server.listen(3001, () => {
  console.log("server runnig at http://localhost:3001");
});
