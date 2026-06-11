// Agrega dominios a la lista de "Authorized domains" de Firebase Auth
// (necesario para que el login funcione en producción).
// Uso: node scripts/firebase-authorize-domain.mjs dominio1 [dominio2 ...]
import { readFileSync } from "node:fs";
import { cert } from "firebase-admin/app";

const SA_PATH = new URL("../.secrets/service-account.json", import.meta.url);
const serviceAccount = JSON.parse(readFileSync(SA_PATH, "utf8"));
const PROJECT = serviceAccount.project_id;
const credential = cert(serviceAccount);

const newDomains = process.argv.slice(2);
if (newDomains.length === 0) {
  console.error("Pasá al menos un dominio. Ej: node scripts/firebase-authorize-domain.mjs re-motos.vercel.app");
  process.exit(1);
}

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

const CONFIG = `https://identitytoolkit.googleapis.com/admin/v2/projects/${PROJECT}/config`;

const current = await api(CONFIG);
const existing = current.json?.authorizedDomains || [];
const merged = Array.from(new Set([...existing, ...newDomains]));

const res = await api(
  `${CONFIG}?updateMask=authorizedDomains`,
  "PATCH",
  { authorizedDomains: merged },
);

console.log("Status:", res.status);
console.log("Dominios autorizados:", JSON.stringify(res.json?.authorizedDomains || merged));
process.exit(res.ok ? 0 : 1);
