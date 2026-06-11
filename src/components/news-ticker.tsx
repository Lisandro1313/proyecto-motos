"use client";

import { useEffect, useMemo, useState } from "react";
import { Newspaper } from "lucide-react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db, hasFirebaseConfig } from "@/lib/firebase";
import { motoTips } from "@/lib/moto-culture";

const TYPE_LABEL: Record<string, string> = {
  venta: "VENTA",
  cobro: "COBRO",
  stock: "STOCK",
  precio: "PRECIO",
  cliente: "CLIENTE",
  perfil: "PERFIL",
};

export function NewsTicker() {
  const [news, setNews] = useState<string[]>([]);

  useEffect(() => {
    if (!hasFirebaseConfig) return;
    const recent = query(
      collection(db, "activity_log"),
      orderBy("createdAt", "desc"),
      limit(15),
    );
    const unsubscribe = onSnapshot(recent, (snap) => {
      setNews(
        snap.docs.map((d) => {
          const event = d.data() as { type?: string; description?: string };
          const label = TYPE_LABEL[event.type || ""] || "RE MOTOS";
          return `${label}: ${event.description || ""}`;
        }),
      );
    });
    return () => unsubscribe();
  }, []);

  const text = useMemo(() => {
    const tips = motoTips.map((tip) => `TIP: ${tip}`);
    const items = [...news, ...tips];
    return items.join(" • ") + " • ";
  }, [news]);

  const duration = Math.max(28, Math.round((text.length * 7 + 1200) / 120));

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
