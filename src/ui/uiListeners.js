import { text } from '../functions/getText';
import handleProfile, { handleMenu } from '../functions/handleHiding';
import { getUserData, setUserData, setUserTheme } from '../storage/localstorage';
import { body, theme, signupForm, profileButton, profile, saveStatsBtn, signupBtn, settings, settingsBtn, closeWinBtn, drag, stats, loginBtn, signinForm, logoutBtn, updateBtn, signUpinfo, loader, leaderBoardBtn, leaderBoard } from './uiElements';
import saveStats from '../functions/saveStats';
import { logout, signIn, signUp } from '../firebase/auth';

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

profileButton.addEventListener('click', async () => {
    if (profile.classList.contains('hide')) {
        profile.classList.toggle('hide')
        let user = await getUserData();
        handleMenu(user);
        if (user && !(Object.entries(user).length === 0 && user.constructor === Object)) {
            handleStats(user);
            updateBtn.classList.remove('hide');
            signupBtn.classList.add('hide');
        } else {
            handleProfile(signUpinfo)
        }
    } else {
        profile.classList.add('hide')
    }
})

//for close button on the floating window

closeWinBtn.forEach((b) => {
    b.addEventListener('click', (e) => {
        let element = e.target.parentElement.parentElement.parentElement;
        handleProfile(loader);
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
    // console.log(user)
    if (user && !(Object.entries(user).length === 0 && user.constructor === Object)) {
        stats.childNodes.forEach((element) => {
            if (!element.classList) {
                return
            } else if (element.classList.contains('name')) {
                element.innerText = user.userName;
            } else if (element.classList.contains('topSpeed')) {
                element.innerText = 'topspeed: ' + user.topSpeed;
            }
        })
        handleProfile(stats, user)
    } else {
        handleProfile(signUpinfo)
    }
    return user;
}


// to show and hide settings window  

settingsBtn.addEventListener('click', () => {
    settings.classList.toggle('hide');
})



// for theme 


theme.addEventListener('click', async (e) => {
    let user = await getUserData()
    if (e.target.classList.contains('themeLight')) {
        if (body.classList.contains('light')) {
            return
        } else {
            body.classList.remove('dark')
            body.classList.toggle('light')
            user ? setUserData({ ...user, theme: 'light' }) : setUserTheme({ theme: 'light' })
        }
    } else if (e.target.classList.contains('themeDark')) {
        if (body.classList.contains('dark')) {
            return
        } else {
            body.classList.remove('light')
            body.classList.toggle('dark')
            user ? setUserData({ ...user, theme: 'dark' }) : setUserTheme({ theme: 'dark' })
        }
    }
})


// save stats 
saveStatsBtn.addEventListener('click', () => {
    saveStats();
})


//signupform and signIn form handler
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    signUp({ email: e.target.email.value, username: e.target.username.value, password: e.target.password.value })
    handleProfile(loader);
})

signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    signIn({ email: e.target.email.value, password: e.target.password.value })
    handleProfile(loader);
})


// to show signup and login window 
signupBtn.addEventListener('click', () => {
    handleProfile(signupForm);
})

loginBtn.addEventListener('click', () => {
    handleProfile(signinForm);
})

//for logging out
logoutBtn.addEventListener('click', () => {
    logout();
})

updateBtn.addEventListener('click', () => {
    console.log('update btn clicked')
})


//handle leaderBoard

leaderBoardBtn.addEventListener('click', () => {
    if (leaderBoard.parentElement.classList.contains('hide')) {
        leaderBoard.parentElement.classList.toggle('hide');
        setTimeout(() => {
            leaderBoard.parentElement.classList.toggle('fadeOut');
        }, 200)
    } else {
        leaderBoard.parentElement.classList.toggle('fadeOut');
        setTimeout(() => {
            leaderBoard.parentElement.classList.toggle('hide');
        }, 500)
    }
})

export default setWords;
export { spanWrap, totalWords, handleStats };

