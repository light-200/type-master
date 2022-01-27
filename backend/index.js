import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import getText from "./getText.js";
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5500",
  },
});

io.on("connection", (socket) => {
  socket.on("createRoom", (user, room) => createRoom(user, room, socket));
  console.log("a user connected");
});

httpServer.listen(process.env.PORT || 3000, () => {
  console.log("http://localhost:3000");
});

function createRoom(user, room, socket) {
  let roomId = room.slice(0, 6);
  socket.join(roomId);
  user = JSON.parse(user);
  socket.emit("roomId", roomId);
  let text;
  socket.on("getText", () => {
    getText(io, roomId);
  });
}
