import { app } from "./firebase";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getUserData,
  setUserData,
  updateUserData,
} from "../storage/localstorage";
import { handleStats } from "../ui/uiListeners";
import handleProfile, { handleMenu } from "../functions/handleHiding";
import { loader, username } from "../ui/uiElements";
import { defaultTheme } from "../functions/userDefault";
import { smallCaseMode, punctuationMode } from "../functions/userDefault";

const auth = getAuth(app);
if (process.env.DEVELOPMENT_MODE == "true")
  connectAuthEmulator(auth, "http://localhost:9999");

export const signIn = async ({ email, password }) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert(error.code);
  }
};

export const signUp = async ({ email, password, username }) => {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCred.user, {
      displayName: username ? username : userCred.email.split("@")[0],
    }).then(() => {
      console.log("updated the name");
      let data = {
        uId: userCred.user.uid,
        userName: userCred.user.displayName,
        topSpeed: 0,
        theme: defaultTheme,
        punctuationMode,
        smallCaseMode,
        lastSpeed: 0,
      };
      setUserData(data);
    });
  } catch (error) {
    alert(error.code);
  }
};

export const logout = () => {
  try {
    signOut(auth);
    console.log("user logged out");
  } catch (error) {
    alert(error.code);
  }
};

export const authState = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      user = await getUserData();
      handleMenu(user);
      handleStats(user);
      username.innerText = user.userName;
    } else {
      handleMenu(user);
      handleStats(user);
      username.innerText = " ";
    }
  });
};

export const updateUser = async (username) => {
  try {
    let userCred = auth.currentUser;
    handleProfile(loader);
    await updateProfile(userCred, {
      displayName: username,
    }).then(() => {
      console.log("updated the name");
      let data = {
        uId: userCred.uid,
        userName: userCred.displayName,
      };
      updateUserData(data);
      getUserData().then((user) => {
        handleStats(user);
      });
    });
  } catch (error) {
    alert("check your network");
  }
};
