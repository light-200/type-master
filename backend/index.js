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
import { setFinishers } from "./race.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
const httpServer = createServer(app);
let corsOrigin;

console.log("[INFO] Initializing server...");

process.env.DEVELOPMENT_MODE == "true"
  ? (corsOrigin = ["http://localhost:8080", "http://127.0.0.1:5500"])
  : (corsOrigin = [process.env.FRONTEND_ADDRESS]);

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
  },
});

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log(`[INFO] New socket connection: ${socket.id}`);
  socket.on("createRoom", (userName, room) => createRoom(userName, room));
  socket.on("joinRoom", (userName, room) => joinRoom(userName, room));

  socket.on("typing", (user) => {
    console.log(`[INFO] User ${user.name} typing in room ${user.room} - Progress: ${user.progress}%`);
    setUser(user);
    const playerList = getUsersInRoom(user.room);
    io.to(user.room).emit("playerList", playerList);
  });

  function createRoom(userName, room) {
    if (!room) {
      console.log("[INFO] Room creation failed: no room name provided");
      return;
    }
    let roomId = room.slice(0, 6);
    socket.join(roomId);
    console.log(`[INFO] Room created: ${roomId} by user: ${userName || 'guest'}`);
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
    console.log(`[INFO] Fetching new text for room: ${room}`);
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
      console.log(`[INFO] Join attempt failed: Unknown room code ${roomName}`);
      socket.emit("unknownCode");
      return;
    } else if (numClients > 7) {
      console.log(`[INFO] Join attempt failed: Room ${roomName} is full (${numClients} players)`);
      socket.emit("tooManyPlayers");
      return;
    }
    console.log(`[INFO] User ${userName || 'guest'} joined room: ${roomName} (${numClients + 1} total players)`);
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

  socket.on("raceStart", (room) => {
    console.log(`[INFO] Race started in room: ${room}`);
    io.to(room).emit("raceStart");
  });

  socket.on("finished", (user) => {
    console.log(`[INFO] User ${user.name} finished race in room ${user.room} - Speed: ${user.speed} WPM`);
    setFinishers(user, io);
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      console.log(`[INFO] User ${user.name} disconnected from room: ${user.room}`);
      io.to(user.room).emit("playerList", getUsersInRoom(user.room));
    } else {
      console.log(`[INFO] Socket ${socket.id} disconnected (user not found)`);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`[INFO] Server running on port ${PORT}`);
  console.log(`[INFO] CORS enabled for: ${JSON.stringify(corsOrigin)}`);
});
