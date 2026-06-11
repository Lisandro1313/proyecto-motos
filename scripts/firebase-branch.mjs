// Corrige la sucursal: Gualeguaychú, Entre Ríos.
// Uso: node scripts/firebase-branch.mjs
import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const SA_PATH = new URL("../.secrets/service-account.json", import.meta.url);
const serviceAccount = JSON.parse(readFileSync(SA_PATH, "utf8"));
const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

await db.collection("branches").doc("re-motos").set(
  { city: "Gualeguaychú", address: "Gualeguaychú, Entre Ríos" },
  { merge: true },
);

const snap = await db.collection("branches").doc("re-motos").get();
console.log("Sucursal:", JSON.stringify(snap.data()));
process.exit(0);
