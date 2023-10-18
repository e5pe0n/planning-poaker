import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
import * as env from "env-var";
import path from "path";
import { randomUUID } from "crypto";

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

const rooms = new Map<string, Map<string, number | undefined>>();

app.use(express.json());

app.post("/room", (req, res) => {
  const roomId = randomUUID();
  rooms.set(roomId, new Map());
  res.redirect(`${config.frontendOrigin}/host/${roomId}`);
});

app.post("/join", (req, res) => {
  const { roomId, username } = req.body;
  const votes = rooms.get(roomId);
  if (!votes) {
    return res.status(400).end();
  }

  rooms.set(roomId, votes.set(username, undefined));
  res.redirect(`${config.frontendOrigin}/room/${roomId}/${username}`);
});

io.on("connection", (socket) => {
  const { roomId, username } = socket.handshake.auth;

  socket.on("vote", (n: number) => {
    const votes = rooms.get(roomId)!;
    votes.set(username, n);

    const ns = Array.from(votes.values());
    if (ns.every((n): n is number => n !== undefined)) {
      socket.emit("decided", Object.fromEntries(votes.entries()));
    }
  });

  socket.on("start", () => {
    socket.in(roomId).emit("start");
  });

  socket.on("reset", () => {
    rooms.clear();
  });

  socket.on("error", () => {
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    console.log("a user disconnectted");
  });
});

server.listen(3001, () => {
  console.log("server runnig at http://localhost:3001");
});
