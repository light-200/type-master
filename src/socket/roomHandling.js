import socket from "./socket";
import { playArea } from "../ui/uiElements";
import { getUserData } from "../storage/localstorage";
import { multiplayerMode, isHost } from "../functions/userDefault";
import { getTextSocket } from "../functions/getText";

export async function createRoom() {
  let user = await getUserData();
  socket.emit("createRoom", JSON.stringify(user), socket.id);
  isHost = multiplayerMode = true;
  getTextSocket();
}

export function renderPlayers(playerList) {
  playerList.forEach((player) => {
    let template = `<div class="playerName">${player.name}</div>
          <progress class="playerProgress" value="${player.progress}" max="100"></progress>
          <div class="playerSpeed">${player.speed}</div>`;
    let newPlayer = document.createElement("span");
    newPlayer.innerHTML = template;
    newPlayer.classList.add("player");
    playArea.appendChild(newPlayer);
  });
}

export async function joinRoom(room) {
  let user = await getUserData();
  socket.emit("joinRoom", JSON.stringify(user), room);
}

function clearPlayerArea() {
  while (playArea.firstChild) {
    playArea.firstChild.remove();
  }
}
