import {text} from './getText';
import handleProfile from './handleProfile';
import { getUserData, setUserData } from './localstorage';
import { signupForm } from './script';
const words = document.querySelector(".words");
const profile = document.querySelector(".profile")
const drag = document.querySelectorAll('.windowTop>.move')
const profileButton = document.querySelector(".profileBtn")
const stats = document.querySelector('.profile>.routs>.stats')
const signupBtn = document.querySelector('.windowTop>.options>.signupBtn')
const settingsBtn = document.querySelector('.settingsBtn');
const settings = document.querySelector('.settings');
const closeWinBtn = document.querySelectorAll('.options>.close') 
const theme = document.querySelector('.theme');
const body = document.querySelector('body')

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
    let user = getUserData()
    if(user){
        handleStats(user)
        signupBtn.innerText = 'update'
    }
})

//event listener for close button on the profile window
closeWinBtn.forEach((b)=>{
    b.addEventListener('click',(e)=> {
      let element = e.target.parentElement.parentElement.parentElement;
        element.classList.toggle('hide');
    })
})

drag.forEach((d)=>{
    d.addEventListener('drag',(e)=>{
        let element =  e.target.parentElement.parentElement;
        element.style.filter = 'brightness(.7)';
    })
})

drag.forEach((d)=>{
    d.addEventListener('dragend',(e)=>{
        let element =  e.target.parentElement.parentElement;
        element.style.filter = 'brightness(1)';
        moveElement(e,element);
    })
}
)

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


settingsBtn.addEventListener('click',()=>{
    console.log('it works');
    settings.classList.toggle('hide');
})

const moveElement = (e,element)=>{
    element.style.left =  (e.pageX - 20) +'px';
    element.style.top =  (e.pageY - 20)+'px';
}

theme.addEventListener('click',(e)=>{
    let user = getUserData()
    if(e.target.classList.contains('themeLight')){
        if(body.classList.contains('light')) {
            return
        }else{
            body.classList.remove('dark')
            body.classList.toggle('light')
            setUserData({...user,theme: 'light'})
        }
    }else if(e.target.classList.contains('themeDark')){
        if(body.classList.contains('dark')) {
            return
        }else{
            body.classList.remove('light')
            body.classList.toggle('dark')
            setUserData({...user,theme: 'dark'})
        }
    }
})


export default setWords;
export {spanWrap , totalWords ,handleStats};

