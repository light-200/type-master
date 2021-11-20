import getText from './getText';
import handleProfile from './handleProfile';
import {  getData, setData } from './localstorage';
import { handleStats } from './mainUi';

const signupForm = document.querySelector('.profile>.routs>.signUp')
const signupBtn = document.querySelector('.profile>.top>.options>.signupBtn')
const stats = document.querySelector('.profile>.routs>.stats')


//signupform form handler
signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let oldSpeed = (getData() && getData().topSpeed) || 0;
    let data = {
        userName : e.target.username.value,
        topSpeed : oldSpeed
    }
    data = setData(data)
    handleStats(data)
})


signupBtn.addEventListener('click',()=>{
    handleProfile(signupForm);
})

getText();

export { signupForm, stats }