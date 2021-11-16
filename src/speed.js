import getText from "./getText";

const speed = document.querySelector(".speed");

// this function is responsible for calculating the speed 
const speedCalc = (totalWords, seconds) =>{
    var minutes = seconds.toPrecision(2) / 60;
    // console.log( totalWords , " " , minutes.toPrecision(2))
    let tempSpeed = totalWords / minutes;
    speed.innerText = Math.floor(tempSpeed.toPrecision(3));

    // add a function to change the text here 
    setTimeout(() => {
        getText();
    }, 500);
}

export default speedCalc;