import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Le chiavi vengono caricate dal file .env (EXPO_PUBLIC_...)
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Debug per verificare se le chiavi vengono caricate (mostriamo solo le prime 5 cifre per sicurezza)
if (!firebaseConfig.apiKey) {
    console.error("ERRORE: EXPO_PUBLIC_FIREBASE_API_KEY non trovata nel file .env");
} else {
    console.log("Firebase API Key caricata correttamete (... " + firebaseConfig.apiKey.substring(0, 5) + ")");
}

const app = initializeApp(firebaseConfig);

// Inizializzazione con Persistenza per React Native
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

export default app;
