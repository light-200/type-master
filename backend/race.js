import { getUsersInRoom } from "./user.js";

const finishers = new Map();
const winners = new Map();

export function setFinishers(user, io) {
  let players = finishers.get(user.room);
  if (players) players.push(user);
  else players = new Array(user);

  if (!winners.has(user.room)) {
    winners.set(user.room, user.id);
  }

  let totalUsers = getUsersInRoom(user.room);
  console.log(`[INFO] Finisher count: ${players.length}/${totalUsers.length} in room ${user.room}`);

  if (totalUsers.length > 3) {
    if (players.length >= totalUsers - 2) {
      console.log(`[INFO] Race ending in room ${user.room} - Majority finished`);
      resetFinishers(user.room);
      io.to(user.room).emit("raceEndTimer");
      return;
    }
  } else {
    if (players.length > totalUsers.length / 2) {
      console.log(`[INFO] Race ending in room ${user.room} - Half or more finished`);
      resetFinishers(user.room);
      io.to(user.room).emit("raceEndTimer");
      return;
    }
  }

  finishers.set(user.room, players);
}

export function getFinishers(room) {
  return finishers.get(room);
}

export function getWinner(room) {
  return winners.get(room) || null;
}

export function resetFinishers(room) {
  finishers.set(room, []);
}

export function resetWinner(room) {
  winners.delete(room);
}
