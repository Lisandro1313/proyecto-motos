"use client";

import Image from "next/image";
import { type ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  CheckCircle2,
  KeyRound,
  LogOut,
  Quote,
  Save,
  ShieldCheck,
} from "lucide-react";
import { MotoAuthBackdrop } from "@/components/moto-auth-backdrop";
import { useAuth } from "@/context/auth-context";
import { readFileAsDataUrl } from "@/lib/file-utils";
import {
  pickDailyQuote,
  pickRandomQuote,
  type MotoQuote,
} from "@/lib/moto-culture";

export function ProfileGate() {
  const router = useRouter();
  const { activeProfile, profiles, selectProfile, updateProfile, logout } =
    useAuth();
  const [selectedProfileId, setSelectedProfileId] = useState(
    profiles.find((profile) => profile.active)?.id || "",
  );
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [quote, setQuote] = useState<MotoQuote>(() => pickDailyQuote());

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuote((currentQuote) => pickRandomQuote(currentQuote.text));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const effectiveProfileId =
    selectedProfileId || profiles.find((profile) => profile.active)?.id || "";

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === effectiveProfileId),
    [profiles, effectiveProfileId],
  );

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    setPhotoPreview(await readFileAsDataUrl(file));
  }

  function handlePinSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!effectiveProfileId) {
      setError("Elegí un perfil para iniciar turno.");
      return;
    }

    const valid = selectProfile(effectiveProfileId, pin);

    if (!valid) {
      setError("PIN incorrecto o perfil inactivo.");
      return;
    }

    setError("");
    setPin("");
    router.push("/");
  }

  function handleProfileUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProfile) return;

    const formData = new FormData(event.currentTarget);
    const nextPin = String(formData.get("pin") || "").trim();

    if (nextPin && !/^\d{4,6}$/.test(nextPin)) {
      setProfileMessage("El PIN debe tener entre 4 y 6 números.");
      return;
    }

    updateProfile(selectedProfile.id, {
      pin: nextPin || selectedProfile.pin,
      photo: photoPreview || selectedProfile.photo,
    });

    setProfileMessage("Perfil actualizado.");
    setPhotoPreview("");
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
            <div className="relative mx-auto size-16 overflow-hidden rounded-2xl bg-[#0f2a1d]">
              <Image
                src="/re-motos-logo.jpeg"
                alt="RE Motos"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <h1 className="mt-4 text-2xl font-semibold text-[#24482f] sm:text-3xl">
              ¿Quién está entrando?
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Elegí tu perfil para iniciar el turno.
            </p>
          </header>

          <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <article>
              <div className="grid gap-3 sm:grid-cols-3">
                {profiles.map((profile) => {
                  const selected = profile.id === effectiveProfileId;

                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => {
                        setSelectedProfileId(profile.id);
                        setError("");
                        setProfileMessage("");
                        setPhotoPreview("");
                      }}
                      className={`min-h-40 rounded-lg border p-4 text-center transition ${
                        selected
                          ? "border-[#3f6f4d] bg-[#f0f7ee] shadow-sm"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      } ${profile.active ? "" : "opacity-50"}`}
                    >
                      <div
                        className="relative mx-auto grid size-16 place-items-center overflow-hidden rounded-full text-lg font-bold text-white"
                        style={{ backgroundColor: profile.color }}
                      >
                        {profile.photo ? (
                          <Image
                            src={profile.photo}
                            alt={profile.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          profile.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <p className="mt-4 font-semibold text-slate-950">
                        {profile.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {profile.role} · {profile.branch}
                      </p>
                      <p
                        className={`mt-3 text-xs font-semibold ${
                          selected ? "text-[#24482f]" : "text-slate-400"
                        }`}
                      >
                        {selected ? "Seleccionado" : "Seleccionar"}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-lg border-l-4 border-[#3f6f4d] bg-[#f0f7ee] p-4">
                <div className="flex gap-3">
                  <Quote className="mt-0.5 size-5 shrink-0 text-[#3f6f4d]" />
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
                  <KeyRound className="size-5 text-[#3f6f4d]" />
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
                  className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-center text-xl font-semibold tracking-[0.28em] outline-none focus:border-[#3f6f4d] sm:text-2xl"
                  placeholder="••••"
                />

                {error ? (
                  <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3f6f4d] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 hover:bg-[#345f41]"
                >
                  <ShieldCheck className="size-4" />
                  Iniciar turno
                </button>
              </form>

              <form
                onSubmit={handleProfileUpdate}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center gap-2">
                  <Camera className="size-5 text-[#3f6f4d]" />
                  <h2 className="text-base font-semibold text-slate-950">
                    PIN y foto
                  </h2>
                </div>

                <label className="mt-4 block space-y-1.5">
                  <span className="text-xs font-semibold uppercase text-slate-500">
                    Nuevo PIN
                  </span>
                  <input
                    name="pin"
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#3f6f4d]"
                    placeholder="Dejar vacío para mantener"
                  />
                </label>

                <label className="mt-3 block space-y-1.5">
                  <span className="text-xs font-semibold uppercase text-slate-500">
                    Foto del perfil
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold"
                  />
                </label>

                {photoPreview ? (
                  <div className="relative mt-3 aspect-square overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={photoPreview}
                      alt="Vista previa"
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                {profileMessage ? (
                  <p className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                    {profileMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Save className="size-4" />
                  Guardar perfil
                </button>
              </form>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {activeProfile ? (
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3f6f4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#345f41]"
                  >
                    <CheckCircle2 className="size-4" />
                    Entrar al panel
                  </button>
                ) : null}
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
        </div>
      </section>
    </MotoAuthBackdrop>
  );
}
