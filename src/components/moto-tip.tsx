"use client";

import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import { motoTips } from "@/lib/moto-culture";

// Tip de moto que rota cada minuto. Llena el espacio del sidebar con vida.
export function MotoTip() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % motoTips.length);
    }, 60000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-1.5 text-blue-300">
        <Wrench className="size-3.5" />
        <span className="text-[0.65rem] font-bold uppercase tracking-wide">
          Tip de taller
        </span>
      </div>
      <p className="mt-1.5 text-sm italic leading-snug text-slate-200">
        {motoTips[index]}
      </p>
    </div>
  );
}
