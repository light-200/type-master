import setWords, { findTotalWords, spanWrap } from "../ui/uiListeners";
import start from "./start";
import { roomId, textContainer } from "../ui/uiElements";
import { getLocalData, getUserData } from "../storage/localstorage";
import handlePopup from "./handlePopup";
import socket, { cancleTimers } from "../socket/socket";
import { isHost } from "./userDefault";

var text;
let callsCount = 0;

const getText = async () => {
  const user = await getUserData();
  if (!user) {
    callsCount++;
    if (callsCount == 5 || callsCount == 15) {
      handlePopup("Login to save data 🙂", 10000);
    }
  }

  const url = "https://api.quotable.io/random";
  let data = await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.content;
    })
    .catch((error) => {
      console.error(error.message);
      textContainer.innerText = "check your network connection";
    });

  //for no punctuation mode
  let userPreferences = getLocalData();
  if (!userPreferences.punctuationMode) {
    data = data.replace(/[^ \w]/g, "");
  }

  if (userPreferences.smallCaseMode) {
    data = data.toLowerCase();
  }

  text = textContainer.innerText = data;
  findTotalWords(text);
  setWords();
  spanWrap(textContainer);
  start(text);
};

export async function getTextSocket() {
  isHost && socket.emit("getText", roomId.innerText);
  cancleTimers();
}

export async function setTextSocket(data) {
  text = textContainer.innerText = data;
  findTotalWords(text);
  setWords();
  spanWrap(textContainer);
  start(text);
}

export default getText;
export { text };
