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
import {
  DEFAULT_WORD_COUNT,
  defaultTheme,
  smallCaseMode,
  punctuationMode,
} from "../functions/userDefault";

const auth = getAuth(app);
const isDevelopment = import.meta.env.VITE_DEVELOPMENT_MODE === "true";
if (isDevelopment)
  connectAuthEmulator(auth, "http://localhost:9999");

export const signIn = async ({ email, password }) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return { ok: true, userCred };
  } catch (error) {
    alert(error.code);
    return { ok: false, error };
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
        wordCount: DEFAULT_WORD_COUNT,
        lastSpeed: 0,
      };
      setUserData(data);
    });
    return { ok: true, userCred };
  } catch (error) {
    alert(error.code);
    return { ok: false, error };
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
      let userData = await getUserData();
      if (!userData) {
        const displayName =
          user.displayName ||
          (user.email ? user.email.split("@")[0] : "player");
        userData = {
          uId: user.uid,
          userName: displayName,
          topSpeed: 0,
          theme: defaultTheme,
          punctuationMode,
          smallCaseMode,
          wordCount: DEFAULT_WORD_COUNT,
          lastSpeed: 0,
        };
        setUserData(userData);
      } else if (userData.wordCount == null) {
        const updatedUser = { ...userData, wordCount: DEFAULT_WORD_COUNT };
        setUserData(updatedUser);
        userData = updatedUser;
      }
      handleMenu(userData);
      handleStats(userData);
      username.innerText = userData.userName || "";
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
