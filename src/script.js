import getText from './getText';
import handleProfile from './handleProfile';
import {  getUserData, setUserData } from './localstorage';
import { handleStats } from './mainUi';
import saveStats from './saveStats.js'

const body = document.querySelector('body');
const signupForm = document.querySelector('.profile>.routs>.signUp')
const signupBtn = document.querySelector('.windowTop>.options>.signupBtn')
const stats = document.querySelector('.profile>.routs>.stats')
const saveStatsBtn = document.querySelector('.saveStats');

window.onload= ()=>{
    let user = getUserData()
    user && body.classList.add(user.theme)
}

saveStatsBtn.addEventListener('click',()=>{
    saveStats();
})


//signupform form handler
signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let oldSpeed = (getUserData() && getUserData().topSpeed) || 0;
    let data = {
        userName : e.target.username.value,
        topSpeed : oldSpeed,
        theme: 'dark'
    }
    data = setUserData(data)
    handleStats(data)
})


signupBtn.addEventListener('click',()=>{
    handleProfile(signupForm);
})

getText();

export { signupForm, stats }