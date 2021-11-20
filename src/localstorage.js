const LOCAL_STORAGE_DATA = 'user.data';
const storage = window.localStorage;

function getData() {
      let data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA));
      return  data || { };
}

function setData(data) {
    localStorage.setItem(LOCAL_STORAGE_DATA, JSON.stringify(data));
    return data;
} 

export {getData , setData};