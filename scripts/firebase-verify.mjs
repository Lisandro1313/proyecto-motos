// Verificación end-to-end: inicia sesión como admin (cliente web) y lee datos.
// Prueba que Auth + reglas + Firestore funcionan juntos.
// Uso: node scripts/firebase-verify.mjs
import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const cfg = Object.fromEntries(
  env
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => l.split("=").map((s) => s.trim()))
    .map(([k, v]) => [k, v]),
);

const app = initializeApp({
  apiKey: cfg.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: cfg.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: cfg.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: cfg.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: cfg.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: cfg.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const auth = getAuth(app);
const db = getFirestore(app);

try {
  const cred = await signInWithEmailAndPassword(
    auth,
    "admin@remotos.com",
    "REMotos2026",
  );
  console.log("OK login admin:", cred.user.email);

  for (const name of ["motorcycles", "worker_profiles", "branches"]) {
    const snap = await getDocs(collection(db, name));
    console.log(`OK ${name}: ${snap.size} docs`);
  }
  console.log("\n== TODO OK: Auth + reglas + Firestore funcionan ==");
  process.exit(0);
} catch (error) {
  console.error("FALLO:", error.code || "", error.message);
  process.exit(1);
}
