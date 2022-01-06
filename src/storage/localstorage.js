import { getData, setData } from "../firebase/firestore";

const LOCAL_STORAGE_USER_DATA = 'user.data';

async function getUserData() {
    let data = navigator.onLine ? await getData() : JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_DATA))
    // console.log('getUserData got', data);
    return data;
}

//theme functions actually save data locally

function getUserTheme() {
    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_DATA));
    return data;
}



function setUserTheme(data) {
    localStorage.setItem(LOCAL_STORAGE_USER_DATA, JSON.stringify(data));
    return data;
}

function setUserData(data) {
    localStorage.setItem(LOCAL_STORAGE_USER_DATA, JSON.stringify(data));
    setData(data)
    return data;
}

export { getUserData, setUserData, getUserTheme, setUserTheme };