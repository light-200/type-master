import socket, { raceFinished, typing } from "../socket/socket";
import setWords, { totalWords } from "../ui/uiListeners";
import speedCalc from "./speed";
import { multiplayerMode } from "./userDefault";

let start, end;
// listents to the keyboard
export default (text) => {
  let firstCall = true;
  // this tempText will be reduced by one word as we type the word
  let tempText = text;
  let index = 0;
  let typedWords = 0;
  let typedChars = 0;
  let totalChars = text.length;
  let errorCount = 0;

  let Words = document.querySelectorAll(".text>span");
  Words[index].classList.add("blink");

  document.addEventListener("keypress", (e) => {
    if (e.key === tempText[0]) {
      if (firstCall && !multiplayerMode) {
        start = new Date().getTime();
        firstCall = false;
      }
      typedChars++;

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

        let progress = Math.ceil((typedWords / totalWords) * 100);
        let seconds = new Date().getTime();
        seconds = (seconds - start) / 1000;
        var minutes = seconds / 60;
        let tempSpeed = typedChars / 5 / minutes;
        let speed = Math.floor(tempSpeed);
        multiplayerMode && typing(progress, speed);
      }

      if (index == text.length - 1) {
        end = new Date().getTime();
        start = 0;
        speedCalc(totalChars / 5, (end - start) / 1000);
        multiplayerMode && raceFinished();
      }

      index++;
    } else {
      if (Words[index] != null) {
        Words[index].classList.add("wrongWord");
        errorCount++;
      }
    }
  });
};

export function setStart(time) {
  start = time;
}
