import getText from "./getText";
import { getData, setData } from "./localstorage";

const speedIndicator = document.querySelector(".speed");
var speed;

// this function is responsible for calculating the speed 
const speedCalc = (totalWords, seconds) =>{
    var minutes = seconds.toPrecision(2) / 60;
    // console.log( totalWords , " " , minutes.toPrecision(2))
    let tempSpeed = totalWords / minutes;
    speed = Math.floor(tempSpeed.toPrecision(3));
    speedIndicator.innerText = speed;

    let user = getData()
    if(speed>user.topSpeed){
        user = {...user,topSpeed: speed};
        setData(user)
    }

    // add a function to change the text here 
    setTimeout(() => {
        getText();
    }, 500);
}

export default speedCalc;
export {speed};