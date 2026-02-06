import setWords, { findTotalWords, spanWrap } from "../ui/uiListeners";
import start from "./start";
import { roomId, textContainer } from "../ui/uiElements";
import { getLocalData, getUserData } from "../storage/localstorage";
import handlePopup from "./handlePopup";
import socket, { cancleTimers } from "../socket/socket";
import { isHost } from "./userDefault";

var text;
let callsCount = 0;

const CONSTANTS = {
  QUOTE_API_URL: process.env.QUOTE_API_URL || "https://api.quotable.io/random",
  LOGIN_REMINDER_CALLS: [5, 15],
  LOGIN_REMINDER_MESSAGE: "Login to save data 🙂",
  LOGIN_REMINDER_DURATION: 10000,
  NETWORK_ERROR_MESSAGE: "check your network connection",
};

const getText = async () => {
  const user = await getUserData();
  if (!user) {
    callsCount++;
    if (CONSTANTS.LOGIN_REMINDER_CALLS.includes(callsCount)) {
      handlePopup(CONSTANTS.LOGIN_REMINDER_MESSAGE, CONSTANTS.LOGIN_REMINDER_DURATION);
    }
  }

  const url = CONSTANTS.QUOTE_API_URL;
  let data = await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.content;
    })
    .catch((error) => {
      console.error(error.message);
      textContainer.innerText = CONSTANTS.NETWORK_ERROR_MESSAGE;
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
