
import { authState } from './firebase/auth';
import getText from './functions/getText';
import { setSpeed } from './functions/speed';

import { getUserTheme } from './storage/localstorage';

import { body } from './ui/uiElements';

export default function userLoggedIn(isLoggedin) {
    return isLoggedin;
}

window.onload = () => {
    if (getUserTheme()) {
        body.classList.add(getUserTheme().theme)
        setSpeed(getUserTheme().lastSpeed)
    };
}

getText();
authState();

