// Import the functions you need from the SDKs you need
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth, GoogleAuthProvider } from "firebase/auth";
// Import environment variables
import.meta.env;

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
        apiKey: "AIzaSyA1ijOIskK8Jvf92Vt1UwrgRVK_kd9u07U",
        authDomain: "semi-a.firebaseapp.com",
        projectId: "semi-a",
        storageBucket: "semi-a.appspot.com",
        messagingSenderId: "706668911926",
        appId: "1:706668911926:web:48b6e465518a312015e797"
    };

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
}

initFirebaseApp();
