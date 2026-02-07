import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import getText from "./getText.js";
import { generateRandomText } from "./controllers/textController.js";
import {
  addUser,
  getUserCount,
  getUsersInRoom,
  removeUser,
  resetUser,
  setUser,
} from "./user.js";
import { getWinner, resetFinishers, resetWinner, setFinishers } from "./race.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
const httpServer = createServer(app);
let corsOrigin;

const ROOM_WORD_COUNT_OPTIONS = [10, 25, 50, 100];
const DEFAULT_WORD_COUNT = 25;
const DEFAULT_PUNCTUATION_MODE = true;
const DEFAULT_SMALL_CASE_MODE = false;
const roomSettings = new Map();

function normalizeWordCount(value) {
  const parsed = parseInt(value, 10);
  return ROOM_WORD_COUNT_OPTIONS.includes(parsed)
    ? parsed
    : DEFAULT_WORD_COUNT;
}

function normalizeRoomSettings(settings) {
  return {
    wordCount: normalizeWordCount(settings && settings.wordCount),
    punctuationMode:
      settings && typeof settings.punctuationMode === "boolean"
        ? settings.punctuationMode
        : DEFAULT_PUNCTUATION_MODE,
    smallCaseMode:
      settings && typeof settings.smallCaseMode === "boolean"
        ? settings.smallCaseMode
        : DEFAULT_SMALL_CASE_MODE,
  };
}

function emitLobbyStats() {
  io.emit("lobbyStats", {
    rooms: roomSettings.size,
    players: getUserCount(),
  });
}

console.log("[INFO] Initializing server...");

process.env.DEVELOPMENT_MODE == "true"
  ? (corsOrigin = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:8080",
      "http://127.0.0.1:5500",
    ])
  : (corsOrigin = [process.env.FRONTEND_ADDRESS]);


app.get("/api/text", (req, res) => {
  try {
    const wordCount = req.query.words || DEFAULT_WORD_COUNT;
    const text = generateRandomText(wordCount);
    res.json({ content: text });
  } catch (error) {
    console.error("[ERROR] Failed to generate text:", error.message);
    res.status(500).json({ error: "Failed to generate text" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  try {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("[ERROR] Health check failed:", error.message);
    res.status(500).json({ status: "error" });
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
  },
});

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log(`[INFO] New socket connection: ${socket.id}`);
  socket.emit("lobbyStats", {
    rooms: roomSettings.size,
    players: getUserCount(),
  });
  socket.on("createRoom", (userName, room, settings) =>
    createRoom(userName, room, settings)
  );
  socket.on("joinRoom", (userName, room) => joinRoom(userName, room));
  socket.on("leaveRoom", () => {
    const room = Array.from(socket.rooms).find((id) => id !== socket.id);
    removeUser(socket.id);
    if (room) {
      socket.leave(room);
      const remainingUsers = getUsersInRoom(room);
      io.to(room).emit("playerList", {
        players: remainingUsers,
        winnerId: getWinner(room),
      });
      if (remainingUsers.length === 0) {
        roomSettings.delete(room);
        resetWinner(room);
      }
      emitLobbyStats();
    }
    socket.emit("leftRoom");
  });

  socket.on("typing", (user) => {
    console.log(`[INFO] User ${user.name} typing in room ${user.room} - Progress: ${user.progress}%`);
    setUser(user);
    const playerList = getUsersInRoom(user.room);
    io.to(user.room).emit("playerList", {
      players: playerList,
      winnerId: getWinner(user.room),
    });
  });

  function createRoom(userName, room, settings) {
    if (!room) {
      console.log("[INFO] Room creation failed: no room name provided");
      return;
    }
    let roomId = room.slice(0, 6);
    socket.join(roomId);
    const normalizedSettings = normalizeRoomSettings(settings);
    roomSettings.set(roomId, normalizedSettings);
    console.log(`[INFO] Room created: ${roomId} by user: ${userName || 'guest'}`);
    socket.emit("roomId", roomId);
    io.to(roomId).emit("roomSettings", normalizedSettings);
    let tempUser = {
      id: socket.id,
      name: userName || `guest`,
      progress: 0,
      speed: 0,
      room: roomId,
    };

    addUser(tempUser);
    const playerList = getUsersInRoom(roomId);
    io.to(roomId).emit("playerList", {
      players: playerList,
      winnerId: getWinner(roomId),
    });
    emitLobbyStats();
  }

  socket.on("getText", (room) => {
    console.log(`[INFO] Fetching new text for room: ${room}`);
    const settings = roomSettings.get(room) || normalizeRoomSettings();
    getText(io, room, settings);
    resetFinishers(room);
    resetWinner(room);
    const playerList = resetUser(room);
    io.to(room).emit("playerList", {
      players: playerList,
      winnerId: getWinner(room),
    });
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
    const settings = roomSettings.get(roomName) || normalizeRoomSettings();
    if (!roomSettings.has(roomName)) {
      roomSettings.set(roomName, settings);
    }
    socket.emit("roomSettings", settings);
    let tempUser = {
      id: socket.id,
      name: userName || `guest${numClients}`,
      progress: 0,
      speed: 0,
      room: roomName,
    };
    addUser(tempUser);
    const playerList = getUsersInRoom(roomName);
    io.to(roomName).emit("playerList", {
      players: playerList,
      winnerId: getWinner(roomName),
    });
    emitLobbyStats();

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
    const playerList = getUsersInRoom(user.room);
    io.to(user.room).emit("playerList", {
      players: playerList,
      winnerId: getWinner(user.room),
    });
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      console.log(`[INFO] User ${user.name} disconnected from room: ${user.room}`);
      const remainingUsers = getUsersInRoom(user.room);
      io.to(user.room).emit("playerList", {
        players: remainingUsers,
        winnerId: getWinner(user.room),
      });
      if (remainingUsers.length === 0) {
        roomSettings.delete(user.room);
        resetWinner(user.room);
      }
      emitLobbyStats();
    } else {
      console.log(`[INFO] Socket ${socket.id} disconnected (user not found)`);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`[INFO] Server running on port ${PORT}`);
  console.log(`[INFO] CORS enabled for: ${JSON.stringify(corsOrigin)}`);
});
