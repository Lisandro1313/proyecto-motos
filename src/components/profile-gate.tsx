"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bike,
  CheckCircle2,
  KeyRound,
  LogOut,
  Plus,
  Quote,
  RotateCcw,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";
import { MotoAuthBackdrop } from "@/components/moto-auth-backdrop";
import { useAuth } from "@/context/auth-context";
import { pickDailyQuote, type MotoQuote } from "@/lib/moto-culture";
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
  const [quote] = useState<MotoQuote>(() => pickDailyQuote());

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
    <MotoAuthBackdrop>
      <section className="flex min-h-screen items-center justify-center px-3 py-6 sm:px-6">
        <div className="w-full max-w-5xl rounded-[18px] border border-white/55 bg-white/94 p-4 shadow-2xl shadow-slate-950/25 backdrop-blur sm:p-7">
          <header className="text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#07111f] text-white">
              <Bike className="size-8 text-blue-400" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-blue-700 sm:text-3xl">
              ¿Quién está entrando?
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Login: <strong>{adminSession?.email}</strong>
            </p>
          </header>

          <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <article>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                      className={`min-h-36 rounded-lg border p-4 text-center transition ${
                        selected
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      } ${profile.active ? "" : "opacity-50"}`}
                    >
                      <div
                        className="mx-auto grid size-16 place-items-center rounded-full text-lg font-bold text-white"
                        style={{ backgroundColor: profile.color }}
                      >
                        {profile.name.slice(0, 2).toUpperCase()}
                      </div>
                      <p className="mt-4 font-semibold text-slate-950">
                        {profile.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {profile.role} · {profile.branch}
                      </p>
                      <p
                        className={`mt-3 text-xs font-semibold ${
                          selected ? "text-blue-700" : "text-slate-400"
                        }`}
                      >
                        {selected ? "Seleccionado" : "Seleccionar"}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-lg border-l-4 border-blue-600 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <Quote className="mt-0.5 size-5 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm italic text-slate-800">
                      &ldquo;{quote.text}&rdquo;
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-600">
                      — {quote.source}
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <aside className="space-y-4">
              <form
                onSubmit={handlePinSubmit}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-2">
                  <KeyRound className="size-5 text-blue-600" />
                  <h2 className="text-base font-semibold text-slate-950">
                    PIN de turno
                  </h2>
                </div>

                <div className="mt-4 rounded-lg bg-white p-3">
                  <p className="text-sm font-semibold text-slate-950">
                    {selectedProfile?.name || "Sin perfil seleccionado"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedProfile
                      ? `${selectedProfile.role} · ${selectedProfile.branch}`
                      : "Elegí un trabajador para continuar"}
                  </p>
                </div>

                <input
                  value={pin}
                  onChange={(event) => setPin(event.target.value)}
                  inputMode="numeric"
                  maxLength={6}
                  className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-center text-xl font-semibold tracking-[0.28em] outline-none focus:border-blue-500 sm:text-2xl"
                  placeholder="••••"
                />

                {error ? (
                  <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#2563eb,#16a34a)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/15 hover:brightness-105"
                >
                  <ShieldCheck className="size-4" />
                  Iniciar turno
                </button>
              </form>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
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
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="size-4" />
                  Nuevo subperfil
                </button>
                <button
                  type="button"
                  onClick={closeSession}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </button>
              </div>
            </aside>
          </section>

          {showCreate ? (
            <form
              onSubmit={handleCreateProfile}
              className="mt-6 rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center gap-2">
                <UserRoundCog className="size-5 text-blue-600" />
                <h2 className="text-base font-semibold text-slate-950">
                  Nuevo subperfil
                </h2>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                <label className="space-y-1.5 lg:col-span-2">
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

              <button
                type="submit"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 sm:w-auto"
              >
                <Plus className="size-4" />
                Crear subperfil
              </button>
            </form>
          ) : null}

          <footer className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Los perfiles inactivos conservan su historial de ventas y cobros.
            </p>
            <div className="flex flex-wrap gap-2">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => toggleProfile(profile.id)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                    profile.active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {profile.name}: {profile.active ? "Activo" : "Inactivo"}
                </button>
              ))}
              <button
                type="button"
                onClick={resetProfiles}
                aria-label="Restaurar perfiles"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="size-3.5" />
                Restaurar
              </button>
            </div>
          </footer>
        </div>
      </section>
    </MotoAuthBackdrop>
  );
}
