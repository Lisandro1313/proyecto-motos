"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, Quote, ShieldCheck } from "lucide-react";
import { MotoAuthBackdrop } from "@/components/moto-auth-backdrop";
import { useAuth } from "@/context/auth-context";
import {
  pickDailyQuote,
  pickRandomQuote,
  type MotoQuote,
} from "@/lib/moto-culture";

export function ProfileGate() {
  const router = useRouter();
  const { profiles, selectProfile, logout } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [quote, setQuote] = useState<MotoQuote>(() => pickDailyQuote());

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuote((currentQuote) => pickRandomQuote(currentQuote.text));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedId),
    [profiles, selectedId],
  );

  function chooseProfile(profileId: string) {
    setSelectedId(profileId);
    setPin("");
    setError("");
  }

  function backToGrid() {
    setSelectedId(null);
    setPin("");
    setError("");
  }

  function handlePinSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProfile) return;

    if (!selectProfile(selectedProfile.id, pin)) {
      setError("PIN incorrecto. Probá de nuevo.");
      return;
    }

    router.push("/");
  }

  function closeSession() {
    logout();
    router.push("/login");
  }

  return (
    <MotoAuthBackdrop>
      <section className="flex min-h-screen items-center justify-center px-3 py-6 sm:px-6">
        <div className="w-full max-w-[460px] rounded-[22px] border border-white/55 bg-white/95 p-5 shadow-2xl shadow-slate-950/25 backdrop-blur sm:p-7">
          <header className="text-center">
            <h1 className="text-2xl font-semibold text-blue-700 sm:text-3xl">
              ¿Quién está entrando?
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {selectedProfile
                ? "Ingresá tu PIN para iniciar el turno."
                : "Elegí tu perfil."}
            </p>
          </header>

          {selectedProfile ? (
            <form onSubmit={handlePinSubmit} className="mt-6">
              <div className="flex flex-col items-center">
                <div
                  className="relative grid size-20 place-items-center overflow-hidden rounded-full text-xl font-bold text-white"
                  style={{ backgroundColor: selectedProfile.color }}
                >
                  {selectedProfile.photo ? (
                    <Image
                      src={selectedProfile.photo}
                      alt={selectedProfile.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    selectedProfile.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  {selectedProfile.name}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedProfile.role} · {selectedProfile.branch}
                </p>
              </div>

              <input
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                inputMode="numeric"
                maxLength={6}
                autoFocus
                className="mt-5 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-center text-2xl font-semibold tracking-[0.4em] outline-none focus:border-[#3f6f4d]"
                placeholder="••••"
              />
              <p className="mt-1 text-center text-xs text-slate-400">
                4 a 6 dígitos
              </p>

              {error ? (
                <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-700">
                  {error}
                </p>
              ) : null}

              <div className="mt-5 grid grid-cols-[auto_1fr] gap-2">
                <button
                  type="button"
                  onClick={backToGrid}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="size-4" />
                  Cambiar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3f6f4d] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 hover:bg-[#345f41]"
                >
                  <ShieldCheck className="size-4" />
                  Ingresar
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  disabled={!profile.active}
                  onClick={() => chooseProfile(profile.id)}
                  className={`rounded-xl border border-slate-200 bg-white p-4 text-center transition hover:border-[#3f6f4d] hover:shadow-sm ${
                    profile.active ? "" : "opacity-40"
                  }`}
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
                  <p className="mt-3 font-semibold text-slate-950">
                    {profile.name}
                  </p>
                  <p className="text-xs text-slate-500">{profile.role}</p>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-lg border-l-4 border-blue-600 bg-slate-50 p-3">
            <div className="flex gap-2">
              <Quote className="mt-0.5 size-4 shrink-0 text-blue-600" />
              <div>
                <p className="text-sm italic text-slate-700">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  — {quote.source}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSession}
            className="mx-auto mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 hover:text-slate-600"
          >
            <LogOut className="size-3.5" />
            Cerrar sesión y volver al login
          </button>
        </div>
      </section>
    </MotoAuthBackdrop>
  );
}
