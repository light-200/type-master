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
  if (!playerList || playerList.length === 0) {
    clearPlayerArea();
    playArea.classList.add("hide");
    return;
  }

  const existing = new Map();
  Array.from(playArea.children).forEach((child) => {
    if (child.dataset.playerKey) existing.set(child.dataset.playerKey, child);
  });

  const seen = new Set();
  playerList.forEach((player, index) => {
    const keyBase = player.id || player.name || `player-${index}`;
    const key = String(keyBase);
    seen.add(key);

    let row = existing.get(key);
    if (!row) {
      row = document.createElement("span");
      row.classList.add("player", "is-new");
      row.dataset.playerKey = key;
      row.innerHTML =
        '<div class="playerProgress"><div class="playerName"></div></div><div class="playerSpeed"></div>';
      playArea.appendChild(row);
      requestAnimationFrame(() => {
        row.classList.remove("is-new");
      });
    }

    const nameEl = row.querySelector(".playerName");
    const speedEl = row.querySelector(".playerSpeed");
    nameEl.textContent = player.name || "player";
    speedEl.textContent = player.speed;

    const progress = Number(player.progress) || 0;
    nameEl.style.left = `${progress}%`;
    nameEl.style.transform = `translateX(-${progress}%)`;
  });

  Array.from(playArea.children).forEach((child) => {
    if (!seen.has(child.dataset.playerKey)) child.remove();
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
