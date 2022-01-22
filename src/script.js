
import { authState } from './firebase/auth';
import { listenData } from './firebase/firestore';
import getText, { punctuationMode, smallCaseMode } from './functions/getText';
import { setSpeed } from './functions/speed';

import { getLocalData } from './storage/localstorage';

import { body, themeSelector } from './ui/uiElements';

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
        setSpeed(getLocalData().lastSpeed)
    };
}

getText();
authState();
listenData();

