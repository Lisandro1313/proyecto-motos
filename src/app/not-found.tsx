import Link from "next/link";
import { Bike } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f7fb] px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto grid size-14 place-items-center rounded-lg bg-blue-600 text-white">
          <Bike className="size-7" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-950">
          Ruta no encontrada
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Esa sección no existe o todavía no está habilitada.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Volver al panel
        </Link>
      </section>
    </main>
  );
}
