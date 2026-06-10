"use client";

import { useEffect, useState } from "react";
import { Bike, Gauge, Wrench } from "lucide-react";

const workshopMessages = [
  "Calentando motores...",
  "Revisando bujías...",
  "Ajustando la cadena...",
  "Chequeando aceite...",
  "Inflando neumáticos...",
  "Afinando carburador...",
  "Ordenando el stock en boxes...",
  "Preparando la entrega...",
];

const workshopTips = [
  "Una cadena limpia y lubricada siempre vende confianza.",
  "Antes de entregar una moto: luces, frenos, presión y sonrisa.",
  "Si el motor no regula parejo, la bujía suele contar la historia.",
  "La mejor ficha comercial empieza con el estado real de la moto.",
  "Un buen vendedor conoce el sonido antes que el precio.",
  "Cargar bien el stock hoy evita vueltas raras mañana.",
];

type MotoLoadingScreenProps = {
  mode?: "page" | "overlay";
  title?: string;
};

function nextIndex(currentIndex: number, listLength: number) {
  return (currentIndex + 1) % listLength;
}

export function MotoLoadingScreen({
  mode = "page",
  title,
}: MotoLoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const randomizeTimeout = window.setTimeout(() => {
      setMessageIndex(Math.floor(Math.random() * workshopMessages.length));
      setTipIndex(Math.floor(Math.random() * workshopTips.length));
    }, 0);

    const interval = window.setInterval(() => {
      setMessageIndex((currentIndex) =>
        nextIndex(currentIndex, workshopMessages.length),
      );
      setTipIndex((currentIndex) => nextIndex(currentIndex, workshopTips.length));
    }, 2200);

    return () => {
      window.clearTimeout(randomizeTimeout);
      window.clearInterval(interval);
    };
  }, []);

  const isOverlay = mode === "overlay";
  const currentMessage = title || workshopMessages[messageIndex];

  return (
    <div
      className={
        isOverlay
          ? "fixed inset-0 z-[90] grid place-items-center bg-white/95 px-4 backdrop-blur-md"
          : "grid min-h-screen place-items-center bg-[#f4f7fb] px-4 py-10"
      }
      role="status"
      aria-live="polite"
    >
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-200/70">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
          <Bike className="size-8 animate-[moto-float_1.7s_ease-in-out_infinite]" />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-blue-600">
          <Gauge className="size-5 animate-spin" />
          <p className="text-base font-semibold text-slate-950">
            {currentMessage}
          </p>
        </div>

        <div className="mx-auto mt-4 h-1.5 w-full max-w-64 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-2/3 origin-left rounded-full bg-blue-600 animate-[moto-loading-progress_1.8s_ease-in-out_infinite]" />
        </div>

        <div className="mt-6 rounded-xl border-l-4 border-blue-600 bg-slate-50 p-4 text-left">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            <Wrench className="size-4" />
            Tip de taller
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {workshopTips[tipIndex]}
          </p>
        </div>
      </section>
    </div>
  );
}
