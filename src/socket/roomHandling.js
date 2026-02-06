import socket from "./socket";
import { lobbyPlayers, lobbyPlayersWrap, playArea } from "../ui/uiElements";
import { getUserData } from "../storage/localstorage";
import { setIsHost } from "../functions/userDefault";

export async function createRoom() {
  let user = await getUserData();
  socket.emit("createRoom", user ? user.userName : null, socket.id);
  setIsHost(true);
}

export function renderPlayers(playerList) {
  const list = Array.isArray(playerList) ? playerList : [];
  if (list.length === 0) {
    clearPlayerArea();
    clearLobbyPlayers();
    playArea.classList.add("hide");
    if (lobbyPlayersWrap) lobbyPlayersWrap.classList.add("hide");
    return;
  }

  renderTrackPlayers(list);
  renderLobbyPlayers(list);

  playArea.classList.remove("hide");
  if (lobbyPlayersWrap) lobbyPlayersWrap.classList.remove("hide");
}

function renderTrackPlayers(playerList) {
  const existing = new Map();
  Array.from(playArea.children).forEach((child) => {
    if (child.dataset.playerKey) existing.set(child.dataset.playerKey, child);
  });

  const seen = new Set();
  playerList.forEach((player, index) => {
    const key = getPlayerKey(player, index);
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
    nameEl.textContent = getPlayerName(player, index);
    speedEl.textContent = player.speed;

    const progress = Number(player.progress) || 0;
    nameEl.style.left = `${progress}%`;
    nameEl.style.transform = `translateX(-${progress}%)`;
  });

  Array.from(playArea.children).forEach((child) => {
    if (!seen.has(child.dataset.playerKey)) child.remove();
  });
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

function renderLobbyPlayers(playerList) {
  if (!lobbyPlayers) return;

  const existing = new Map();
  Array.from(lobbyPlayers.children).forEach((child) => {
    if (child.dataset.playerKey) existing.set(child.dataset.playerKey, child);
  });

  const seen = new Set();
  playerList.forEach((player, index) => {
    const key = getPlayerKey(player, index);
    seen.add(key);

    let row = existing.get(key);
    if (!row) {
      row = document.createElement("div");
      row.classList.add("lobbyPlayer", "is-new");
      row.dataset.playerKey = key;
      row.innerHTML = `
        <div class="lobbyPlayerProfile">
          <div class="lobbyPlayerAvatar"></div>
          <div class="lobbyPlayerIdentity">
            <div class="lobbyPlayerName"></div>
            <div class="lobbyPlayerTag"></div>
          </div>
        </div>
        <div class="lobbyPlayerStats">
          <div class="lobbyPlayerSpeed"></div>
          <div class="lobbyPlayerProgress"></div>
        </div>
      `;
      lobbyPlayers.appendChild(row);
      requestAnimationFrame(() => {
        row.classList.remove("is-new");
      });
    }

    const name = getPlayerName(player, index);
    const progress = Number(player.progress) || 0;
    const speed =
      player.speed === undefined || player.speed === null ? 0 : player.speed;

    row.querySelector(".lobbyPlayerName").textContent = name;
    row.querySelector(".lobbyPlayerAvatar").textContent = getInitials(name);
    row.querySelector(".lobbyPlayerTag").textContent = getPlayerTag(player, key);
    row.querySelector(".lobbyPlayerSpeed").textContent = `Speed: ${speed}`;
    row.querySelector(".lobbyPlayerProgress").textContent = `Progress: ${Math.round(
      progress
    )}%`;

    if (player.id && player.id === socket.id) {
      row.classList.add("is-self");
    } else {
      row.classList.remove("is-self");
    }
  });

  Array.from(lobbyPlayers.children).forEach((child) => {
    if (!seen.has(child.dataset.playerKey)) child.remove();
  });
}

function clearLobbyPlayers() {
  if (!lobbyPlayers) return;
  while (lobbyPlayers.firstChild) {
    lobbyPlayers.firstChild.remove();
  }
}

function getPlayerKey(player, index) {
  const keyBase = player.id || player.name || `player-${index}`;
  return String(keyBase);
}

function getPlayerName(player, index) {
  return player.name || `player${index + 1}`;
}

function getInitials(name) {
  const safeName = String(name || "").trim();
  if (!safeName) return "??";
  const parts = safeName.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getPlayerTag(player, fallbackKey) {
  if (player.id) return `#${player.id.slice(0, 4)}`;
  if (player.name) return `#${String(player.name).slice(0, 4)}`;
  return `#${String(fallbackKey).slice(0, 4)}`;
}
