// Setup de Firebase para RE Motos (uso único, local).
// - Obtiene/crea la Web App y devuelve su firebaseConfig (Management API).
// - Crea el usuario admin de login.
// - Siembra Firestore: sucursal, 3 perfiles de trabajo y las 16 motos del PDF.
//
// Uso: node scripts/firebase-setup.mjs
import { readFileSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const SA_PATH = new URL("../.secrets/service-account.json", import.meta.url);
const serviceAccount = JSON.parse(readFileSync(SA_PATH, "utf8"));
const PROJECT = serviceAccount.project_id;

const credential = cert(serviceAccount);
const app = initializeApp({ credential, projectId: PROJECT });
const db = getFirestore(app);
const auth = getAuth(app);

const ADMIN_EMAIL = "admin@remotos.com";
const ADMIN_PASSWORD = "REMotos2026";

async function api(url, method = "GET", body) {
  const { access_token } = await credential.getAccessToken();
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json };
}

const FB = "https://firebase.googleapis.com/v1beta1";
const mgmt = (path, method, body) => api(`${FB}/${path}`, method, body);

// Intenta activar el proveedor email/contraseña vía Identity Toolkit Admin API.
async function enableEmailAuth() {
  // Primero inicializa Identity Platform (idempotente; si ya existe, ignora).
  await api(
    `https://identitytoolkit.googleapis.com/v2/projects/${PROJECT}/identityPlatform:initializeAuth`,
    "POST",
    {},
  ).catch(() => undefined);

  const res = await api(
    `https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT}/config?updateMask=signIn.email.enabled,signIn.email.passwordRequired`,
    "PATCH",
    { signIn: { email: { enabled: true, passwordRequired: true } } },
  );
  return res;
}

// Enciende las APIs de Google Cloud necesarias (si el SA tiene permiso).
async function enableApis() {
  const apis = [
    "firestore.googleapis.com",
    "identitytoolkit.googleapis.com",
    "firebasestorage.googleapis.com",
  ];
  const out = [];
  for (const a of apis) {
    const res = await api(
      `https://serviceusage.googleapis.com/v1/projects/${PROJECT}/services/${a}:enable`,
      "POST",
      {},
    );
    out.push(`${a.split(".")[0]}=${res.status}`);
  }
  return out.join(" ");
}

// Crea la base Firestore (default) si no existe.
async function ensureFirestoreDb() {
  const res = await api(
    `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases?databaseId=(default)`,
    "POST",
    { type: "FIRESTORE_NATIVE", locationId: "southamerica-east1" },
  );
  return res;
}

async function getWebConfig() {
  // ¿Ya hay una web app?
  const list = await mgmt(`projects/${PROJECT}/webApps`);
  let appId = list.json?.apps?.[0]?.appId;

  if (!appId) {
    console.log("No hay web app; creando una...");
    const created = await mgmt(`projects/${PROJECT}/webApps`, "POST", {
      displayName: "re-motos-web",
    });
    if (!created.ok) {
      throw new Error(
        `No pude crear la web app: ${created.status} ${JSON.stringify(created.json)}`,
      );
    }
    // Operación de larga duración: poll hasta terminar.
    let op = created.json;
    for (let i = 0; i < 30 && !op.done; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const poll = await mgmt(op.name);
      op = poll.json;
    }
    appId = op.response?.appId;
    if (!appId) throw new Error("La operación no devolvió appId.");
  }

  const cfg = await mgmt(`projects/${PROJECT}/webApps/${appId}/config`);
  if (!cfg.ok) {
    throw new Error(
      `No pude leer la config web: ${cfg.status} ${JSON.stringify(cfg.json)}`,
    );
  }
  return cfg.json;
}

async function ensureAdminUser() {
  try {
    const existing = await auth.getUserByEmail(ADMIN_EMAIL);
    await auth.updateUser(existing.uid, {
      password: ADMIN_PASSWORD,
      emailVerified: true,
    });
    return `actualizado (${existing.uid})`;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      const user = await auth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true,
        displayName: "Administrador",
      });
      return `creado (${user.uid})`;
    }
    throw error;
  }
}

const BRANCH = "RE Motos";

const workerProfiles = [
  { id: "worker-ruso", name: "Ruso", role: "Gerencia", pin: "1234", branch: BRANCH, color: "#0f2a1d", active: true },
  { id: "worker-manuel", name: "Manuel", role: "Ventas", pin: "1234", branch: BRANCH, color: "#3f6f4d", active: true },
  { id: "worker-valentin", name: "Valentin", role: "Ventas", pin: "1234", branch: BRANCH, color: "#5f725e", active: true },
];

const ci = (a, b, c, d) => ({ 3: a, 6: b, 12: c, 18: d });

const motorcycles = [
  { id: "motomel-blitz-base-110-gris", brand: "Motomel", model: "Blitz base 110 gris", category: "Cub", currency: "ARS", price: 1730000, cardInstallments: ci(645866, 343116, 196066, 152816) },
  { id: "motomel-blitz-full-110-azul", brand: "Motomel", model: "Blitz aleacion full 110 azul", category: "Cub", currency: "ARS", price: 2030000, cardInstallments: ci(757866, 402616, 230066, 179316) },
  { id: "gilera-smash-base-110-azul", brand: "Gilera", model: "Smash base 110 azul", category: "Cub", currency: "ARS", price: 1800000, cardInstallments: ci(672000, 357000, 204000, 159000) },
  { id: "gilera-smash-full-110-roja", brand: "Gilera", model: "Smash full 110 roja", category: "Cub", currency: "ARS", price: 2260000, cardInstallments: ci(843733, 448233, 256133, 199633) },
  { id: "honda-dax-70", brand: "Honda", model: "Dax 70", category: "Cub", currency: "USD", price: 2500, notes: "Precio del PDF expresado en dolares." },
  { id: "ika-110-slalom-full", brand: "Ika", model: "110 Slalom full", category: "Cub", currency: "ARS", price: 1670000, cardInstallments: ci(623466, 331216, 189266, 147516) },
  { id: "ika-110-slalom-base", brand: "Ika", model: "110 Slalom base", category: "Cub", currency: "ARS", price: 1530000, cardInstallments: ci(570000, 303500, 173000, 135150) },
  { id: "ika-spot-base-150", brand: "Ika", model: "Spot base 150", category: "Street", currency: "ARS", price: 2280000, cardInstallments: ci(851200, 452200, 258400, 201400) },
  { id: "motomel-serie-2-full-150", brand: "Motomel", model: "Serie 2 full 150", category: "Street", currency: "ARS", price: 2950000, cardInstallments: ci(1101333, 585083, 334333, 260583) },
  { id: "hero-xpulse-200", brand: "Hero", model: "Xpulse 200", category: "Trail", currency: "ARS", price: 4650000, cardInstallments: ci(1736000, 922250, 527000, 410750) },
  { id: "kove-350r", brand: "Kove", model: "350R", category: "Deportiva", currency: "ARS", price: 10200000 },
  { id: "ika-durban-150", brand: "Ika", model: "Durban 150", category: "Cross", currency: "ARS", price: 2510000, cardInstallments: ci(937066, 497816, 284466, 221716) },
  { id: "gilera-sahel-150", brand: "Gilera", model: "Sahel 150", category: "Cross", currency: "ARS", price: 3200000, cardInstallments: ci(1194666, 634666, 362666, 282266) },
  { id: "gilera-smx", brand: "Gilera", model: "SMX", category: "Cross", currency: "ARS", price: 3600000, cardInstallments: ci(1344000, 714000, 408000, 318000) },
  { id: "kove-525x", brand: "Kove", model: "525X", category: "Trail", currency: "ARS", price: 13967000 },
  { id: "bmw-gs-1200", brand: "BMW", model: "GS 1200", category: "Trail", currency: "USD", price: 12500, notes: "Precio del PDF expresado en dolares." },
];

async function seedFirestore() {
  const now = new Date().toISOString();

  await db.collection("branches").doc("re-motos").set({
    id: "re-motos",
    name: BRANCH,
    city: "Córdoba",
    address: "Casa central",
    manager: "Ruso",
    stock: 0,
    monthlySales: 0,
    todaySales: 0,
  });

  const wp = db.batch();
  for (const p of workerProfiles) {
    wp.set(db.collection("worker_profiles").doc(p.id), p);
  }
  await wp.commit();

  const mb = db.batch();
  for (const m of motorcycles) {
    mb.set(db.collection("motorcycles").doc(m.id), {
      cost: 0,
      stock: 0,
      branch: BRANCH,
      status: "Sin stock",
      image: "/re-motos-logo.jpeg",
      updatedAt: now,
      ...m,
    });
  }
  await mb.commit();

  await db.collection("activity_log").add({
    type: "stock",
    workerName: "Sistema",
    description:
      "Lista inicial de modelos y precios importada desde el PDF de RE Motos.",
    createdAt: now,
  });

  return {
    branches: 1,
    workerProfiles: workerProfiles.length,
    motorcycles: motorcycles.length,
  };
}

async function tryStep(label, fn) {
  try {
    const result = await fn();
    console.log(`OK · ${label}: ${result ?? "hecho"}`);
    return { ok: true, result };
  } catch (error) {
    console.log(`FALLO · ${label}: ${error.message}`);
    return { ok: false, error };
  }
}

async function main() {
  console.log("== RE Motos · Firebase setup ==");
  console.log("Proyecto:", PROJECT);

  const webConfig = await getWebConfig();
  console.log("\n--- WEB CONFIG ---");
  console.log(JSON.stringify(webConfig, null, 2));
  console.log("---\n");

  // 1) Encender APIs de GCP.
  const apisRes = await tryStep("encender APIs (Firestore/Auth/Storage)", () => enableApis());
  if (apisRes.ok) {
    console.log("Esperando propagación de APIs (~20s)...");
    await new Promise((r) => setTimeout(r, 20000));
  }

  // 2) Crear base Firestore.
  await tryStep("crear base Firestore", async () => {
    const res = await ensureFirestoreDb();
    if (res.ok || res.status === 409) return res.status === 409 ? "ya existía" : "creada";
    return `status ${res.status} ${JSON.stringify(res.json).slice(0, 160)}`;
  });
  await new Promise((r) => setTimeout(r, 8000));

  // 3) Activar login email/password.
  await tryStep("activar login email/password", async () => {
    const res = await enableEmailAuth();
    return res.ok ? "habilitado" : `status ${res.status} ${JSON.stringify(res.json).slice(0, 160)}`;
  });

  // 4) Sembrar Firestore (un par de reintentos por propagación).
  let seedRes = { ok: false };
  for (let i = 0; i < 3 && !seedRes.ok; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, 8000));
    seedRes = await tryStep(`sembrar Firestore (intento ${i + 1})`, () => seedFirestore());
  }
  if (seedRes.ok) console.log("   →", JSON.stringify(seedRes.result));

  // 5) Usuario admin (un par de reintentos por propagación de Auth).
  let adminRes = { ok: false };
  for (let i = 0; i < 3 && !adminRes.ok; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, 8000));
    adminRes = await tryStep(`crear/actualizar usuario admin (intento ${i + 1})`, () => ensureAdminUser());
  }

  console.log("\n== FIN ==");
}

main().catch((error) => {
  console.error("\nERROR FATAL:", error.message);
  process.exit(1);
});
