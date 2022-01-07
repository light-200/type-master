import { app } from "./firebase";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, getDoc, setDoc, onSnapshot, connectFirestoreEmulator, query, orderBy, collection, limit } from 'firebase/firestore'
import { clearLeaderBoard, handleLeaderBoard, prepareLeaderboard } from "../functions/handleLeaderBoard";
// import { handleLeaderBoard } from "../functions/handleLeaderBoard";
const firestore = getFirestore(app);
// connectFirestoreEmulator(firestore, 'localhost', 8888);

export const getData = async () => {
    let auth = getAuth();
    let userId = auth.currentUser && auth.currentUser.uid;
    // console.log(auth.currentUser);
    // console.log("getData got userId ", userId);
    if (userId) {
        const scores = doc(firestore, `scores/${userId}`);
        let data = scores && await getDoc(scores);
        // console.log('getDoc called 👩‍🚒');
        if (data.exists()) {
            return data.data()
        } else return null;
    }
    else return null;
}

export const setData = (data) => {
    const scores = doc(firestore, `scores/${data.uId}`);
    setDoc(scores, data, { merge: true }).then(console.log('added successfully')).catch(error => console.error('I got an error', error));
}

let unsubListener;

export function listenData() {
    const scores = collection(firestore, 'scores');
    const q = query(scores, orderBy("topSpeed", "desc"), limit(10))

    unsubListener = onSnapshot(q, scores, docSnap => {
        if (docSnap) {
            const topTen = [];
            clearLeaderBoard();
            prepareLeaderboard();
            docSnap.forEach((doc) => {
                let user = doc.data()
                topTen.push({ userName: user.userName, speed: user.topSpeed })

            })
            for (let i = 0; i < topTen.length; i++) {
                handleLeaderBoard(i + 1, topTen[i])
            }
        } else {
            console.log('could not find leaderBoard')
            alert('no leaderboard found due to some error')
        }
    })
}

export function dontListenData() {
    unsubListener();
}
