import { io } from "socket.io-client";
import handlePopup from "../functions/handlePopup";
import {
  joinRoomForm,
  mpContainer,
  roomSettings,
  roomSettingsList,
  roomHeader,
  textContainer,
} from "../ui/uiElements";
import {
  isHost,
  setIsHost,
  setMultiplayerMode,
} from "../functions/userDefault";
import { getTextSocket, setTextSocket } from "../functions/getText";
import { renderPlayers, resetWinnerState } from "./roomHandling";
import { setStart } from "../functions/start";

const env = import.meta.env;
const CONSTANTS = {
  DEV_SERVER_URL: "http://localhost:3000",
  IS_DEVELOPMENT: env.VITE_DEVELOPMENT_MODE === "true",
};

var linkToSocket;
if (CONSTANTS.IS_DEVELOPMENT) {
  linkToSocket = CONSTANTS.DEV_SERVER_URL;
} else {
  linkToSocket = env.VITE_SERVER_LINK;
}

const socket = io(linkToSocket);

socket.on("connect", () => {
  console.log("connection established");
});

socket.on("disconnect", () => {
  setIsHost(false);
  setMultiplayerMode(false);
  console.log("you are disconnected");
});

socket.on("roomId", (roomId) => {
  joinRoomForm.classList.add("hide");
  roomHeader.classList.remove("hide");
  roomHeader.children[1].innerText = roomId;
  setMultiplayerMode(true);
  textContainer.innerText = "...";
  !isHost && closeMpArea();
});

socket.on("roomSettings", (settings) => {
  renderRoomSettings(settings);
});

socket.on("unknownCode", () => {
  handlePopup("not a valid room 😞", 1000);
});
socket.on("tooManyPlayers", () => {
  handlePopup("room is full 😞", 1000);
});

let you, showTimer, newTextTimeout;

socket.on("playerList", (playerList) => {
  let index = playerList.findIndex((user) => user.id == socket.id);
  if (index !== -1) {
    you = playerList[index];
  }
  renderPlayers(playerList);
});

socket.on("newText", (data) => {
  cancleTimers();
  resetWinnerState();
  let count = 3;
  let signs = ["🍉", "🍊🍋", "🍈🍇🍑"];
  textContainer.innerText = "...";
  showTimer = setInterval(() => {
    handlePopup(`${signs[--count]}`, 500);
    if (count == 0) clearInterval(showTimer);
  }, 1000);
  newTextTimeout = setTimeout(() => {
    setTextSocket(data);
    isHost && socket.emit("raceStart", you.room);
  }, 4000);
});

socket.on("textTimer", () => {
  newTextWithTimer(5, "new text in");
});

socket.on("raceStart", () => {
  console.log("race started");
  resetWinnerState();
  setStart(new Date().getTime());
});

socket.on("raceEndTimer", () => {
  newTextWithTimer(10, "race ends in");
});

export function typing(progress, speed) {
  if (speed < 150) socket.emit("typing", { ...you, progress, speed });
  else {
    socket.emit("typing", { ...you, progress, speed: "😱" });
  }
}

export function raceFinished() {
  socket.emit("finished", you);
}

export function cancleTimers() {
  clearTimeout(newTextTimeout);
  clearInterval(showTimer);
}

function newTextWithTimer(time, message) {
  let count = time;
  showTimer = setInterval(() => {
    handlePopup(`${message} ${count--} seconds`, 500);
    if (count <= 0) clearInterval(showTimer);
  }, 1000);
  newTextTimeout = setTimeout(() => {
    isHost && getTextSocket();
  }, time * 1000);
}

function closeMpArea() {
  mpContainer.classList.add("scale0");
  mpContainer.classList.add("fadeOut");
  setTimeout(() => {
    mpContainer.classList.add("hide");
  }, 500);
}

function renderRoomSettings(settings) {
  if (!roomSettings || !roomSettingsList) return;
  const chips = [];
  if (settings && settings.wordCount) {
    chips.push(`${settings.wordCount} words`);
  }
  if (settings && settings.punctuationMode !== undefined) {
    chips.push(
      settings.punctuationMode ? "Punctuation: on" : "Punctuation: off"
    );
  }
  if (settings && settings.smallCaseMode !== undefined) {
    chips.push(settings.smallCaseMode ? "Case: lowercase" : "Case: mixed");
  }

  roomSettingsList.innerHTML = chips
    .map((chip) => `<span class="roomSettingChip">${chip}</span>`)
    .join("");

  if (chips.length > 0) {
    roomSettings.classList.remove("hide");
  } else {
    roomSettings.classList.add("hide");
  }
}

export default socket;
