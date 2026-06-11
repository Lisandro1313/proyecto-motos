import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// La config web de Firebase es PÚBLICA por diseño (va en el navegador).
// La seguridad la dan las reglas de Firestore, no ocultar estos valores.
// Se puede sobrescribir por variables de entorno NEXT_PUBLIC_FIREBASE_*.
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyD68g0STjw2wr73n_1Pq3j-kZm7VOeV7VU",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "re-motos.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "re-motos",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "re-motos.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "857882848307",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:857882848307:web:10c8a89d953120e2b70746",
};

export const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
