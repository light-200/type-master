import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import getText from "./getText.js";
import {
  addUser,
  getUsersInRoom,
  removeUser,
  resetUser,
  setUser,
} from "./user.js";
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["https://light-200.github.io"],
  },
});

io.on("connection", (socket) => {
  socket.on("createRoom", (userName, room) => createRoom(userName, room));
  socket.on("joinRoom", (userName, room) => joinRoom(userName, room));

  socket.on("typing", (user) => {
    setUser(user);
    const playerList = getUsersInRoom(user.room);
    io.to(user.room).emit("playerList", playerList);
  });

  function createRoom(userName, room) {
    if (!room) {
      return;
    }
    let roomId = room.slice(0, 6);
    socket.join(roomId);
    socket.emit("roomId", roomId);
    let tempUser = {
      id: socket.id,
      name: userName || `guest`,
      progress: 0,
      speed: 0,
      room: roomId,
    };

    addUser(tempUser);
    const playerList = getUsersInRoom(roomId);
    io.to(roomId).emit("playerList", playerList);
  }
  socket.on("getText", (room) => {
    getText(io, room);
    const playerList = resetUser(room);
    io.to(room).emit("playerList", playerList);
  });

  function joinRoom(userName, roomName) {
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
    socket.emit("roomId", roomName);
    let tempUser = {
      id: socket.id,
      name: userName || `guest${numClients}`,
      progress: 0,
      speed: 0,
      room: roomName,
    };
    addUser(tempUser);
    const playerList = getUsersInRoom(roomName);
    io.to(roomName).emit("playerList", playerList);

    if (numClients === 1) {
      io.to(roomName).emit("textTimer");
    }
  }

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    user && io.to(user.room).emit("playerList", getUsersInRoom(user.room));
  });
});

httpServer.listen(process.env.PORT || 3000);
