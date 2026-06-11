import type { WorkerProfile } from "@/lib/types";

export const adminCredentials = {
  email: "admin@remotos.com",
  password: "REMotos2026",
};

export const defaultWorkerProfiles: WorkerProfile[] = [
  {
    id: "worker-ruso",
    name: "Ruso",
    role: "Gerencia",
    pin: "1234",
    branch: "RE Motos",
    color: "#0f2a1d",
    active: true,
  },
  {
    id: "worker-manuel",
    name: "Manuel",
    role: "Ventas",
    pin: "1234",
    branch: "RE Motos",
    color: "#3f6f4d",
    active: true,
  },
  {
    id: "worker-valentin",
    name: "Valentin",
    role: "Ventas",
    pin: "1234",
    branch: "RE Motos",
    color: "#5f725e",
    active: true,
  },
];
