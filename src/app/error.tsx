"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto grid size-14 place-items-center rounded-lg bg-amber-500 text-white">
          <AlertTriangle className="size-7" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-950">
          Algo se trabó en boxes
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          No se perdió nada. Probá recargar esta sección o volvé al panel.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <RefreshCcw className="size-4" />
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Volver al panel
          </Link>
        </div>
      </section>
    </main>
  );
}
