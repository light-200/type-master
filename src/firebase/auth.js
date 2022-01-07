import { app } from "./firebase";
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged } from 'firebase/auth';
import { getUserData, setUserData } from "../storage/localstorage";
import { handleStats } from "../ui/uiListeners";
import { handleMenu } from "../functions/handleHiding";


const auth = getAuth(app);
// connectAuthEmulator(auth, 'http://localhost:9999');

export const signIn = async ({ email, password }) => {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        alert(error.code)
    }
}

export const signUp = async ({ email, password, username }) => {

    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, {
            displayName: username
        }).then(() => {
            console.log("updated the name")
            let data = {
                uId: userCred.user.uid,
                userName: userCred.user.displayName,
                topSpeed: 0,
                theme: 'dark',
                lastSpeed: 0,
            }
            setUserData(data);
        }
        )
    } catch (error) {
        alert(error.code);
    }
}

export const logout = () => {
    try {
        signOut(auth);
        console.log('user logged out');
    } catch (error) {
        alert(error.code);
    }
}

export const authState = () => {
    onAuthStateChanged(auth, async (user) => {

        if (user) {
            user = await getUserData();
            handleMenu(user);
            handleStats(user);
        } else {
            handleMenu(user);
            handleStats(user);
        }

    })
}