import setWords, { spanWrap } from '../ui/uiListeners';
import start from './start';
import { textContainer } from '../ui/uiElements';
import { getLocalData } from '../storage/localstorage';

var text;

// this function is responsible for fetching the text from api
const getText = async () => {
    //call the api here 
    const url = "https://api.quotable.io/random";
    let data = await fetch(url)
        .then(response => response.json())
        .then(data => { return data.content; })
        .catch(error => {
            console.error(error.message)
            textContainer.innerText = "check your network connection"
        });
    // console.log(data,'before');

    //for no punctuation mode 
    let userPreferences = getLocalData();
    if(!userPreferences.punctuationMode){
        data = data.replace(/[^ \w]/g,'')
    }

    if(userPreferences.smallCaseMode){
        data = data.toLowerCase()
    }
    // console.log(data,'after');
    text = textContainer.innerText = data;
    setWords();
    spanWrap(textContainer);
    start(text);
}

export default getText;
export { text};