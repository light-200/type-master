import { io } from "socket.io-client";
import { joinRoomForm, roomHeader } from "../ui/uiElements";

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
});

export default socket;
