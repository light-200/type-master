import { text } from './getText';
import handleProfile from './handleProfile';
import { getUserData, setUserData } from './localstorage';
import { body, theme, signupForm, profileButton, profile, signupBtn, settings, settingsBtn, closeWinBtn, drag, stats } from './ui';

var totalWords;

//sets total word value
const words = document.querySelector(".words");

const setWords = (typedWords = 0) => {
    let whitespace = / /g, result, indices = [];
    while (result = whitespace.exec(text)) {
        indices.push(result.index);
    }
    totalWords = indices.length + 1;
    words.innerText = `${totalWords}/${typedWords}`;
}

//wraps all words in a span tag
const spanWrap = (textContainer) => {
    let newArr = [];
    for (let i = 0; i < text.length; i++) {
        newArr.push(`<span>${text[i]}</span>`);
    };
    let newText = newArr.join('');
    textContainer.innerHTML = newText;
}



// to show and hide profile window 

profileButton.addEventListener('click', () => {
    profile.classList.toggle('hide')
    let user = getUserData()
    if (user) {
        handleStats(user)
        signupBtn.innerText = 'update'
    }
})

//for close button on the floating window

closeWinBtn.forEach((b) => {
    b.addEventListener('click', (e) => {
        let element = e.target.parentElement.parentElement.parentElement;
        element.classList.toggle('hide');
    })
})

// for dragging elements 

drag.forEach((d) => {
    d.addEventListener('drag', (e) => {
        let element = e.target.parentElement.parentElement;
        element.style.filter = 'brightness(.7)';
    })
})

drag.forEach((d) => {
    d.addEventListener('dragend', (e) => {
        let element = e.target.parentElement.parentElement;
        element.style.filter = 'brightness(1)';
        moveElement(e, element);
    })
}
)


const moveElement = (e, element) => {
    element.style.left = (e.pageX - 20) + 'px';
    element.style.top = (e.pageY - 20) + 'px';
}


// for stats 

const handleStats = (user) => {
    if (user) {
        stats.childNodes.forEach((element) => {
            if (!element.classList) {
                return
            } else if (element.classList.contains('name')) {
                element.innerText = user.userName;
            } else if (element.classList.contains('topSpeed')) {
                element.innerText = 'topspeed: ' + user.topSpeed;
            }
        })
        handleProfile(stats)
    } else {
        handleProfile(signupForm)
    }
    return user;
}


// to show and hide settings window  

settingsBtn.addEventListener('click', () => {
    settings.classList.toggle('hide');
})



// for theme 


theme.addEventListener('click', (e) => {
    let user = getUserData()
    if (e.target.classList.contains('themeLight')) {
        if (body.classList.contains('light')) {
            return
        } else {
            body.classList.remove('dark')
            body.classList.toggle('light')
            setUserData({ ...user, theme: 'light' })
        }
    } else if (e.target.classList.contains('themeDark')) {
        if (body.classList.contains('dark')) {
            return
        } else {
            body.classList.remove('light')
            body.classList.toggle('dark')
            setUserData({ ...user, theme: 'dark' })
        }
    }
})


export default setWords;
export { spanWrap, totalWords, handleStats };

