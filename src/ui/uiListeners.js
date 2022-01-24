import getText, { text } from "../functions/getText";
import handleProfile, { handleMenu } from "../functions/handleHiding";
import {
  getLocalData,
  getUserData,
  setLocalData,
  setUserData,
} from "../storage/localstorage";
import {
  body,
  themeSelector,
  signupForm,
  profileButton,
  profile,
  saveStatsBtn,
  signupBtn,
  settings,
  settingsBtn,
  closeWinBtn,
  drag,
  stats,
  loginBtn,
  signinForm,
  logoutBtn,
  updateBtn,
  signUpinfo,
  loader,
  leaderBoardBtn,
  leaderBoard,
  updateForm,
  textOptions,
  leaderBoardContainer,
  nextBtn,
} from "./uiElements";
import saveStats from "../functions/saveStats";
import { logout, signIn, signUp, updateUser } from "../firebase/auth";
import { punctuationMode, smallCaseMode } from "../functions/userDefault";
import handlePopup from "../functions/handlePopup";

var totalWords;

//sets total word value
const words = document.querySelector(".words");

const setWords = (typedWords = 0) => {
  let whitespace = / /g,
    result,
    indices = [];
  while ((result = whitespace.exec(text))) {
    indices.push(result.index);
  }
  totalWords = indices.length + 1;
  words.innerText = `${totalWords}/${typedWords}`;
};

//wraps all words in a span tag
const spanWrap = (textContainer) => {
  let newArr = [];
  for (let i = 0; i < text.length; i++) {
    newArr.push(`<span>${text[i]}</span>`);
  }
  let newText = newArr.join("");
  textContainer.innerHTML = newText;
};

// to show and hide profile window

profileButton.addEventListener("click", async () => {
  if (profile.classList.contains("hide")) {
    profile.classList.toggle("hide");
    let user = await getUserData();
    handleMenu(user);
    if (
      user &&
      !(Object.entries(user).length === 0 && user.constructor === Object)
    ) {
      handleStats(user);
      updateBtn.classList.remove("hide");
      signupBtn.classList.add("hide");
    } else {
      handleProfile(signUpinfo);
    }
  } else {
    profile.classList.add("hide");
  }
});

//for close button on the floating window

closeWinBtn.forEach((b) => {
  b.addEventListener("click", (e) => {
    let element = e.target.parentElement.parentElement.parentElement;
    handleProfile(loader);
    element.classList.toggle("hide");
  });
});

// for dragging elements

drag.forEach((d) => {
  d.addEventListener("drag", (e) => {
    let element = e.target.parentElement.parentElement;
    element.style.filter = "brightness(.7)";
  });
});

drag.forEach((d) => {
  d.addEventListener("dragend", (e) => {
    let element = e.target.parentElement.parentElement;
    element.style.filter = "brightness(1)";
    moveElement(e, element);
  });
});

const moveElement = (e, element) => {
  element.style.left = e.pageX - 20 + "px";
  element.style.top = e.pageY - 20 + "px";
};

// for stats

const handleStats = async (user) => {
  // console.log(user)
  if (
    user &&
    !(Object.entries(user).length === 0 && user.constructor === Object)
  ) {
    stats.lastElementChild.lastElementChild.childNodes.forEach((element) => {
      if (!element.classList) {
        return;
      } else if (element.classList.contains("name")) {
        if (user.userName.length > 10) {
          element.style.fontSize = 20;
        } else if (user.userName.length > 20) {
          element.style.fontSize = 15;
        }
        element.innerHTML = user.userName;
      } else if (element.classList.contains("speed")) {
        if (user.userName.length > 10) {
          element.style.fontSize = 30;
        }
        element.innerHTML = user.topSpeed;
      }
    });
    handleProfile(stats, user);
  } else {
    handleProfile(signUpinfo);
  }
  return user;
};

// to show and hide settings window

settingsBtn.addEventListener("click", () => {
  settings.classList.toggle("hide");
});

// for theme

themeSelector.addEventListener("change", async (e) => {
  let user = await getUserData();
  if (e.target.options.light.selected) {
    if (body.classList.contains("light")) {
      return;
    } else {
      body.classList.remove("dark");
      body.classList.add("light");
      if (user) {
        setUserData({ ...user, theme: "light" });
      } else {
        user = getLocalData();
        setLocalData({ ...user, theme: "light" });
      }
    }
  } else if (e.target.options.dark.selected) {
    if (body.classList.contains("dark")) {
      return;
    } else {
      body.classList.remove("light");
      body.classList.add("dark");
      if (user) {
        setUserData({ ...user, theme: "dark" });
      } else {
        user = getLocalData();
        setLocalData({ ...user, theme: "dark" });
      }
    }
  }
});

// save stats
saveStatsBtn.addEventListener("click", () => {
  saveStats();
});

//signupform and signIn form handler
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signUp({
    email: e.target.email.value,
    username: e.target.username.value,
    password: e.target.password.value,
  });
  handleProfile(loader);
});

signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signIn({ email: e.target.email.value, password: e.target.password.value });
  handleProfile(loader);
});

// to show signup and login window
signupBtn.addEventListener("click", () => {
  handleProfile(signupForm);
});

loginBtn.addEventListener("click", () => {
  handleProfile(signinForm);
});

//for logging out
logoutBtn.addEventListener("click", () => {
  logout();
});

updateBtn.addEventListener("click", () => {
  // console.log('update btn clicked')
  handleProfile(updateForm);
});

updateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let username = e.target.username.value;
  if (username && username[0] != " " && username.length > 0) {
    updateUser(username);
  } else {
    console.log("enter username", username);
  }
});

//handle leaderBoard

leaderBoardBtn.addEventListener("click", () => {
  if (leaderBoard.parentElement.classList.contains("hide")) {
    leaderBoard.parentElement.classList.toggle("hide");
    setTimeout(() => {
      leaderBoard.parentElement.classList.toggle("fadeOut");
    }, 200);
  } else {
    leaderBoard.parentElement.classList.toggle("fadeOut");
    setTimeout(() => {
      leaderBoard.parentElement.classList.toggle("hide");
    }, 500);
  }
});

leaderBoardContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("leaderBoard")) {
    leaderBoardContainer.classList.toggle("fadeOut");
    setTimeout(() => {
      leaderBoardContainer.classList.toggle("hide");
    }, 200);
  }
});

//handle text options
textOptions.addEventListener("click", async (e) => {
  let user = await getUserData();
  if (e.target.classList.contains("smallCase")) {
    if (e.target.classList.contains("active")) {
      smallCaseMode = false;
      e.target.classList.remove("active");
    } else {
      smallCaseMode = true;
      e.target.classList.add("active");
    }
    if (user) {
      setUserData({ ...user, smallCaseMode });
    } else {
      user = getLocalData();
      setLocalData({ ...user, smallCaseMode });
    }
  } else if (e.target.classList.contains("punctuation")) {
    if (e.target.classList.contains("active")) {
      punctuationMode = false;
      e.target.classList.remove("active");
    } else {
      punctuationMode = true;
      e.target.classList.add("active");
    }
    if (user) {
      setUserData({ ...user, punctuationMode });
    } else {
      user = getLocalData();
      setLocalData({ ...user, punctuationMode });
    }
  }
});

//handling next btn
nextBtn.addEventListener("click", () => {
  getText();
});

let firstTime = true;
// for caps lock
document.addEventListener("keypress", (e) => {
  if (e.getModifierState("CapsLock")) {
    firstTime && handlePopup("CapsLock", 2000);
  }
  firstTime = false;
});

export default setWords;
export { spanWrap, totalWords, handleStats };
