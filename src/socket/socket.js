import { io } from "socket.io-client";
import handlePopup from "../functions/handlePopup";
import {
  joinRoomForm,
  mpContainer,
  roomHeader,
  textContainer,
} from "../ui/uiElements";
import { isHost, multiplayerMode } from "../functions/userDefault";
import { getTextSocket, setTextSocket } from "../functions/getText";
import { renderPlayers } from "./roomHandling";

const socket = io(process.env.SERVER_LINK || "http://localhost:3000");

socket.on("connect", () => {
  console.log("connection established");
});

socket.on("disconnect", () => {
  console.log("you are disconnected");
});

socket.on("roomId", (roomId) => {
  joinRoomForm.classList.add("hide");
  roomHeader.classList.remove("hide");
  roomHeader.children[1].innerText = roomId;
  multiplayerMode = true;
  textContainer.innerText = "...";
  !isHost && closeMpArea();
});

socket.on("unknownCode", () => {
  handlePopup("not a valid room 😞", 1000);
});
socket.on("tooManyPlayers", () => {
  handlePopup("room is full 😞", 1000);
});

let you;
socket.on("playerList", (playerList) => {
  let index = playerList.findIndex((user) => user.id == socket.id);
  if (index !== -1) {
    you = playerList[index];
  }
  renderPlayers(playerList);
});

socket.on("newText", (data) => {
  setTextSocket(data);
});

socket.on("textTimer", () => {
  let count = 5;
  let showTimer = setInterval(() => {
    handlePopup(`text in ${count--} seconds`, 500);
  }, 1000);
  setTimeout(() => {
    isHost && getTextSocket();
    clearInterval(showTimer);
  }, 5000);
});

export function typing(progress, speed) {
  if (speed < 150) socket.emit("typing", { ...you, progress, speed });
  else {
    socket.emit("typing", { ...you, progress, speed: "😱" });
  }
}

function closeMpArea() {
  mpContainer.classList.add("scale0");
  mpContainer.classList.add("fadeOut");
  setTimeout(() => {
    mpContainer.classList.add("hide");
  }, 500);
}

export default socket;
