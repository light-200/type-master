import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import getText from "./getText.js";
import { addUser, getUsersInRoom, removeUser } from "./user.js";
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
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
    let tempUser = {
      id: socket.id,
      name: `guest0`,
      progress: 0,
      speed: 0,
      room: roomId,
    };
    addUser(tempUser);
    const playerList = getUsersInRoom(roomId);
    io.to(roomId).emit("playerList", playerList);
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
    let tempUser = {
      id: socket.id,
      name: `guest${numClients}`,
      progress: 0,
      speed: 0,
      room: roomName,
    };
    addUser(tempUser);
    const playerList = getUsersInRoom(roomName);
    io.to(roomName).emit("playerList", playerList);
  }

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    io.to(user.room).emit("playerList", getUsersInRoom(user.room));
  });
});

httpServer.listen(process.env.PORT || 3000, () => {
  console.log("http://localhost:3000");
});
