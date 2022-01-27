import { playArea } from "../ui/uiElements";

export function createRoom() {
  clearPlayerArea();
  renderPlayers();
  playArea.classList.remove("hide");
}

export function renderPlayers() {
  let playerList = [{ name: "light", progress: 50, speed: 30 }];
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
