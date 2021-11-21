import setWords from './mainUi';
import speedCalc from './speed';
import { totalWords } from "./mainUi";

// listents to the keyboard
export default (text) => {
    let firstCall = true;
    // this tempText will be reduced by one word as we type the word 
    let tempText = text;
    let index = 0;
    let typedWords = 0;
    let start , end;
    let Words = document.querySelectorAll(".text>span");
    Words[index].classList.add('blink')
    document.addEventListener('keypress' , (e)=>{
        
        if(e.key === tempText[0]){
            if(firstCall){
              start =  new Date().getTime();
            //   console.log(start)
              firstCall = false;
            }
            tempText = tempText.substr(1);

           
            Words[index].style.color = "#ffd549";
            
            Words[index].classList.remove('blink')
            
            if(index<text.length - 1){
                Words[index+1].classList.add('blink')
            }
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
            if(Words[index] != null){
                Words[index].style.color = "#ff324d";
            }
        }
    })

}

