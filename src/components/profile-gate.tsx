"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bike,
  CheckCircle2,
  KeyRound,
  LogOut,
  Plus,
  RotateCcw,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import type { WorkerRole } from "@/lib/types";

const roles: WorkerRole[] = [
  "Gerencia",
  "Ventas",
  "Caja",
  "Administración",
  "Taller",
];

const branches = ["Casa Central", "Sucursal Norte", "Sucursal Oeste"];

export function ProfileGate() {
  const router = useRouter();
  const {
    adminSession,
    activeProfile,
    profiles,
    selectProfile,
    addProfile,
    toggleProfile,
    resetProfiles,
    logout,
  } = useAuth();
  const [selectedProfileId, setSelectedProfileId] = useState(
    profiles.find((profile) => profile.active)?.id || "",
  );
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedProfileId),
    [profiles, selectedProfileId],
  );

  function handlePinSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProfileId) {
      setError("Elegí un perfil para iniciar turno.");
      return;
    }

    const valid = selectProfile(selectedProfileId, pin);

    if (!valid) {
      setError("PIN incorrecto o perfil inactivo.");
      return;
    }

    setError("");
    setPin("");
    router.push("/");
  }

  function handleCreateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPin = String(formData.get("pin") || "").trim();

    if (!/^\d{4,6}$/.test(newPin)) {
      setError("El PIN debe tener entre 4 y 6 números.");
      return;
    }

    addProfile({
      name: String(formData.get("name") || ""),
      role: String(formData.get("role") || "Ventas") as WorkerRole,
      branch: String(formData.get("branch") || "Casa Central"),
      pin: newPin,
      color: String(formData.get("color") || "#2563eb"),
    });

    setError("");
    setShowCreate(false);
    event.currentTarget.reset();
  }

  function closeSession() {
    logout();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-lg bg-blue-600 text-white">
              <Bike className="size-7" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-950">
                MotoCenter
              </p>
              <p className="text-sm text-slate-500">
                Admin: {adminSession?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {activeProfile ? (
              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <CheckCircle2 className="size-4" />
                Entrar al panel
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setShowCreate((value) => !value)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Plus className="size-4" />
              Nuevo subperfil
            </button>
            <button
              type="button"
              onClick={closeSession}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="size-4" />
              Salir
            </button>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <UserRoundCog className="size-5 text-blue-600" />
              <h1 className="text-lg font-semibold text-slate-950">
                Elegir perfil de trabajo
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Cada trabajador inicia turno con su PIN. Las ventas y cobros quedan
              asociados a ese perfil.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {profiles.map((profile) => {
                const selected = profile.id === selectedProfileId;

                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => {
                      setSelectedProfileId(profile.id);
                      setError("");
                    }}
                    className={`rounded-lg border p-4 text-left transition ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    } ${profile.active ? "" : "opacity-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="grid size-11 place-items-center rounded-lg text-sm font-bold text-white"
                        style={{ backgroundColor: profile.color }}
                      >
                        {profile.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-950">
                          {profile.name}
                        </p>
                        <p className="truncate text-sm text-slate-500">
                          {profile.role} · {profile.branch}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {profile.active ? "Activo" : "Inactivo"}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          selected ? "text-blue-700" : "text-slate-400"
                        }`}
                      >
                        {selected ? "Seleccionado" : "Seleccionar"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </article>

          <aside className="space-y-6">
            <form
              onSubmit={handlePinSubmit}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="size-5 text-blue-600" />
                <h2 className="text-base font-semibold text-slate-950">
                  PIN de turno
                </h2>
              </div>

              <div className="mt-4 rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-950">
                  {selectedProfile?.name || "Sin perfil seleccionado"}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedProfile
                    ? `${selectedProfile.role} · ${selectedProfile.branch}`
                    : "Elegí un trabajador para continuar"}
                </p>
              </div>

              <label className="mt-4 block space-y-1.5">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  PIN
                </span>
                <input
                  value={pin}
                  onChange={(event) => setPin(event.target.value)}
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-center text-2xl font-semibold tracking-[0.4em] outline-none focus:border-blue-500"
                  placeholder="••••"
                />
              </label>

              {error ? (
                <p className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <ShieldCheck className="size-4" />
                Iniciar turno
              </button>
            </form>

            {showCreate ? (
              <form
                onSubmit={handleCreateProfile}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h2 className="text-base font-semibold text-slate-950">
                  Nuevo subperfil
                </h2>
                <div className="mt-4 space-y-3">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold uppercase text-slate-500">
                      Nombre
                    </span>
                    <input
                      name="name"
                      required
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      placeholder="Ej: Sofía Benítez"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold uppercase text-slate-500">
                        Rol
                      </span>
                      <select
                        name="role"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      >
                        {roles.map((role) => (
                          <option key={role}>{role}</option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold uppercase text-slate-500">
                        Sucursal
                      </span>
                      <select
                        name="branch"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      >
                        {branches.map((branch) => (
                          <option key={branch}>{branch}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1fr_80px]">
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold uppercase text-slate-500">
                        PIN
                      </span>
                      <input
                        name="pin"
                        required
                        inputMode="numeric"
                        maxLength={6}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        placeholder="1234"
                      />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold uppercase text-slate-500">
                        Color
                      </span>
                      <input
                        name="color"
                        type="color"
                        defaultValue="#2563eb"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white p-1"
                      />
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <Plus className="size-4" />
                  Crear subperfil
                </button>
              </form>
            ) : null}

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">
                    Administración
                  </h2>
                  <p className="text-sm text-slate-500">
                    Activá o pausá perfiles sin borrar historial.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetProfiles}
                  aria-label="Restaurar perfiles"
                  className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="size-4" />
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {profile.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {profile.role} · {profile.branch}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleProfile(profile.id)}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                        profile.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {profile.active ? "Activo" : "Inactivo"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
