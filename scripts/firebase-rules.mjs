// Publica las reglas de Firestore: solo usuarios logueados pueden leer/escribir.
// Uso: node scripts/firebase-rules.mjs
import { readFileSync } from "node:fs";
import { cert } from "firebase-admin/app";

const SA_PATH = new URL("../.secrets/service-account.json", import.meta.url);
const serviceAccount = JSON.parse(readFileSync(SA_PATH, "utf8"));
const PROJECT = serviceAccount.project_id;
const credential = cert(serviceAccount);

const RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
`;

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

const BASE = `https://firebaserules.googleapis.com/v1/projects/${PROJECT}`;

const ruleset = await api(`${BASE}/rulesets`, "POST", {
  source: { files: [{ name: "firestore.rules", content: RULES }] },
});
console.log("Crear ruleset:", ruleset.status, JSON.stringify(ruleset.json).slice(0, 200));
if (!ruleset.ok) process.exit(1);

const rulesetName = ruleset.json.name;
const releaseName = `projects/${PROJECT}/releases/cloud.firestore`;

let release = await api(`${BASE}/releases`, "POST", {
  name: releaseName,
  rulesetName,
});
if (release.status === 409) {
  release = await api(
    `https://firebaserules.googleapis.com/v1/${releaseName}`,
    "PATCH",
    { release: { name: releaseName, rulesetName } },
  );
}
console.log("Release:", release.status, JSON.stringify(release.json).slice(0, 200));
process.exit(release.ok ? 0 : 1);
