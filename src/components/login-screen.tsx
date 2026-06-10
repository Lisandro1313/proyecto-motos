"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Bike, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const valid = login(email, password);

    if (!valid) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    setError("");
    router.push("/perfiles");
  }

  return (
    <main className="grid min-h-screen bg-[#f4f7fb] lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden bg-[#070b16] p-8 text-white lg:block">
        <div className="flex h-full flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-white/5 p-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-lg bg-blue-600">
                <Bike className="size-7" />
              </div>
              <div>
                <p className="text-2xl font-semibold">MotoCenter</p>
                <p className="text-sm uppercase text-slate-400">
                  Agencia de motos
                </p>
              </div>
            </div>
            <h1 className="mt-16 max-w-md text-5xl font-semibold leading-tight">
              Control interno para ventas, stock y cuotas.
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["Stock", "Ventas", "Cuotas"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 p-4">
                <p className="text-sm font-semibold">{item}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Acceso por perfil y turno
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid size-12 place-items-center rounded-lg bg-blue-600 text-white">
            <LockKeyhole className="size-6" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-slate-950">
            Iniciar sesión
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Primero ingresa el administrador. Después cada trabajador entra con
            su PIN.
          </p>

          <div className="mt-6 space-y-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Correo administrador
              </span>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 focus-within:border-blue-500">
                <Mail className="size-4 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full text-sm outline-none"
                  placeholder="admin@motocenter.com"
                />
              </div>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Contraseña
              </span>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 focus-within:border-blue-500">
                <LockKeyhole className="size-4 text-slate-400" />
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full text-sm outline-none"
                  placeholder="Contraseña"
                />
              </div>
            </label>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Continuar
          </button>
        </form>
      </section>
    </main>
  );
}
