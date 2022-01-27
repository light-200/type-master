import socket from "./socket";
import { playArea } from "../ui/uiElements";
import { getUserData } from "../storage/localstorage";
import { multiplayerMode } from "../functions/userDefault";

export async function createRoom() {
  let user = await getUserData();
  socket.emit("createRoom", JSON.stringify(user), socket.id);
  multiplayerMode = true;
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

function clearPlayerArea() {
  while (playArea.firstChild) {
    playArea.firstChild.remove();
  }
}
