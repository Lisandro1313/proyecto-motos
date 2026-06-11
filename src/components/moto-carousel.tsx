"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, hasFirebaseConfig } from "@/lib/firebase";

const LOGO = "/re-motos-logo.jpeg";

type Slide = { id: string; image: string; label: string };

// Carrusel liviano de fotos de motos para el sidebar.
// Suscripción mínima a la colección de motos (solo imagen + nombre).
export function MotoCarousel() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!hasFirebaseConfig) return;
    const unsubscribe = onSnapshot(collection(db, "motorcycles"), (snap) => {
      const withPhoto = snap.docs
        .map((d) => {
          const data = d.data() as { image?: string; brand?: string; model?: string };
          return {
            id: d.id,
            image: data.image || LOGO,
            label: `${data.brand || ""} ${data.model || ""}`.trim(),
          };
        })
        .filter((slide) => slide.image && slide.image !== LOGO);
      setSlides(withPhoto);
      setIndex(0);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  // Sin fotos cargadas todavía: logo solo, sin texto.
  if (slides.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/5">
        <Image
          src={LOGO}
          alt="RE Motos"
          fill
          sizes="240px"
          className="object-contain p-4 opacity-80"
        />
      </div>
    );
  }

  const current = slides[index];

  return (
    <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/30">
      <Image
        key={current.id}
        src={current.image}
        alt={current.label}
        fill
        sizes="240px"
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <p className="truncate text-sm font-semibold text-white">
          {current.label}
        </p>
      </div>
      {slides.length > 1 ? (
        <div className="absolute right-2 top-2 flex gap-1">
          {slides.map((slide, i) => (
            <span
              key={slide.id}
              className={`size-1.5 rounded-full ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
