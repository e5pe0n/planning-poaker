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
