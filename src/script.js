import getText from './functions/getText';
import { getUserData, setUserData } from './storage/localstorage';

import { body } from './ui/uiElements';


window.onload = () => {
    let user = getUserData()
    user && body.classList.add(user.theme)
}

getText();
