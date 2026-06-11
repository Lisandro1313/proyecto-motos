"use client";

import Image from "next/image";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { Save, Trash2, X } from "lucide-react";
import { readImageAsResizedDataUrl } from "@/lib/file-utils";
import type { Currency, Motorcycle } from "@/lib/types";

const categories = ["Cub", "Street", "Cross", "Trail", "Deportiva"];
const currencies: Currency[] = ["ARS", "USD"];

type EditFields = Partial<
  Pick<
    Motorcycle,
    | "brand"
    | "model"
    | "category"
    | "price"
    | "currency"
    | "cost"
    | "stock"
    | "image"
    | "notes"
    | "cardInstallments"
  >
>;

const planList = [3, 6, 12, 18] as const;

type MotorcycleEditModalProps = {
  motorcycle: Motorcycle | null;
  onClose: () => void;
  onSave: (id: string, fields: EditFields) => void;
  onDelete: (id: string) => void;
};

export function MotorcycleEditModal({
  motorcycle,
  onClose,
  onSave,
  onDelete,
}: MotorcycleEditModalProps) {
  const [photo, setPhoto] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!motorcycle) return null;

  async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    setPhoto(await readImageAsResizedDataUrl(file));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!motorcycle) return;
    const form = new FormData(event.currentTarget);

    const cardInstallments: Partial<Record<3 | 6 | 12 | 18, number>> = {};
    for (const n of planList) {
      const value = Number(form.get(`cuota${n}`) || 0);
      if (value > 0) cardInstallments[n] = value;
    }

    onSave(motorcycle.id, {
      brand: String(form.get("brand") || "").trim() || motorcycle.brand,
      model: String(form.get("model") || "").trim() || motorcycle.model,
      category: String(form.get("category") || motorcycle.category),
      currency: String(form.get("currency") || motorcycle.currency) as Currency,
      price: Number(form.get("price") || 0),
      cost: Number(form.get("cost") || 0),
      stock: Number(form.get("stock") || 0),
      notes: String(form.get("notes") || ""),
      cardInstallments,
      ...(photo ? { image: photo } : {}),
    });
  }

  const preview = photo || motorcycle.image;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">
            Editar moto
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="flex gap-3">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              <Image
                src={preview}
                alt={`${motorcycle.brand} ${motorcycle.model}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <label className="flex-1 space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Cambiar foto
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Marca
              </span>
              <input
                name="brand"
                defaultValue={motorcycle.brand}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Modelo
              </span>
              <input
                name="model"
                defaultValue={motorcycle.model}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Categoría
              </span>
              <select
                name="category"
                defaultValue={motorcycle.category}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Moneda
              </span>
              <select
                name="currency"
                defaultValue={motorcycle.currency}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                {currencies.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Stock
              </span>
              <input
                name="stock"
                type="number"
                min="0"
                defaultValue={motorcycle.stock}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Precio de lista
              </span>
              <input
                name="price"
                type="number"
                min="0"
                defaultValue={motorcycle.price}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Costo del proveedor
              </span>
              <input
                name="cost"
                type="number"
                min="0"
                defaultValue={motorcycle.cost}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Nota
            </span>
            <input
              name="notes"
              defaultValue={motorcycle.notes || ""}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Color, condición, observaciones"
            />
          </label>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Cuota por plan (tarjeta)
            </span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {planList.map((n) => (
                <label key={n} className="space-y-1">
                  <span className="block text-xs text-slate-500">
                    {n} cuotas
                  </span>
                  <input
                    name={`cuota${n}`}
                    type="number"
                    min="0"
                    defaultValue={motorcycle.cardInstallments?.[n] || ""}
                    className="w-full rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none focus:border-blue-500"
                    placeholder="0"
                  />
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              Es el valor de cada cuota. Dejá en 0 si ese plan no aplica.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-700">¿Eliminar?</span>
                <button
                  type="button"
                  onClick={() => onDelete(motorcycle.id)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Sí, eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 className="size-4" />
                Eliminar
              </button>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3f6f4d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#345f41]"
            >
              <Save className="size-4" />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
