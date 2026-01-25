import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// INSERIRE QUI LE TUE CHIAVI DA FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyAE3sbZ2yHiGZmMg2FJbSHZ2QGCf72McM",
    authDomain: "sellsnap-4062d.firebaseapp.com",
    projectId: "sellsnap-4062d",
    storageBucket: "sellsnap-4062d.firebasestorage.app",
    messagingSenderId: "315333514322",
    appId: "1:315333514322:android:e9e6e4588a9c1e9b197b8b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
