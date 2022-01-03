import getText from './getText';
import handleProfile from './handleProfile';
import { getUserData, setUserData } from './localstorage';
import { handleStats } from './mainUi';
import saveStats from './saveStats.js'
import { body, saveStatsBtn, signupBtn, signupForm } from './ui';


window.onload = () => {
    let user = getUserData()
    user && body.classList.add(user.theme)
}

// save stats 
saveStatsBtn.addEventListener('click', () => {
    saveStats();
})


//signupform form handler
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let oldSpeed = (getUserData() && getUserData().topSpeed) || 0;
    let data = {
        userName: e.target.username.value,
        topSpeed: oldSpeed,
        theme: 'dark'
    }
    data = setUserData(data)
    handleStats(data)
})


// to show signup window 
signupBtn.addEventListener('click', () => {
    handleProfile(signupForm);
})

getText();
