const textContainer = document.querySelector(".text");
const words = document.querySelector(".words");
const speed = document.querySelector(".speed");
var totalWords = 0;
var text = "";

const getText = async () => {
    //call the api here 
    const url = "https://api.quotable.io/random";
    const data = await fetch(url).then(response => response.json()).then(data =>{ return data; } ).catch(error =>console.error(error));
    // console.log(data);
    text = textContainer.innerText = data.content;
    setWords();
    spanWrap();
    start();
}

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

//wraps all words in a span tag
const spanWrap = () => {
    let newArr = [];
    for(let i=0; i<text.length; i++){
        newArr.push(`<span>${text[i]}</span>`);
    };
    let newText = newArr.join('');
    textContainer.innerHTML = newText;
}

//sets total word value
const setWords = (typedWords = 0) => {
    let whitespace = / /g,result,indices = [];
    while(result = whitespace.exec(text)){
        indices.push(result.index);
    }
    totalWords = indices.length + 1;

    words.innerText = `${totalWords}/${typedWords}`;
}
// listents to the keyboard
const start = () => {
    let firstCall = true;
    let tempText = text;
    let index = 0;
    let typedWords = 0;
    let start , end;
    let Words = document.querySelectorAll(".text>span");
    document.addEventListener('keydown' , (e)=>{
        
        if(e.key === tempText[0]){
            if(firstCall){
              start =  new Date().getTime();
            //   console.log(start)
              firstCall = false;
            }
            tempText = tempText.substr(1);

           
            Words[index].style.color = "#ffd549";
            // console.log(tempText[0]);  gives the next word to type
            // console.log(Words[index]); gives the current element in html
            
            if(tempText[0]== ' ' || tempText[0] == null){
                ++typedWords;
                setWords(typedWords);
            }

            if(index == text.length - 1){
                end = new Date().getTime();
               speedCalc(totalWords,(end-start)/1000)
            }
            
            index++;
        } else {
            if(Words[index + 1] != null){
                Words[index].style.color = "#ff324d";
            }
        }
    })

}

getText();