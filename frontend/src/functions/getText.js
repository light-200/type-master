import setWords, { findTotalWords, spanWrap } from "../ui/uiListeners";
import start from "./start";
import { roomId, textContainer } from "../ui/uiElements";
import { getLocalData, getUserData } from "../storage/localstorage";
import handlePopup from "./handlePopup";
import socket, { cancleTimers } from "../socket/socket";
import { isHost, normalizeWordCount } from "./userDefault";

var text;
let callsCount = 0;

const env = import.meta.env;
const isDevelopment = env.VITE_DEVELOPMENT_MODE === "true";

const CONSTANTS = {
  SERVER_URL: isDevelopment
    ? "http://localhost:3000"
    : env.VITE_SERVER_LINK || "http://localhost:3000",
  TEXT_API_ENDPOINT: "/api/text",
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

  const userPreferences = getLocalData() || {};
  const wordCount = normalizeWordCount(userPreferences.wordCount);
  const url = `${CONSTANTS.SERVER_URL}${CONSTANTS.TEXT_API_ENDPOINT}?words=${wordCount}`;
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
  if (userPreferences && userPreferences.punctuationMode === false) {
    data = data.replace(/[^ \w]/g, "");
  }

  if (userPreferences && userPreferences.smallCaseMode === true) {
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
