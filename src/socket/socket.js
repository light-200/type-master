import { io } from "socket.io-client";
import handlePopup from "../functions/handlePopup";
import { joinRoomForm, roomHeader } from "../ui/uiElements";
import { multiplayerMode } from "../functions/userDefault";
import { getTextSocket } from "../functions/getText";

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
  getTextSocket();
});

socket.on("unknownCode", () => {
  handlePopup("not a valid room 😞", 1000);
});
socket.on("tooManyPlayers", () => {
  handlePopup("room is full 😞", 1000);
});

export default socket;
