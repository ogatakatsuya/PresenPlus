// Import the functions you need from the SDKs you need
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
export let app: FirebaseApp;
export let db: Firestore;
export let auth: Auth;
export const provider = new GoogleAuthProvider();

export async function initFirebaseApp() {
    if (getApps().length !== 0) {
        console.log('Firebase app already initialized.');
        return;
    }
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyCepCXy-HIFS467hjwKFevOH6afL1zSPFY",
        authDomain: "semi-a-svelte.firebaseapp.com",
        projectId: "semi-a-svelte",
        storageBucket: "semi-a-svelte.appspot.com",
        messagingSenderId: "678948804585",
        appId: "1:678948804585:web:4e6e9c169890da3e885d78",
        measurementId: "G-4MJLXHKFF4"
    };

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
}

initFirebaseApp();