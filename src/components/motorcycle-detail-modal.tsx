"use client";

import Image from "next/image";
import { Pencil, X } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { formatMoney } from "@/lib/format";
import type { Motorcycle } from "@/lib/types";

type MotorcycleDetailModalProps = {
  motorcycle: Motorcycle | null;
  onClose: () => void;
  onEdit: (motorcycle: Motorcycle) => void;
};

export function MotorcycleDetailModal({
  motorcycle,
  onClose,
  onEdit,
}: MotorcycleDetailModalProps) {
  if (!motorcycle) return null;

  const installments = [3, 6, 12, 18] as const;
  const hasInstallments = installments.some(
    (n) => motorcycle.cardInstallments?.[n],
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Foto grande */}
        <div className="relative aspect-[4/3] w-full bg-slate-900 sm:aspect-[16/9]">
          <Image
            src={motorcycle.image}
            alt={`${motorcycle.brand} ${motorcycle.model}`}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain"
            priority
          />
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/70"
          >
            <X className="size-5" />
          </button>
          <div className="absolute left-3 top-3">
            <StatusBadge status={motorcycle.status} />
          </div>
        </div>

        {/* Info */}
        <div className="min-h-0 overflow-y-auto p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">
                {motorcycle.brand} {motorcycle.model}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {motorcycle.category} · {motorcycle.branch} · {motorcycle.stock}{" "}
                en stock
              </p>
            </div>
            <p className="text-2xl font-bold text-[#24482f] sm:text-3xl">
              {formatMoney(motorcycle.price, motorcycle.currency)}
            </p>
          </div>

          {hasInstallments ? (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Planes con tarjeta
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {installments.map((n) => {
                  const value = motorcycle.cardInstallments?.[n];
                  if (!value) return null;
                  return (
                    <div
                      key={n}
                      className="rounded-lg border border-slate-200 p-3 text-center"
                    >
                      <p className="text-xs font-semibold text-blue-600">
                        {n} cuotas
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {formatMoney(value, motorcycle.currency)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {motorcycle.notes ? (
            <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              {motorcycle.notes}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => onEdit(motorcycle)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3f6f4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#345f41]"
            >
              <Pencil className="size-4" />
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
