import getText, { getTextSocket, setTextSocket } from "./getText";
import {
  getUserData,
  setUserData,
  setLocalData,
} from "../storage/localstorage";
import { containerInfo, speedIndicator } from "../ui/uiElements";
import { isHost, multiplayerMode } from "./userDefault";
var speed;

// this function is responsible for calculating the speed
const speedCalc = async (totalWords, seconds) => {
  var minutes = seconds / 60;
  let tempSpeed = totalWords / minutes;
  speed = Math.floor(tempSpeed);
  speedIndicator.innerText = speed;

  let user = await getUserData();

  if (user && speed > user.topSpeed) {
    user = { ...user, topSpeed: speed };
    console.log("setUserData called");
    setUserData(user);
  } else if (user) {
    setLocalData({ ...user, lastSpeed: speed });
  }

  if (!multiplayerMode && !isHost) {
    // add a function to change the text here
    containerInfo.classList.toggle("hide");
    containerInfo.classList.toggle("fadeOut");
    setTimeout(() => {
      getText();
      containerInfo.classList.toggle("fadeOut");
      setTimeout(() => {
        containerInfo.classList.toggle("hide");
      }, 500);
    }, 500);
  }
};

function setSpeed(speed) {
  speed ? (speedIndicator.innerText = speed) : speed;
}

export default speedCalc;
export { setSpeed };
