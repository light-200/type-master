import setWords,{ spanWrap } from './mainUi';
import start from './start';


const textContainer = document.querySelector(".text");
var text;

// this function is responsible for fetching the text from api
const getText = async () => {
    //call the api here 
    const url = "https://api.quotable.io/random";
    const data = await fetch(url).then(response => response.json()).then(data =>{ return data; } ).catch(error =>console.error(error));
    // console.log(data);
    text = textContainer.innerText = data.content;
    setWords();
    spanWrap(textContainer);
    start(text);
}

export default getText; 
export { text };