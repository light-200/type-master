
import { authState } from './firebase/auth';
import { listenData } from './firebase/firestore';
import getText from './functions/getText';
import { setSpeed } from './functions/speed';
import { defaultTheme, punctuationMode,smallCaseMode } from './functions/userDefault';

import { getLocalData, setLocalData } from './storage/localstorage';

import { body, textOptions, themeSelector } from './ui/uiElements';

export default function userLoggedIn(isLoggedin) {
    return isLoggedin;
}

window.onload = () => {
    if (getLocalData()) {
        let theme = getLocalData().theme;
        if(theme!="dark") {
            body.classList.remove("dark")
            body.classList.add(theme)
        }
        // console.log(theme,themeSelector.options[theme])
        themeSelector.options[theme].selected = true
        getLocalData().punctuationMode ? textOptions.children[0].classList.add('active') :  textOptions.children[0].classList.remove('active') 
        getLocalData().smallCaseMode ? textOptions.children[1].classList.add('active') :  textOptions.children[1].classList.remove('active') 
        setSpeed(getLocalData().lastSpeed)
    } else {
        setLocalData({
            punctuationMode,
            smallCaseMode,
            theme: defaultTheme
        })
    };
}

getText();
authState();
listenData();

