import socket from "./socket";
import { lobbyPlayers, lobbyPlayersWrap, playArea } from "../ui/uiElements";
import { getLocalData, getUserData } from "../storage/localstorage";
import { normalizeWordCount, setIsHost } from "../functions/userDefault";
import handlePopup from "../functions/handlePopup";

let winnerAnnounced = false;
let lastWinnerKey = null;

const crownSvg =
  '<svg class="playerCrown" viewBox="0 0 64 44" aria-hidden="true" focusable="false">' +
  '<path d="M6 34L12 12L26 28L32 8L38 28L52 12L58 34Z" />' +
  '<rect x="8" y="34" width="48" height="8" rx="3" />' +
  '<circle cx="12" cy="12" r="3.5" />' +
  '<circle cx="32" cy="8" r="3.5" />' +
  '<circle cx="52" cy="12" r="3.5" />' +
  "</svg>";

export async function createRoom() {
  let user = await getUserData();
  const localData = getLocalData() || {};
  const wordCount = normalizeWordCount(localData.wordCount);
  const punctuationMode =
    typeof localData.punctuationMode === "boolean"
      ? localData.punctuationMode
      : true;
  const smallCaseMode =
    typeof localData.smallCaseMode === "boolean"
      ? localData.smallCaseMode
      : false;
  socket.emit("createRoom", user ? user.userName : null, socket.id, {
    wordCount,
    punctuationMode,
    smallCaseMode,
  });
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

  const winnerKey = getWinnerKey(list);
  renderTrackPlayers(list, winnerKey);
  renderLobbyPlayers(list, winnerKey);
  announceWinnerIfAny(list, winnerKey);

  playArea.classList.remove("hide");
  if (lobbyPlayersWrap) lobbyPlayersWrap.classList.remove("hide");
}

function renderTrackPlayers(playerList, winnerKey) {
  const existing = new Map();
  Array.from(playArea.children).forEach((child) => {
    if (child.dataset.playerKey) existing.set(child.dataset.playerKey, child);
  });

  const seen = new Set();
  playerList.forEach((player, index) => {
    const key = getPlayerKey(player, index);
    seen.add(key);

    let row = existing.get(key);
    const needsUpgrade = row && !row.querySelector(".playerNameText");
    if (!row || needsUpgrade) {
      if (!row) {
        row = document.createElement("span");
        row.classList.add("player", "is-new");
        row.dataset.playerKey = key;
        playArea.appendChild(row);
      }
      row.innerHTML =
        '<div class="playerProgress"><div class="playerName">' +
        crownSvg +
        '<span class="playerNameText"></span></div></div><div class="playerSpeed"></div>';
      requestAnimationFrame(() => {
        row.classList.remove("is-new");
      });
    }

    row.classList.toggle("is-winner", key === winnerKey);

    const nameContainer = row.querySelector(".playerName");
    const nameEl = row.querySelector(".playerNameText");
    const speedEl = row.querySelector(".playerSpeed");
    const playerName = getPlayerName(player, index);
    if (nameEl) {
      nameEl.textContent = playerName;
    } else if (nameContainer) {
      nameContainer.textContent = playerName;
    }
    speedEl.textContent = player.speed;

    const progress = Number(player.progress) || 0;
    if (nameContainer) {
      nameContainer.style.left = `${progress}%`;
      nameContainer.style.transform = `translateX(-${progress}%)`;
    }
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

function renderLobbyPlayers(playerList, winnerKey) {
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
    const needsUpgrade = row && !row.querySelector(".lobbyPlayerNameText");
    if (!row || needsUpgrade) {
      if (!row) {
        row = document.createElement("div");
        row.classList.add("lobbyPlayer", "is-new");
        row.dataset.playerKey = key;
        lobbyPlayers.appendChild(row);
      }
      row.innerHTML = `
        <div class="lobbyPlayerProfile">
          <div class="lobbyPlayerAvatar"></div>
          <div class="lobbyPlayerIdentity">
            <div class="lobbyPlayerName">${crownSvg}<span class="lobbyPlayerNameText"></span></div>
            <div class="lobbyPlayerTag"></div>
          </div>
        </div>
        <div class="lobbyPlayerStats">
          <div class="lobbyPlayerSpeed"></div>
          <div class="lobbyPlayerProgress"></div>
        </div>
      `;
      requestAnimationFrame(() => {
        row.classList.remove("is-new");
      });
    }

    const name = getPlayerName(player, index);
    const progress = Number(player.progress) || 0;
    const speed =
      player.speed === undefined || player.speed === null ? 0 : player.speed;

    row.classList.toggle("is-winner", key === winnerKey);
    const nameEl = row.querySelector(".lobbyPlayerNameText");
    if (nameEl) {
      nameEl.textContent = name;
    } else {
      row.querySelector(".lobbyPlayerName").textContent = name;
    }
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

function announceWinnerIfAny(playerList, winnerKey) {
  if (!winnerKey || winnerAnnounced) return;

  const winnerIndex = playerList.findIndex(
    (player, index) => getPlayerKey(player, index) === winnerKey
  );
  const winner = winnerIndex === -1 ? null : playerList[winnerIndex];
  if (!winner) return;

  if (lastWinnerKey && lastWinnerKey === winnerKey) return;

  lastWinnerKey = winnerKey;
  winnerAnnounced = true;
  handlePopup(`${getPlayerName(winner, winnerIndex)} wins!`, 2500);
}

function getWinnerKey(playerList) {
  const winnerIndex = playerList.findIndex(
    (player) => (Number(player.progress) || 0) >= 100
  );
  if (winnerIndex === -1) return null;
  return getPlayerKey(playerList[winnerIndex], winnerIndex);
}

export function resetWinnerState() {
  winnerAnnounced = false;
  lastWinnerKey = null;
}
