import socket from "./socket";
import { playArea } from "../ui/uiElements";
import { getUserData } from "../storage/localstorage";
import { isHost } from "../functions/userDefault";

export async function createRoom() {
  let user = await getUserData();
  socket.emit("createRoom", user ? user.userName : null, socket.id);
  isHost = true;
}

export function renderPlayers(playerList) {
  clearPlayerArea();
  if (!playerList) return;
  playerList.forEach((player) => {
    let template = `<div class="playerName">${player.name}</div>
          <progress class="playerProgress" value="${player.progress}" max="100"></progress>
          <div class="playerSpeed">${player.speed}</div>`;
    let newPlayer = document.createElement("span");
    newPlayer.innerHTML = template;
    newPlayer.classList.add("player");
    playArea.appendChild(newPlayer);
  });
  playArea.classList.remove("hide");
}

export async function joinRoom(room) {
  let user = await getUserData();
  socket.emit("joinRoom", user ? user.userName: null, room);
}

function clearPlayerArea() {
  while (playArea.firstChild) {
    playArea.firstChild.remove();
  }
}
