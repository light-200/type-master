const LOCAL_STORAGE_USER_DATA = 'user.data';

function getUserData() {
    let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_DATA));
    return data;
}

function setUserData(data) {
    localStorage.setItem(LOCAL_STORAGE_USER_DATA, JSON.stringify(data));
    return data;
}

export { getUserData, setUserData };