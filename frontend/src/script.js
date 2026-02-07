import { authState } from "./firebase/auth";
import { listenData } from "./firebase/firestore";
import getText from "./functions/getText";
import { setSpeed } from "./functions/speed";
import { joinRoom } from "./socket/roomHandling";
import {
  defaultTheme,
  punctuationMode,
  smallCaseMode,
  DEFAULT_WORD_COUNT,
  normalizeWordCount,
} from "./functions/userDefault";
import "@fortawesome/fontawesome-free/js/all";

import { getLocalData, setLocalData } from "./storage/localstorage";

import {
  body,
  mpContainer,
  textOptions,
  themeSelector,
  wordCountSelector,
} from "./ui/uiElements";

export default function userLoggedIn(isLoggedin) {
  return isLoggedin;
}

window.onload = () => {
  if (getLocalData()) {
    let localData = getLocalData();
    let theme = localData.theme;
    if (theme != "dark") {
      body.classList.remove("dark");
      body.classList.add(theme);
    }
    // console.log(theme,themeSelector.options[theme])
    themeSelector.options[theme].selected = true;
    localData.punctuationMode
      ? textOptions.children[0].classList.add("active")
      : textOptions.children[0].classList.remove("active");
    localData.smallCaseMode
      ? textOptions.children[1].classList.add("active")
      : textOptions.children[1].classList.remove("active");
    if (wordCountSelector) {
      const wordCount = normalizeWordCount(localData.wordCount);
      wordCountSelector.value = String(wordCount);
      if (localData.wordCount !== wordCount) {
        setLocalData({ ...localData, wordCount });
      }
    }
    setSpeed(localData.lastSpeed);
  } else {
    setLocalData({
      punctuationMode,
      smallCaseMode,
      theme: defaultTheme,
      wordCount: DEFAULT_WORD_COUNT,
    });
  }

  const roomFromUrl = new URLSearchParams(window.location.search).get("room");
  if (roomFromUrl) {
    const roomValue = String(roomFromUrl).trim();
    if (roomValue) {
      openMpPanel();
      joinRoom(roomValue);
    }
  }
};

function openMpPanel() {
  if (!mpContainer) return;
  if (mpContainer.classList.contains("hide")) {
    mpContainer.classList.remove("hide");
  }
  mpContainer.classList.remove("scale0");
  mpContainer.classList.remove("fadeOut");
}

getText();
authState();
listenData();
