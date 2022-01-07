import getText from "./getText";
import { getUserData, setUserData, setUserTheme } from "../storage/localstorage";
import { speedIndicator } from "../ui/uiElements";



var speed;

// this function is responsible for calculating the speed 
const speedCalc = async (totalWords, seconds) => {
    var minutes = seconds.toPrecision(2) / 60;
    // console.log( totalWords , " " , minutes.toPrecision(2))
    let tempSpeed = totalWords / minutes;
    speed = Math.floor(tempSpeed.toPrecision(3));
    speedIndicator.innerText = speed;

    let user = await getUserData();

    if (user && speed > user.topSpeed) {
        user = { ...user, topSpeed: speed };
        console.log('setUserData called');
        setUserData(user)
    } else if (user) {
        setUserTheme({ ...user, lastSpeed: speed })
    }

    // add a function to change the text here 
    setTimeout(() => {
        getText();
    }, 500);
}

function setSpeed(speed) {
    // console.log(speed)
    speed ? speedIndicator.innerText = speed : speed;
    // console.log("set speed called with ", speed);
}

export default speedCalc;
export { setSpeed };