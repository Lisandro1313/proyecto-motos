"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bike,
  Eye,
  EyeOff,
  Gauge,
  LockKeyhole,
  Mail,
  Quote,
  ShieldQuestion,
} from "lucide-react";
import { MotoAuthBackdrop } from "@/components/moto-auth-backdrop";
import { useAuth } from "@/context/auth-context";
import {
  pickDailyQuote,
  pickDailyTrivia,
  type MotoQuote,
  type MotoTriviaQuestion,
} from "@/lib/moto-culture";

export function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [trivia] = useState<MotoTriviaQuestion>(() => pickDailyTrivia());
  const [quote] = useState<MotoQuote>(() => pickDailyQuote());

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    if (selectedAnswer !== trivia.answer) {
      setError("La verificación moto no coincide. Probá de nuevo.");
      return;
    }

    const valid = login(email, password);

    if (!valid) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    setError("");
    router.push("/perfiles");
  }

  return (
    <MotoAuthBackdrop>
      <section className="flex min-h-screen items-center justify-center px-3 py-6 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[430px] rounded-[22px] border border-white/55 bg-white/92 p-5 shadow-2xl shadow-slate-950/25 backdrop-blur sm:p-8"
        >
          <div className="mx-auto flex size-24 items-center justify-center rounded-2xl bg-[#07111f] text-white shadow-lg sm:size-28">
            <div className="text-center">
              <Bike className="mx-auto size-9 text-blue-400" />
              <p className="mt-2 text-lg font-semibold leading-none">
                MotoCenter
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Garage OS
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-2xl font-semibold text-blue-700">
              Gestor de Agencia
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Acceso interno para stock, ventas, cuotas y turnos.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Usuario
              </span>
              <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus-within:border-blue-500">
                <Mail className="size-4 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="admin@motocenter.com"
                />
              </div>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                Contraseña
              </span>
              <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus-within:border-blue-500">
                <LockKeyhole className="size-4 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowPassword((value) => !value)}
                  className="grid size-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </label>

            <label className="block space-y-1.5">
              <span className="flex items-start gap-2 text-sm font-medium text-slate-700">
                <ShieldQuestion className="mt-0.5 size-4 shrink-0 text-blue-600" />
                Verificación:{" "}
                <strong className="font-semibold text-blue-700">
                  {trivia.question}
                </strong>
              </span>
              <select
                value={selectedAnswer}
                onChange={(event) => setSelectedAnswer(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="">-- Seleccioná una respuesta --</option>
                {trivia.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-3 text-sm text-slate-600">
              <span>Mantener sesión iniciada</span>
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(event) => setRememberSession(event.target.checked)}
                className="size-4 accent-blue-600"
              />
            </label>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#2563eb,#16a34a)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/15 hover:brightness-105"
          >
            <Gauge className="size-4" />
            Ingresar
          </button>

          <div className="mt-5 rounded-lg border-l-4 border-blue-600 bg-slate-50 p-3">
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
        </form>
      </section>
    </MotoAuthBackdrop>
  );
}
