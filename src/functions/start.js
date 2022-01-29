import { typing } from "../socket/socket";
import setWords, { totalWords } from "../ui/uiListeners";
import speedCalc from "./speed";
import { multiplayerMode } from "./userDefault";

// listents to the keyboard
export default (text) => {
  let firstCall = true;
  // this tempText will be reduced by one word as we type the word
  let tempText = text;
  let index = 0;
  let typedWords = 0;
  let start, end;
  let Words = document.querySelectorAll(".text>span");
  Words[index].classList.add("blink");
  document.addEventListener("keypress", (e) => {
    if (e.key === tempText[0]) {
      if (firstCall) {
        start = new Date().getTime();
        firstCall = false;
      }

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
        var minutes = seconds.toPrecision(2) / 60;
        let tempSpeed = totalWords / minutes;
        let speed = Math.floor(tempSpeed.toPrecision(3));
        multiplayerMode && typing(progress, speed);
      }

      if (index == text.length - 1) {
        end = new Date().getTime();
        speedCalc(totalWords, (end - start) / 1000);
      }

      index++;
    } else {
      if (Words[index] != null) {
        Words[index].classList.add("wrongWord");
      }
    }
  });
};
