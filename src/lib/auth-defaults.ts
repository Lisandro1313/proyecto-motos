import type { WorkerProfile } from "@/lib/types";

export const adminCredentials = {
  email: "admin@motocenter.com",
  password: "MotoCenter2026",
};

export const defaultWorkerProfiles: WorkerProfile[] = [
  {
    id: "worker-admin",
    name: "Administrador",
    role: "Gerencia",
    pin: "0000",
    branch: "Casa Central",
    color: "#2563eb",
    active: true,
  },
  {
    id: "worker-camila",
    name: "Camila Ríos",
    role: "Ventas",
    pin: "1234",
    branch: "Casa Central",
    color: "#10b981",
    active: true,
  },
  {
    id: "worker-matias",
    name: "Matías Torres",
    role: "Ventas",
    pin: "2468",
    branch: "Sucursal Norte",
    color: "#f97316",
    active: true,
  },
  {
    id: "worker-nicolas",
    name: "Nicolás Vega",
    role: "Caja",
    pin: "9876",
    branch: "Casa Central",
    color: "#7c3aed",
    active: true,
  },
];
