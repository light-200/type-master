import socket from "./socket";
import { playArea } from "../ui/uiElements";
import { getUserData } from "../storage/localstorage";
import { setIsHost } from "../functions/userDefault";

export async function createRoom() {
  let user = await getUserData();
  socket.emit("createRoom", user ? user.userName : null, socket.id);
  setIsHost(true);
}

export function renderPlayers(playerList) {
  clearPlayerArea();
  if (!playerList) return;
  playerList.forEach((player) => {
    let template = `<div class="playerProgress"><div class="playerName">${player.name}</div></div>
          <div class="playerSpeed">${player.speed}</div>`;
    let newPlayer = document.createElement("span");
    newPlayer.innerHTML = template;
    newPlayer.children[0].firstChild.style.left = player.progress + "%";
    newPlayer.children[0].firstChild.style.transform =
      "translateX(-" + player.progress + "%)";
    newPlayer.classList.add("player");
    playArea.appendChild(newPlayer);
  });
  playArea.classList.remove("hide");
}

export async function joinRoom(room) {
  let user = await getUserData();
  socket.emit("joinRoom", user ? user.userName : null, room);
}

function clearPlayerArea() {
  while (playArea.firstChild) {
    playArea.firstChild.remove();
  }
}
