// Deja los 3 perfiles familiares: Ruso (padre), Manuel y Valentin (hijos).
// Sin perfil "Administrador". Uso: node scripts/firebase-profiles.mjs
import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const SA_PATH = new URL("../.secrets/service-account.json", import.meta.url);
const serviceAccount = JSON.parse(readFileSync(SA_PATH, "utf8"));
const app = initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore(app);

const BRANCH = "RE Motos";
const profiles = [
  { id: "worker-ruso", name: "Ruso", role: "Gerencia", pin: "1234", branch: BRANCH, color: "#0f2a1d", active: true },
  { id: "worker-manuel", name: "Manuel", role: "Ventas", pin: "1234", branch: BRANCH, color: "#3f6f4d", active: true },
  { id: "worker-valentin", name: "Valentin", role: "Ventas", pin: "1234", branch: BRANCH, color: "#5f725e", active: true },
];

// Borra cualquier perfil viejo (p.ej. worker-admin) y deja solo los 3.
const existing = await db.collection("worker_profiles").get();
const keep = new Set(profiles.map((p) => p.id));
const batch = db.batch();
for (const docSnap of existing.docs) {
  if (!keep.has(docSnap.id)) batch.delete(docSnap.ref);
}
for (const p of profiles) {
  batch.set(db.collection("worker_profiles").doc(p.id), p);
}
// Gerente de la sucursal: Ruso.
batch.set(
  db.collection("branches").doc("re-motos"),
  { manager: "Ruso" },
  { merge: true },
);
await batch.commit();

const final = await db.collection("worker_profiles").get();
console.log("Perfiles ahora:", final.docs.map((d) => d.data().name).join(", "));
process.exit(0);
