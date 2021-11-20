import {text} from './getText';
import handleProfile from './handleProfile';
import { getData } from './localstorage';
import { signupForm } from './script';
const words = document.querySelector(".words");
const profile = document.querySelector(".profile")
const dragProfile = document.querySelector('.profile>.top>.move')
const profileButton = document.querySelector(".profileBtn")
const stats = document.querySelector('.profile>.routs>.stats')
const signupBtn = document.querySelector('.profile>.top>.options>.signupBtn')

var totalWords;

//sets total word value
const setWords = (typedWords = 0) => {
    let whitespace = / /g,result,indices = [];
    while(result = whitespace.exec(text)){
        indices.push(result.index);
    }
    totalWords = indices.length + 1;
    words.innerText = `${totalWords}/${typedWords}`;
}

//wraps all words in a span tag
const spanWrap = (textContainer) => {
    let newArr = [];
    for(let i=0; i<text.length; i++){
        newArr.push(`<span>${text[i]}</span>`);
    };
    let newText = newArr.join('');
    textContainer.innerHTML = newText;
    
}

profileButton.addEventListener('click',()=>{
    profile.classList.toggle('hide')
    if(getData()){
        signupBtn.innerText = 'update'
    }
})

//event listener for close button on the profile window
profile.addEventListener('click',(e)=> {
    e.target.classList.contains('close') && profile.classList.toggle('hide');
})

dragProfile.addEventListener('drag',(e)=>{
    let element =  profile;
    element.style.filter = 'brightness(.7)';
})

dragProfile.addEventListener('dragend',(e)=>{
    let element =  profile;
    element.style.filter = 'brightness(1)';
    moveElement(e,element);
})

const handleStats = (user) => {
    if (user){
        stats.childNodes.forEach((element)=>{
            if(!element.classList){
                return
            } else if(element.classList.contains('name')){
                element.innerText = user.userName ;
            } else if(element.classList.contains('topSpeed')){
                element.innerText = 'topspeed: ' + user.topSpeed; 
            }
        })
        handleProfile(stats)
    } else {
        handleProfile(signupForm)
    }
    return user;
}

const moveElement = (e,element)=>{
    element.style.left =  (e.pageX - 20) +'px';
    element.style.top =  (e.pageY - 20)+'px';
}

export default setWords;
export {spanWrap , totalWords , moveElement ,handleStats};

