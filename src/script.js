
import { authState } from './firebase/auth';
import { listenData } from './firebase/firestore';
import getText from './functions/getText';
import { setSpeed } from './functions/speed';

import { getUserTheme } from './storage/localstorage';

import { body, themeSelector } from './ui/uiElements';

export default function userLoggedIn(isLoggedin) {
    return isLoggedin;
}

window.onload = () => {
    if (getUserTheme()) {
        let theme = getUserTheme().theme;
        if(theme!="dark") {
            body.classList.remove("dark")
            body.classList.add(theme)
        }
        // console.log(theme,themeSelector.options[theme])
        themeSelector.options[theme].selected = true
        setSpeed(getUserTheme().lastSpeed)
    };
}

getText();
authState();
listenData();

