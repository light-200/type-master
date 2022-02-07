import socket, { raceFinished, typing } from "../socket/socket";
import setWords, { totalWords } from "../ui/uiListeners";
import speedCalc from "./speed";
import { multiplayerMode } from "./userDefault";

let firstCall;
// this tempText will be reduced by one word as we type the word
let text, tempText, totalChars, start, end, Words;
let index, typedWords, errorCount;

export default (t) => {
  firstCall = true;
  text = t;
  tempText = text;
  totalChars = text.length;
  index = typedWords = errorCount = 0;
  Words = document.querySelectorAll(".text>span");
  Words[index].classList.add("blink");
};

function handleInput(e) {
  if (!tempText) return;
  if (e.key === tempText[0]) {
    if (firstCall && !multiplayerMode) {
      start = new Date().getTime();
      firstCall = false;
    }
    let typedChars = index + 1;

    tempText = tempText.substr(1);

    Words[index].classList.add("correctWord");

    Words[index].classList.remove("blink");

    if (index < text.length - 1) {
      Words[index + 1].classList.add("blink");
    }

    // console.log(tempText[0]);  gives the next word to type
    // console.log(Words[index]); gives the current element in html

    if (tempText[0] == " " || tempText[0] == null) {
      ++typedWords;
      setWords(typedWords);

      let progress = Math.floor((typedWords / totalWords) * 100);
      let seconds = new Date().getTime();
      seconds = (seconds - start) / 1000;
      var minutes = seconds / 60;
      let tempSpeed = typedChars / 5 / minutes;
      let speed = Math.floor(tempSpeed);
      multiplayerMode && typing(progress, speed);
    }

    if (index == text.length - 1) {
      end = new Date().getTime();
      speedCalc(totalChars / 5, (end - start) / 1000);
      multiplayerMode && raceFinished();
      typedChars = 0;
      typedWords = 0;
    }
    index++;
  } else {
    if (Words[index] != null) {
      Words[index].classList.add("wrongWord");
      errorCount++;
    }
  }
}

function setStart(time) {
  start = time;
}

export { setStart, handleInput };
