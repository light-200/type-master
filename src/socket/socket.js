import { io } from "socket.io-client";
import handlePopup from "../functions/handlePopup";
import { joinRoomForm, roomHeader, textContainer } from "../ui/uiElements";
import { isHost, multiplayerMode } from "../functions/userDefault";
import { getTextSocket, setTextSocket } from "../functions/getText";
import { renderPlayers } from "./roomHandling";

const socket = io("http://localhost:3000");

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
});

socket.on("unknownCode", () => {
  handlePopup("not a valid room 😞", 1000);
});
socket.on("tooManyPlayers", () => {
  handlePopup("room is full 😞", 1000);
});

socket.on("playerList", (playerList) => {
  if (playerList.length > 1 && isHost) {
    let count = 5;
    let showTimer = setInterval(() => {
      handlePopup(`text in ${count--} seconds`, 500);
    }, 1000);
    setTimeout(() => {
      getTextSocket();
      clearInterval(showTimer);
    }, 5000);
  }
  let index = playerList.findIndex((user) => user.id === socket.id);
  if (index !== -1) {
    let you = playerList.slice(index, 1)[0];
  }
  renderPlayers(playerList);
});

socket.on("newText", (data) => {
  setTextSocket(data);
});

export default socket;
