import getText from './getText';
import handleProfile from './handleProfile';

const signupForm = document.querySelector('.profile>.routs>.signUp')
const signupBtn = document.querySelector('.profile>.top>.options>.signupBtn')
const stats = document.querySelector('.profile>.routs>.stats')

//signupform form handler
signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    signUp(e.target);
})


signupBtn.addEventListener('click',()=>{
    handleProfile(signupForm);
})

getText();

export { signupForm, stats }