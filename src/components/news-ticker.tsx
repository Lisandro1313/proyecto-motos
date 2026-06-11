"use client";

import { useEffect, useMemo, useState } from "react";
import { Newspaper } from "lucide-react";
import { motoTips } from "@/lib/moto-culture";

type Noticia = {
  categoria: string;
  titulo: string;
  fuente: string;
  url: string;
};

const REFRESH_MS = 30 * 60 * 1000; // 30 minutos

export function NewsTicker() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    let active = true;
    const load = () => {
      fetch("/api/noticias")
        .then((res) => (res.ok ? res.json() : []))
        .then((data: Noticia[]) => {
          if (active && Array.isArray(data)) setNoticias(data);
        })
        .catch(() => undefined);
    };
    load();
    const interval = window.setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const text = useMemo(() => {
    const items =
      noticias.length > 0
        ? noticias.map((n) => `${n.categoria.toUpperCase()}: ${n.titulo}`)
        : motoTips.map((tip) => `RE MOTOS: ${tip}`);
    return items.join("   •   ") + "   •   ";
  }, [noticias]);

  const duration = Math.max(35, Math.round((text.length * 6 + 1200) / 110));

  return (
    <div className="flex h-9 items-center overflow-hidden border-b border-slate-200 bg-[#07111f] text-white">
      <div className="flex h-full shrink-0 items-center gap-1.5 bg-blue-600 px-3">
        <Newspaper className="size-3.5" />
        <span className="text-[0.65rem] font-bold tracking-wide">NOTICIAS</span>
      </div>
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div
          className="animate-ticker flex w-max whitespace-nowrap"
          style={{ animationDuration: `${duration}s` }}
        >
          <span className="px-4 text-xs text-slate-100">{text}</span>
          <span className="px-4 text-xs text-slate-100" aria-hidden>
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
