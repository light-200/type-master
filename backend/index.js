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
  socket.on("createRoom", (user, room) => createRoom(user, room));
  socket.on("joinRoom", (user, room) => joinRoom(user, room));

  function createRoom(user, room) {
    let roomId = room.slice(0, 6);
    socket.join(roomId);
    user = JSON.parse(user);
    socket.emit("roomId", roomId);
    socket.on("getText", () => {
      getText(io, roomId);
    });
  }

  function joinRoom(user, roomName) {
    const room = io.sockets.adapter.rooms.get(roomName);

    let allUsers;
    if (room) {
      allUsers = Array.from(room);
    }

    let numClients = 0;
    if (allUsers) {
      numClients = allUsers.length;
      console.log(numClients);
    }

    if (numClients === 0) {
      socket.emit("unknownCode");
      return;
    } else if (numClients > 7) {
      socket.emit("tooManyPlayers");
      return;
    }

    socket.join(roomName);
    user = JSON.parse(user);
    socket.emit("roomId", roomName);
  }
});

httpServer.listen(process.env.PORT || 3000, () => {
  console.log("http://localhost:3000");
});
