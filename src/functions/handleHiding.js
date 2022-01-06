
import { loginBtn, logoutBtn, options, routs, saveStatsBtn, signupBtn, updateBtn } from '../ui/uiElements'

const handleProfile = (element, user) => {
    routs.childNodes.forEach(e => {
        if (!e.classList) { //this one is to eliminate text nodes 
            return
        }
        if (e == element) {
            e.classList.remove('hide')
            if (e.classList.contains('stats') && user) {
                saveStatsBtn.classList.remove('hide')
            } else {
                saveStatsBtn.classList.add('hide')
            }
        } else {
            !e.classList.contains('hide') && e.classList.add('hide');
        }
    })
}

export function handleMenu(user) {
    if (user) {
        logoutBtn.classList.remove('hide');
        updateBtn.classList.remove('hide');
        signupBtn.classList.add('hide');
        loginBtn.classList.add('hide');
    } else {
        logoutBtn.classList.add('hide');
        updateBtn.classList.add('hide');
        signupBtn.classList.remove('hide');
        loginBtn.classList.remove('hide');
    }
}

handleMenu();

export default handleProfile;