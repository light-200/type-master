import { getUsersInRoom } from "./user.js";

const finishers = new Map();

export function setFinishers(user, io) {
  let players = finishers.get(user.room);
  if (players) players.push(user);
  else players = new Array(user);

  let totalUsers = getUsersInRoom(user.room);

  if (totalUsers.length > 3) {
    if (players.length >= totalUsers - 2) {
      resetFinishers(user.room);
      io.to(user.room).emit("raceEndTimer");
      return;
    }
  } else {
    if (players.length > totalUsers.length / 2) {
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

export function resetFinishers(room) {
  finishers.set(room, []);
}
